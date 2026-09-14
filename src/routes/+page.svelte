<script lang="ts">
	import { browser } from '$app/environment';

	import Time from '$lib/components/time.svelte';
	import Section from '$lib/components/section.svelte';
	import Background from '$lib/components/background.svelte';
	import Button from '$lib/components/button.svelte';
	import Switch from '$lib/components/switch.svelte';
	import ColorPicker from '$lib/components/colorpicker.svelte';
	import Corner from '$lib/components/corner.svelte';

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
</script>

<Background
	type="color"
	src="https://i.pinimg.com/originals/07/3f/be/073fbe9f5026b169d39e17fb85c09d8c.jpg"
	brightness={50}
	blur={0}
	gradientSettings={{
		colors: ['red', 'blue'],
		angle: '135deg'
	}}
	color={bgColor}
/>

<Corner corner="top_left">
	<Section>
		<Time />
		<!-- <Button variant="regular" filled={true}>regular filled</Button>
	<Button variant="primary" filled={true}>primary filled</Button>
	<Button variant="secondary" filled={true}>secondary filled</Button>
	<Button variant="tertiary" filled={true}>tertiary filled</Button>
	<Button variant="error" filled={true}>error filled</Button>
	<Button variant="regular" filled={false}>regular outline</Button>
	<Button variant="primary" filled={false}>primary outline</Button>
	<Button variant="secondary" filled={false}>secondary outline</Button>
	<Button variant="tertiary" filled={false}>tertiary outline</Button>
	<Button variant="error" filled={false}>error outline</Button> -->
		<!-- <br /> -->
		<Switch
			label="dark mode"
			checked={resolved === 'dark'}
			onchange={(e: Event) =>
				(mode = (e.currentTarget as HTMLInputElement).checked ? 'dark' : 'light')}
		/>
		<Button variant="regular" filled={false} onclick={() => (mode = 'system')}>use system</Button>
		<!-- <br />
	<TextInput variant="regular" placeholder="test" />
	<TextInput variant="primary" placeholder="test" />
	<TextInput variant="secondary" placeholder="test" />
	<TextInput variant="tertiary" placeholder="test" />
	<TextInput variant="error" placeholder="test" /> -->
		<br />
		<ColorPicker bind:value={seed} />
		<!-- {#each Object.entries(tokens ?? {}) as [key, value] (key)}
		<p style="color: {value}">{key}: {value}</p>
	{/each} -->
	</Section>
</Corner>

<Corner corner="bottom_right">
	<Section corner="bottom_right">
		<p>bottom right</p>
	</Section>
</Corner>

<Corner corner="top_right">
	<Section corner="top_right">
		<p>top right</p>
	</Section>
</Corner>
