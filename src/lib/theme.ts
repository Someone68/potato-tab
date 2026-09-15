import {
	Hct,
	SchemeTonalSpot,
	MaterialDynamicColors,
	argbFromHex,
	hexFromArgb,
	DynamicColor,
	QuantizerCelebi,
	Score
} from '@material/material-color-utilities';
import { browser } from '$app/environment';

export type Role = {
	[K in keyof typeof MaterialDynamicColors]: (typeof MaterialDynamicColors)[K] extends DynamicColor
		? K
		: never;
}[keyof typeof MaterialDynamicColors];

export type Tokens = Record<Role, string>;

export type Theme = {
	light: Tokens;
	dark: Tokens;
};

export type Mode = 'light' | 'dark' | 'system';
export type ResolvedMode = 'light' | 'dark';

export const DEFAULT_SEED = '#4285F4';

const CSS_PREFIX = '--cs-';
const SEED_KEY = 'theme-seed';
const MODE_KEY = 'theme-mode';
const CSS_KEY = 'theme-css';
const CONTRAST_KEY = 'theme-contrast';

const DARK_QUERY = '(prefers-color-scheme: dark)';
const HEX = /^#?(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const kebab = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

function read(key: string): string | null {
	if (!browser) return null;
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function write(key: string, value: string) {
	if (!browser) return;
	try {
		localStorage.setItem(key, value);
	} catch {
		console.warn(
			`Failed to save "${key}" to localStorage! User is in incognito mode or their storage is full.`
		);
	}
}

/** Validate and canonicalise a seed to `#rrggbb`, falling back to the default. */
export function normalizeSeed(value: unknown): string {
	if (typeof value !== 'string' || !HEX.test(value.trim())) return DEFAULT_SEED;
	try {
		return hexFromArgb(argbFromHex(value.trim()));
	} catch {
		return DEFAULT_SEED;
	}
}

function tokens(scheme: SchemeTonalSpot): Tokens {
	const out = {} as Tokens;
	for (const [name, dc] of Object.entries(MaterialDynamicColors)) {
		if (dc instanceof DynamicColor) {
			out[name as Role] = hexFromArgb(dc.getArgb(scheme));
		}
	}
	return out;
}

export function generate(seed: string, contrast = 0): Theme {
	const source = Hct.fromInt(argbFromHex(normalizeSeed(seed)));
	return {
		light: tokens(new SchemeTonalSpot(source, false, contrast)),
		dark: tokens(new SchemeTonalSpot(source, true, contrast))
	};
}

const decls = (t: Tokens) =>
	Object.entries(t)
		.map(([k, v]) => `${CSS_PREFIX}${kebab(k)}:${v}`)
		.join(';');

export function buildCss(t: Theme) {
	return [
		`:root{color-scheme:light dark;${decls(t.light)}}`,
		`:root[data-theme="light"]{color-scheme:light;${decls(t.light)}}`,
		`:root[data-theme="dark"]{color-scheme:dark;${decls(t.dark)}}`,
		`@media (prefers-color-scheme:dark){:root:not([data-theme="light"])` +
			`{color-scheme:dark;${decls(t.dark)}}}`
	].join('\n');
}

let sheet: CSSStyleSheet | null = null;
let fallbackStyle: HTMLStyleElement | null = null;

export function applyCss(t: Theme): string {
	const css = buildCss(t);
	if (!browser) return css;

	// Constructable stylesheets are adopted after the document's own sheets, so
	// they win over the cached <style> that app.html injects before hydration.
	if (typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype) {
		if (!sheet) {
			sheet = new CSSStyleSheet();
			document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
		}
		sheet.replaceSync(css);
	} else {
		if (!fallbackStyle) {
			fallbackStyle = document.createElement('style');
			document.head.append(fallbackStyle);
		}
		fallbackStyle.textContent = css;
	}
	return css;
}

export function setMode(m: Mode) {
	if (!browser) return;
	const root = document.documentElement;
	if (m === 'system') delete root.dataset.theme;
	else root.dataset.theme = m;
	write(MODE_KEY, m);
}

export function getSeed(): string {
	return normalizeSeed(read(SEED_KEY));
}

export function getMode(): Mode {
	const m = read(MODE_KEY);
	if (m === 'light' || m === 'dark' || m === 'system') return m;
	return 'system';
}

export function getContrast(): number {
	const c = Number(read(CONTRAST_KEY));
	return Number.isFinite(c) ? Math.min(1, Math.max(-1, c)) : 0;
}

/** Whether the OS currently asks for a dark theme. */
export function systemPrefersDark(): boolean {
	if (!browser || typeof matchMedia === 'undefined') return false;
	return matchMedia(DARK_QUERY).matches;
}

/** Collapse `system` down to the scheme actually on screen. */
export function resolveMode(m: Mode, systemDark = systemPrefersDark()): ResolvedMode {
	if (m === 'light' || m === 'dark') return m;
	return systemDark ? 'dark' : 'light';
}

/** Subscribe to OS theme changes. Returns an unsubscribe function. */
export function watchSystemMode(cb: (dark: boolean) => void): () => void {
	if (!browser || typeof matchMedia === 'undefined') return () => {};
	const mq = matchMedia(DARK_QUERY);
	const onChange = (e: MediaQueryListEvent) => cb(e.matches);
	mq.addEventListener('change', onChange);
	return () => mq.removeEventListener('change', onChange);
}

export function initTheme(seed = getSeed(), contrast = getContrast()): Theme | null {
	if (!browser) return null;
	const normalized = normalizeSeed(seed);
	const theme = generate(normalized, contrast);
	const css = applyCss(theme);
	write(SEED_KEY, normalized);
	write(CONTRAST_KEY, String(contrast));
	write(CSS_KEY, css);
	return theme;
}

export function readToken(role: Role, fallback: string = ''): string {
	if (!browser) {
		console.warn(`readToken: document is undefined, returning fallback: ${fallback}`);
		return fallback;
	}
	return (
		getComputedStyle(document.documentElement)
			.getPropertyValue(`${CSS_PREFIX}${kebab(role)}`)
			.trim() || fallback
	);
}

// image stuff

function deterministic<T>(fn: () => T): T {
	const real = Math.random;
	let s = 0x2f6e2b1;
	Math.random = () => ((s = (s * 1664525 + 1013904223) >>> 0), s / 0x100000000);
	try {
		return fn();
	} finally {
		Math.random = real;
	}
}

const MAX_DIM = 128;
async function loadImage(src: HTMLImageElement | Blob | string): Promise<HTMLImageElement> {
	if (src instanceof HTMLImageElement) {
		if (!src.complete) await src.decode();
		return src;
	}
	const url = src instanceof Blob ? URL.createObjectURL(src) : src;
	const img = new Image();
	if (!(src instanceof Blob)) img.crossOrigin = 'anonymous';
	img.src = url;
	try {
		await img.decode();
	} finally {
		if (src instanceof Blob) URL.revokeObjectURL(url);
	}
	return img;
}

function argbPixels(img: HTMLImageElement): number[] {
	const w = img.naturalWidth || img.width;
	const h = img.naturalHeight || img.height;
	const scale = Math.min(1, MAX_DIM / Math.max(w, h));
	const cw = Math.max(1, Math.round(w * scale));
	const ch = Math.max(1, Math.round(h * scale));

	const canvas = document.createElement('canvas');
	canvas.width = cw;
	canvas.height = ch;
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) throw new Error('2d context unavailable');
	ctx.drawImage(img, 0, 0, cw, ch);

	const { data } = ctx.getImageData(0, 0, cw, ch);
	const out: number[] = [];
	for (let i = 0; i < data.length; i += 4) {
		const a = data[i + 3];
		out.push((a << 24) | (data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
	}
	return out;
}

const cache = new Map<string, string>();

export async function seedFromImage(src: HTMLImageElement | Blob | string): Promise<string> {
	const key =
		typeof src === 'string'
			? src
			: src instanceof HTMLImageElement
				? src.currentSrc || src.src
				: null;
	if (key && cache.has(key)) return cache.get(key)!;
	if (!browser) return DEFAULT_SEED;
	try {
		const img = await loadImage(src);
		const pixels = argbPixels(img);
		const quantized = deterministic(() => QuantizerCelebi.quantize(pixels, 128));
		const ranked = Score.score(quantized);
		return normalizeSeed(hexFromArgb(ranked[0]));
	} catch (e) {
		console.warn('seedFromImage failed:', e);
		return DEFAULT_SEED;
	}

	if (key) cache.set(key, seed);
	return seed;
}
