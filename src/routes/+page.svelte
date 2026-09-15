<script lang="ts">
	import { browser } from '$app/environment';

	import Time from '$lib/components/time.svelte';
	import Section from '$lib/components/section.svelte';
	import Background from '$lib/components/background.svelte';
	import ColorPicker from '$lib/components/colorpicker.svelte';
	import Corner from '$lib/components/corner.svelte';
	import TextButton from '$lib/components/text_button.svelte';
	import Sidebar from '$lib/components/sidebar.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import Switch from '$lib/components/switch.svelte';
	import Slider from '$lib/components/slider.svelte';
	import Button from '$lib/components/button.svelte';
	import FileSelect from '$lib/components/file_select.svelte';

	import { get, set, del } from 'idb-keyval';
	import { onMount } from 'svelte';

	// ---
	// theme mgmt and colors
	// ---
	import {
		initTheme,
		getSeed,
		getMode,
		resolveMode,
		systemPrefersDark,
		setMode,
		watchSystemMode,
		DEFAULT_SEED,
		type Theme,
		type Mode,
		seedFromImage
	} from '$lib/theme';
	import Space from '$lib/components/space.svelte';
	import type { BackgroundType, GradientSettings } from '$lib/misc';
	import TextInput from '$lib/components/text_input.svelte';

	let seed = $state(browser ? getSeed() : DEFAULT_SEED);
	let mode = $state<Mode>(browser ? getMode() : 'system');
	let systemDark = $state(browser ? systemPrefersDark() : false);

	// ignore the warning lmao
	// eslint-disable-next-line svelte/prefer-writable-derived
	let theme = $state<Theme | null>(null);

	$effect(() => {
		theme = initTheme(seed);
	});

	$effect(() => {
		setMode(mode);
	});

	$effect(() => watchSystemMode((dark) => (systemDark = dark)));

	let resolved = $derived(resolveMode(mode, systemDark));
	let tokens = $derived(theme?.[resolved] ?? null);
	let bgColor = $derived(tokens?.surface ?? 'var(--cs-surface)');

	// ---
	// other settings
	// ---

	type ImageSource = 'url' | 'upload';

	type Settings = {
		backgroundType: BackgroundType;
		backgroundColor: string;
		backgroundImage: string;
		backgroundImageSource: ImageSource;
		backgroundGradient: GradientSettings;
		backgroundBrightness: number;
		backgroundBlur: number;
	};

	function loadStored(): Partial<Settings> {
		if (!browser) return {};
		try {
			return JSON.parse(localStorage.getItem('settings') ?? 'null') ?? {};
		} catch {
			return {};
		}
	}
	const stored = loadStored();

	let settings = $state<Settings>({
		backgroundType: stored.backgroundType ?? 'color',
		backgroundColor: stored.backgroundColor ?? 'default',
		backgroundImage: stored.backgroundImage ?? '',
		backgroundImageSource: stored.backgroundImageSource ?? 'url',
		backgroundGradient: stored.backgroundGradient ?? {
			angle: 'to bottom',
			colors: ['#FFFFFF', '#000000']
		},
		backgroundBrightness: stored.backgroundBrightness ?? 100,
		backgroundBlur: stored.backgroundBlur ?? 0
	});

	$effect(() => {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem('settings', JSON.stringify(settings));
	});

	let bgUrl = $state<string | null>(null);

	const activeBg = $derived(
		settings.backgroundType !== 'image'
			? null
			: settings.backgroundImageSource === 'upload'
				? bgUrl
				: settings.backgroundImage || null
	);

	onMount(async () => {
		const blob = await get<Blob>('bg');
		if (blob) show(blob);
	});

	async function onFile(
		e: Event & { currentTarget: EventTarget & HTMLInputElement }
	): Promise<void> {
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		await set('bg', file);
		show(file);
		settings.backgroundImageSource = 'upload'; // switch on upload
	}

	async function clearBg(): Promise<void> {
		await del('bg');
		show(null);
		settings.backgroundImageSource = 'url';
	}

	$effect(() => () => {
		if (bgUrl) URL.revokeObjectURL(bgUrl); // revoke on unmount
	});

	// ---
	// other stuff
	// ---

	let settingsOpen = $state(false);
	let settingTheme = $state(false);

	let bgBlob = $state<Blob | null>(null);

	function show(blob: Blob | null) {
		if (bgUrl) URL.revokeObjectURL(bgUrl);
		bgUrl = blob ? URL.createObjectURL(blob) : null;
		bgBlob = blob;
	}

	async function setThemeFromImage(): Promise<void> {
		const src: Blob | string | null =
			settings.backgroundImageSource === 'upload' ? bgBlob : settings.backgroundImage || null;
		if (!src) return;

		settingTheme = true;
		try {
			seed = await seedFromImage(src);
		} finally {
			settingTheme = false;
		}
	}

	const moveElement = (arr: string[], from: number, to: number) => (
		arr.splice(to, 0, arr.splice(from, 1)[0]),
		arr
	);
