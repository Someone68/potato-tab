<script lang="ts">
	import TextButton from './text_button.svelte';

	type Side = 'left' | 'right';

	let {
		side = 'right',
		title,
		onClose,
		children,
		...rest
	}: {
		side?: Side;
		title?: string;
		onClose?: () => void;
		children: import('svelte').Snippet;
	} = $props();
</script>

<div class="{side} sidebar" {...rest}>
	<TextButton
		variant="error"
		icon="close"
		onclick={onClose}
		iconOnly
		style="position:absolute; top: 15px; right: 15px;"
	></TextButton>
	<div class="top">
		<h1 class="title">{title}</h1>
	</div>
	{@render children()}
</div>

<style>
	.sidebar {
		background: var(--cs-surface-container);
		position: fixed;
		top: 0;
		bottom: 0;
		max-width: 500px;
		min-width: 350px;
		width: 25%;
		padding: 10px 15px;
		&.left {
			left: 0;
			border-right: 1px solid var(--cs-outline);
		}
		&.right {
			right: 0;
			border-left: 1px solid var(--cs-outline);
		}
	}
</style>
