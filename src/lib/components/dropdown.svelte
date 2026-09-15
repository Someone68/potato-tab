<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Variant } from '$lib/misc';

	export type Option = { value: string; label: string; disabled?: boolean };

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		variant?: Variant;
		filled?: boolean;
		disabled?: boolean;
		options: Option[];
		value?: string | null;
		placeholder?: string;
	}

	let {
		variant = 'regular',
		filled = false,
		disabled = false,
		options,
		value = $bindable(null),
		placeholder = 'Select',
		...rest
	}: Props = $props();

	const uid = $props.id();

	let open = $state(false);
	let active = $state(-1);
	let root: HTMLDivElement;

	let selected = $derived(options.find((o) => o.value === value));

	function show() {
		if (disabled) return;
		open = true;
		active = options.findIndex((o) => o.value === value);
		if (active < 0) move(1);
	}

	function hide() {
		open = false;
		active = -1;
	}

	function move(delta: number) {
		const n = options.length;
		let i = active;
		for (let k = 0; k < n; k++) {
			i = (i + delta + n) % n;
			if (!options[i].disabled) {
				active = i;
				return;
			}
		}
	}

	function pick(i: number) {
		const o = options[i];
		if (!o || o.disabled) return;
		value = o.value;
		hide();
	}

	function keydown(e: KeyboardEvent) {
		if (disabled) return;
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				if (open) move(1);
				else show();
				break;
			case 'ArrowUp':
				e.preventDefault();
				if (open) move(-1);
				else show();
				break;
			case 'Home':
				if (open) {
					e.preventDefault();
					active = -1;
					move(1);
				}
				break;
			case 'End':
				if (open) {
					e.preventDefault();
					active = options.length;
					move(-1);
				}
				break;
			case 'Enter':
			case ' ':
				e.preventDefault();
				if (open) pick(active);
				else show();
				break;
			case 'Escape':
				if (open) {
					e.preventDefault();
					hide();
				}
				break;
			case 'Tab':
				hide();
				break;
		}
	}
</script>

<svelte:window
	onpointerdown={(e) => {
		if (open && !root.contains(e.target as Node)) hide();
	}}
/>

<div class="dropdown" bind:this={root} {...rest}>
	<button
		type="button"
		class="trigger {variant} {filled ? 'filled' : ''} {disabled ? 'disabled' : ''}"
		{disabled}
		role="combobox"
		aria-controls="{uid}-list"
		aria-expanded={open}
		aria-haspopup="listbox"
		aria-activedescendant={open && active >= 0 ? `${uid}-opt-${active}` : undefined}
		onclick={() => (open ? hide() : show())}
		onkeydown={keydown}
		><span class="label" class:placeholder={!selected}>{selected?.label ?? placeholder}</span>
		<span class="arrow" class:up={open} aria-hidden="true"></span></button
	>

	{#if open}
		<ul class="menu {variant}" id="{uid}-list" role="listbox" tabindex="-1">
			{#each options as o, i (o.value)}
				<button
					type="button"
					id="{uid}-opt-{i}"
					class="item"
					class:active={i === active}
					class:selected={o.value === value}
					class:disabled={o.disabled}
					role="option"
					aria-selected={o.value === value}
					aria-disabled={o.disabled}
					onpointerenter={() => !o.disabled && (active = i)}
					onclick={() => pick(i)}
				>
					{o.label}
				</button>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.dropdown {
		position: relative;
		display: inline-block;
	}

	.trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		width: 100%;
		padding: 7px 10px;
		cursor: pointer;
		font-family: var(--font);
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

		&:hover:not(.disabled) {
			--state-opacity: 8%;
		}
		&:active:not(.disabled),
		&[aria-expanded='true'] {
			--state-opacity: 12%;
		}

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.placeholder {
		opacity: 0.6;
	}

	.arrow {
		width: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;
		border-top: 5px solid currentColor;
		&.up {
			transform: rotate(180deg);
		}
	}

	.menu {
		position: absolute;
		z-index: 10;
		top: calc(100% + 2px);
		left: 0;
		min-width: 100%;
		margin: 0;
		/*padding: 4px 0;*/
		list-style: none;
		max-height: 260px;
		overflow-y: auto;

		--bg: var(--cs-surface-container);
		--fg: var(--cs-on-surface);
		background-color: var(--bg);
		color: var(--fg);

		border: 1px solid var(--cs-outline-variant, var(--cs-outline));
		/*box-shadow: 0 2px 6px color-mix(in srgb, var(--cs-shadow) 30%, transparent);*/

		&.primary {
			--accent: var(--cs-primary);
		}
		&.secondary {
			--accent: var(--cs-secondary);
		}
		&.tertiary {
			--accent: var(--cs-tertiary);
		}
		&.error {
			--accent: var(--cs-error);
		}
		&.regular {
			--accent: var(--cs-on-surface);
		}
	}

	.item {
		padding: 7px 10px;
		width: 100%;
		cursor: pointer;
		white-space: nowrap;
		text-align: left;
		border: none;
		border-bottom: 1px solid var(--cs-outline-variant, var(--cs-outline));
		background-color: color-mix(in srgb, var(--accent) var(--state-opacity, 0%), var(--bg));

		&.active:not(.disabled) {
			--state-opacity: 8%;
		}
		&.selected {
			color: var(--accent);
			--state-opacity: 12%;
		}
		&.selected.active {
			--state-opacity: 16%;
		}
		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
</style>
