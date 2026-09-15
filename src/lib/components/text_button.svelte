<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Variant } from '$lib/misc';

	let {
		variant = 'primary',
		disabled = false,
		icon = 'error',
		iconOnly = false,
		children,
		...rest
	}: HTMLAttributes<HTMLParagraphElement> & {
		variant: Variant;
		disabled?: boolean;
		icon?: string;
		iconOnly?: boolean;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<div class="{variant} {disabled ? 'disabled' : ''}" {...rest}>
	<span class="material-symbols-outlined"> {icon} </span>

	{#if !iconOnly}
		<p>
			{@render children?.()}
		</p>
	{/if}
</div>

<style>
	div {
		display: flex;
		align-items: center;
		flex-direction: row;
		gap: 4px;
		cursor: pointer;
		user-select: none;
		width: fit-content;
		&:hover {
			& p {
				text-decoration: underline;
			}
			&.primary {
				color: var(--cs-primary);
			}
			&.secondary {
				color: var(--cs-secondary);
			}
			&.tertiary {
				color: var(--cs-tertiary);
			}
			&.error {
				color: var(--cs-error);
			}
		}
		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
</style>
