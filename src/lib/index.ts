import {
	Hct,
	SchemeTonalSpot,
	MaterialDynamicColors,
	argbFromHex,
	hexFromArgb,
	DynamicColor
} from '@material/material-color-utilities';

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

export const DEFAULT_SEED = '#4285F4';

const CSS_PREFIX = '--cs-';
const SEED_KEY = 'theme-seed';
const MODE_KEY = 'theme-mode';
const CSS_KEY = 'theme-css';

const kebab = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

function tokens(scheme: SchemeTonalSpot): Tokens {
	const out: Tokens = {};
	for (const [name, dc] of Object.entries(MaterialDynamicColors)) {
		if (dc instanceof DynamicColor) {
			out[name as Role] = hexFromArgb(dc.getArgb(scheme));
		}
	}
	return out;
}

export function generate(seed: string, contrast = 0): Theme {
	const source = Hct.fromInt(argbFromHex(seed));
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

export function applyCss(t: Theme): string {
	const css = buildCss(t);
	if (!sheet) {
		sheet = new CSSStyleSheet();
	}
	sheet.replaceSync(css);
	return css;
}

export function setMode(m: Mode) {
	const root = document.documentElement;
	if (m === 'system') delete root.dataset.theme;
	else root.dataset.theme = m;
	try {
		localStorage.setItem(MODE_KEY, m);
	} catch {
		console.warn(
			'Failed to save mode to localStorage! User is in incognito mode or their storage is full.'
		);
	}
}

export function getMode(): Mode {
	try {
		const m = localStorage.getItem(MODE_KEY);
		if (m === 'light' || m === 'dark' || m === 'system') return m;
	} catch {
		// ignore
	}
	return 'system';
}

export function getSeed(): string {
	try {
		return localStorage.getItem(SEED_KEY) ?? DEFAULT_SEED;
	} catch {
		return DEFAULT_SEED;
	}
}

export function initTheme(seed = getSeed(), contrast = 0): Theme | null {
	if (typeof document === 'undefined') return null;
	const theme = generate(seed, contrast);
	const css = applyCss(theme);
	try {
		localStorage.setItem(SEED_KEY, seed);
		localStorage.setItem(CSS_KEY, css);
	} catch {
		/* ignore */
	}
	return theme;
}

export function readToken(role: Role, fallback: string = ''): string {
	if (typeof document === 'undefined') {
		console.warn(`readToken: document is undefined, returning fallback: ${fallback}`);
		return fallback;
	}
	return getComputedStyle(document.documentElement)
		.getPropertyValue(`${CSS_PREFIX}${kebab(role)}`)
		.trim();
}
