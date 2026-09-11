<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		axis?: 'x' | 'y' | 'both';
		children: Snippet;
	}
	let { axis = 'both', class: className = '', children, ...rest }: Props = $props();
</script>

<div class={['center', className, { x: axis !== 'y', y: axis !== 'x' }]} {...rest}>
	{@render children()}
</div>

<style>
	.center {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
	}

	.x {
		justify-content: center;
	}

	.y {
		align-items: center;
	}
</style>
