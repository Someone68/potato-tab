<script lang="ts">
	import Time from '$lib/components/time.svelte';
	import Section from '$lib/components/section.svelte';
	import Background from '$lib/components/background.svelte';
	import { readToken, initTheme } from '$lib/index';

	const theme = initTheme();
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
	color={readToken('surface')}
/>

<Section>
	<Time />
	{#each Object.entries(theme?.dark ?? {}) as [key, value] (key)}
		<p style="color: {value}">{key}: {value}</p>
	{/each}
</Section>