</script>

<Background
	type={settings.backgroundType}
	src={activeBg ?? ''}
	brightness={settings.backgroundBrightness}
	blur={settings.backgroundBlur}
	gradientSettings={settings.backgroundGradient}
	color={settings.backgroundColor && settings.backgroundColor !== 'default'
		? settings.backgroundColor
		: bgColor}
	onclick={() => {
		settingsOpen = false;
	}}
/>

<Corner corner="top_left">
	<Section>
		<Time />
	</Section>
</Corner>

<Corner corner="bottom_right">
	<Section corner="bottom_right" border={false}>
		<p>bottom right</p>
	</Section>
</Corner>

<Corner corner="top_right">
	<Section corner="top_right" border={false}>
		<TextButton
			variant="primary"
			icon="settings"
			onclick={() => {
				settingsOpen = !settingsOpen;
			}}>Settings</TextButton
		>
	</Section>
</Corner>

<Corner corner="bottom_left">
	<Section corner="bottom_left">
		<p>bottom left</p>
	</Section>
</Corner>

{#if settingsOpen}
	<Sidebar side="right" title="potato-tab" onClose={() => (settingsOpen = false)}>
		<div class="proplist">
			<hr />
			<Space height={5} />
			<div class="property">
				<h2>theme</h2>
				<div class="circles">
					<div class="circle" style="background-color: var(--cs-on-surface)"></div>
					<div class="circle" style="background-color: var(--cs-primary)"></div>
					<div class="circle" style="background-color: var(--cs-secondary)"></div>
					<div class="circle" style="background-color: var(--cs-tertiary)"></div>
					<div class="circle" style="background-color: var(--cs-primary-container)"></div>
					<div class="circle" style="background-color: var(--cs-secondary-container)"></div>
					<div class="circle" style="background-color: var(--cs-tertiary-container)"></div>
				</div>
			</div>
			<div class="property">
				<p>scheme</p>
				<Dropdown
					options={[
						{ value: 'light', label: 'light' },
						{ value: 'dark', label: 'dark' },
						{ value: 'system', label: 'system' }
					]}
					bind:value={mode}
					placeholder="theme"
					variant="regular"
				/>
			</div>
			<div class="property">
				<p>color seed</p>
				<ColorPicker bind:value={seed} />
			</div>

			{#if settings.backgroundType === 'image'}
				<div class="property">
					<p>use image</p>
					<Button variant="primary" onclick={setThemeFromImage} disabled={settingTheme || !activeBg}
						>get seed from image</Button
					>
				</div>
			{/if}

			<h2>background</h2>

			<div class="property">
				<p>type</p>
				<Dropdown
					options={[
						{ value: 'color', label: 'color' },
						{ value: 'image', label: 'image' },
						{ value: 'gradient', label: 'gradient' }
					]}
					bind:value={settings.backgroundType}
					placeholder="background type"
					variant="regular"
				/>
			</div>

			{#if settings.backgroundType === 'image'}
				<div class="property">
					<p>image source</p>
					<Dropdown
						options={[
							{ value: 'url', label: 'url' },
							{ value: 'upload', label: 'upload' }
						]}
						bind:value={settings.backgroundImageSource}
						variant="regular"
					/>
				</div>
				{#if settings.backgroundImageSource === 'url'}
					<div class="property">
						<p>image url</p>
						<TextInput
							bind:value={
								() => settings.backgroundImage ?? '', (v) => (settings.backgroundImage = v)
							}
							placeholder="https://..."
							variant="regular"
						/>
					</div>
				{:else}
					<div class="property">
						<p>image file</p>
						<FileSelect onchange={onFile} />
					</div>
					{#if bgUrl}
						<div class="property">
							<p>remove</p>
							<Button variant="error" onclick={clearBg}>clear image</Button>
						</div>
					{/if}
				{/if}
				<div class="property">
					<p>image brightness</p>
					<Slider
						bind:value={settings.backgroundBrightness}
						min={0}
						max={100}
						defaultValue={100}
						step={5}
						showValue
						variant="primary"
					/>
				</div>
				<div class="property">
					<p>image blur</p>
					<Slider
						bind:value={settings.backgroundBlur}
						min={0}
						max={100}
						defaultValue={0}
						step={5}
						showValue
						variant="primary"
					/>
				</div>
			{/if}

			{#if settings.backgroundType === 'color'}
				<div class="property">
					<p>override color</p>
					<Switch
						checked={settings.backgroundColor !== undefined &&
							settings.backgroundColor !== 'default'}
						onchange={(e) =>
							(settings.backgroundColor = (e.currentTarget as HTMLInputElement).checked
								? '#000000'
								: 'default')}
					/>
				</div>

				{#if settings.backgroundColor && settings.backgroundColor !== 'default'}
					<div class="property">
						<p>color override</p>
						<ColorPicker bind:value={settings.backgroundColor} />
					</div>
				{/if}
			{/if}

			{#if settings.backgroundType === 'gradient'}
				<div class="property">
					<p>gradient angle</p>
					<Dropdown
						options={[
							{ value: 'to bottom', label: 'to bottom' },
							{ value: 'to top', label: 'to top' },
							{ value: 'to left', label: 'to left' },
							{ value: 'to right', label: 'to right' },
							{ value: 'custom', label: 'custom' }
						]}
						bind:value={settings.backgroundGradient.angle}
					/>
				</div>
				{#if settings.backgroundGradient.angle === 'custom'}
					<div class="property">
						<p>custom angle</p>
						<TextInput number bind:value={settings.backgroundGradient.angle}></TextInput>
					</div>
				{/if}
				<div class="property">
					<p>gradient colors</p>
				</div>

				{#each settings.backgroundGradient.colors, i}
					<div class="property">
						<ColorPicker bind:value={settings.backgroundGradient.colors![i]} />
						<div style="display: flex;">
							<TextButton
								variant="secondary"
								iconOnly
								icon="arrow_upward"
								onclick={() => {
									if (settings.backgroundGradient.colors)
										moveElement(settings.backgroundGradient.colors, i, i - 1);
								}}
							></TextButton>
							<TextButton
								variant="tertiary"
								iconOnly
								icon="arrow_downward"
								onclick={() => {
									if (settings.backgroundGradient.colors)
										moveElement(settings.backgroundGradient.colors, i, i + 1);
								}}
							></TextButton>
							<TextButton
								variant="error"
								iconOnly
								icon="delete"
								onclick={() => {
									settings.backgroundGradient.colors?.splice(i, 1);
								}}
							></TextButton>
						</div>
					</div>
				{/each}

				<Button
					variant="primary"
					onclick={() => {
						settings.backgroundGradient.colors?.push('#FFFFFF');
					}}
				>
					add color
				</Button>
			{/if}
		</div>
	</Sidebar>
{/if}

<style>
	.proplist {
		display: flex;
		flex-direction: column;
		gap: 5px;
		margin: 10px 0;
	}

	.property {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.circles {
		display: flex;
		gap: 5px;
	}

	.circle {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}
</style>
