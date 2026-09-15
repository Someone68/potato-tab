<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Variant } from '$lib/misc';

	interface Props extends Omit<HTMLInputAttributes, 'value'> {
		variant?: Variant;
		disabled?: boolean;
		number?: boolean;
		value?: string;
	}

	let {
		variant = 'regular',
		disabled = false,
		number = false,
		value = $bindable(''),
		...rest
	}: Props = $props();
</script>

<input
	type={number ? 'number' : 'text'}
	class="{variant} {disabled ? 'disabled' : ''}"
	bind:value
	{disabled}
	{...rest}
/>

<style>
	input {
		padding: 7px 10px;
		color: var(--cs-on-surface);
		cursor: pointer;
		outline: none;
		font-family: var(--font);

		border-width: 1px;
		border-style: solid;
		border-color: transparent;

		background-color: var(--cs-surface);
		border-color: var(--cs-outline);
		&:focus {
			background-color: var(--cs-surface-container);
			cursor: text;
			&.regular {
				border-color: var(--cs-on-surface);
			}
			&.primary {
				border-color: var(--cs-primary);
			}
			&.secondary {
				border-color: var(--cs-secondary);
			}
			&.tertiary {
				border-color: var(--cs-tertiary);
			}
			&.error {
				border-color: var(--cs-error);
			}
		}
	}

	.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
