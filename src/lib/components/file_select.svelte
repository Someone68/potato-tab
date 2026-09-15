<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Variant } from '$lib/misc';

	let {
		variant = 'secondary',
		filled = false,
		disabled = false,
		files = $bindable(),
		multiple = false,
		accept,
		children,
		...rest
	}: Omit<HTMLInputAttributes, 'files'> & {
		variant?: Variant;
		filled?: boolean;
		disabled?: boolean;
		files?: FileList | null;
		multiple?: boolean;
		accept?: string;
		children?: import('svelte').Snippet<[FileList | null]>;
	} = $props();

	let input: HTMLInputElement;

	const label = $derived(
		!files || files.length === 0
			? multiple
				? 'choose files'
				: 'choose file'
			: files.length === 1
				? files[0].name
				: `${files.length} files`
	);
</script>

<input bind:this={input} bind:files type="file" {multiple} {accept} {disabled} {...rest} />

<button
	type="button"
	class="{variant} {filled ? 'filled' : ''} {disabled ? 'disabled' : ''}"
	{disabled}
	onclick={() => input.click()}
>
	{#if children}{@render children(files ?? null)}{:else}{label}{/if}
</button>

<style>
	input {
		display: none;
	}

	button {
		padding: 7px 10px;
		cursor: pointer;
		--state: transparent;

		&.filled {
			&.regular {
				--bg: var(--cs-surface-container);
				--fg: var(--cs-on-surface);
			}
			&.primary {
				--bg: var(--cs-primary-container);
				--fg: var(--cs-on-primary-container);
			}
			&.secondary {
				--bg: var(--cs-secondary-container);
				--fg: var(--cs-on-secondary-container);
			}
			&.tertiary {
				--bg: var(--cs-tertiary-container);
				--fg: var(--cs-on-tertiary-container);
			}
			&.error {
				--bg: var(--cs-error-container);
				--fg: var(--cs-on-error-container);
			}
		}

		&:not(.filled) {
			--bg: var(--cs-surface);
			--fg: var(--cs-on-surface);
			&.regular {
				border-color: var(--cs-outline);
			}
			&.primary {
				border-color: var(--cs-primary);
				--fg: var(--cs-primary);
			}
			&.secondary {
				border-color: var(--cs-secondary);
				--fg: var(--cs-secondary);
			}
			&.tertiary {
				border-color: var(--cs-tertiary);
				--fg: var(--cs-tertiary);
			}
			&.error {
				border-color: var(--cs-error);
				--fg: var(--cs-error);
			}
		}

		color: var(--fg);
		background-color: color-mix(in srgb, var(--fg) var(--state-opacity, 0%), var(--bg));

		border-width: 1px;
		border-style: solid;
		border-color: transparent;

		max-width: 200px;
		text-wrap: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;

		&:hover:not(.disabled) {
			--state-opacity: 8%;
		}
		&:active:not(.disabled) {
			--state-opacity: 12%;
		}

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
</style>
