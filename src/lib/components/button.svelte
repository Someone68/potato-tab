<script lang="ts">
	type Variant = 'regular' | 'primary' | 'secondary' | 'tertiary';

	let {
		variant = 'regular',
		filled = false,
		disabled = false,
		children
	}: {
		variant: Variant;
		filled?: boolean;
		disabled?: boolean;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<button class="{variant} {filled ? 'filled' : ''} {disabled ? 'disabled' : ''}">
	{@render children?.()}
</button>

<style>
	button {
		padding: 7px 10px;
		color: var(--cs-fg);
		cursor: pointer;

		&.filled {
			&.regular {
				background-color: var(--cs-surface-container);
			}
			&.primary {
				background-color: var(--cs-primary-container);
			}
			&.secondary {
				background-color: var(--cs-secondary-container);
			}
			&.tertiary {
				background-color: var(--cs-tertiary-container);
			}

			&:hover {
				filter: brightness(120%);
			}

			&:active {
				filter: brightness(90%);
			}
		}

		border-width: 1px;
		border-style: solid;
		border-color: transparent;

		&:not(.filled) {
			background-color: var(--cs-surface);
			&.regular {
				border-color: var(--cs-outline);
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

			&:hover {
				background-color: var(--cs-surface-container-low);
			}

			&:active {
				background-color: var(--cs-surface-container);
			}
		}

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
</style>
