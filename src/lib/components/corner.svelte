<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	type Corner = 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right';

	let {
		children,
		corner,
		...rest
	}: HTMLAttributes<HTMLDivElement> & {
		children: import('svelte').Snippet;
		corner: Corner;
	} = $props();
</script>

<div class={corner} {...rest}>{@render children()}</div>

<style>
	div {
		position: absolute;
	}

	.top_left {
		top: 0;
		left: 0;
	}

	.top_right {
		top: 0;
		right: 0;
	}

	.bottom_left {
		bottom: 0;
		left: 0;
	}

	.bottom_right {
		bottom: 0;
		right: 0;
	}
</style>
