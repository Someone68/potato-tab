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
		type Mode
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

	type Settings = {
		backgroundType: BackgroundType;
		backgroundColor: string;
		backgroundImage: string;
		backgroundGradient: GradientSettings;
		backgroundBrightness: number;
		backgroundBlur: number;
	};

	const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('settings') : null;
	const stored = JSON.parse(raw ?? 'null') ?? {};

	let settings = $state<Settings>({
		backgroundType: stored.backgroundType ?? 'color',
		backgroundColor: stored.backgroundColor ?? 'default',
		backgroundImage: stored.backgroundImage ?? '',
		backgroundGradient: stored.backgroundGradient ?? {},
		backgroundBrightness: stored.backgroundBrightness ?? 100,
		backgroundBlur: stored.backgroundBlur ?? 0
	});

	$effect(() => {
		localStorage.setItem('settings', JSON.stringify(settings));
	});

	// ---
	// other stuff
	// ---

	let settingsOpen = $state(false);
</script>

<Background
	type={settings.backgroundType}
	src={settings.backgroundImage}
	brightness={settings.backgroundBrightness}
	blur={settings.backgroundBlur}
	gradientSettings={settings.backgroundGradient}
	color={settings.backgroundColor && settings.backgroundColor !== 'default'
		? settings.backgroundColor
		: bgColor}
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
			<h2>theme</h2>
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
					<p>image url</p>
					<TextInput
						bind:value={() => settings.backgroundImage ?? '', (v) => (settings.backgroundImage = v)}
						placeholder="https://..."
						variant="regular"
					/>
				</div>
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
</style>
