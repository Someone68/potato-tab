<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { BackgroundType, GradientSettings } from '../misc';

	type Props = HTMLAttributes<HTMLDivElement> & {
		class?: string;
		type?: BackgroundType;
		src?: string;
		color?: string;
		gradientSettings?: GradientSettings;
		brightness?: number;
		blur?: number;
	};

	let {
		class: className = '',
		type = 'color',
		src = $bindable(''),
		color = '#0b0e14',
		gradientSettings = {},
		brightness = 100,
		blur = 0,
		...rest
	}: Props = $props();
</script>

{#if type === 'gradient'}
	<div
		class={className}
		style:background="linear-gradient({gradientSettings.angle ?? '180deg'}, {(
			gradientSettings.colors ?? [color, color]
		).join(', ')})"
		{...rest}
	></div>
{:else if type === 'image'}
	<div
		class={className}
		style:background-image="url({src})"
		style:filter="brightness({brightness}%) blur({blur}px)"
		{...rest}
	></div>
{:else}
	<div class={className} style:background-color={color} {...rest}></div>
{/if}

<style>
	div {
		width: 100%;
		height: 100vh;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}
</style>
