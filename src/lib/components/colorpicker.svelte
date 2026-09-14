<script lang="ts">
	let {
		value = $bindable('#000000'),
		disabled = false,
		label = undefined
	}: {
		value?: string;
		disabled?: boolean;
		label?: string;
	} = $props();

	let hex = $derived(value.toUpperCase());
</script>

<label class="color-picker" class:disabled>
	<input type="color" bind:value {disabled} aria-label={label ?? 'Color'} />
	<span class="swatch" style:background-color={value}></span>
	<span class="hex">{hex}</span>
</label>

<style>
	.color-picker {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 7px 10px;
		color: var(--cs-on-surface);
		cursor: pointer;
		user-select: none;

		border-width: 1px;
		border-style: solid;
		border-color: var(--cs-outline);
		background-color: var(--cs-surface);

		&:hover {
			background-color: var(--cs-surface-container-low);
		}

		&:active {
			background-color: var(--cs-surface-container);
		}

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	input {
		position: absolute;
		left: 10px;
		width: 18px;
		height: 18px;
		opacity: 0;
		border: none;
		padding: 0;
		cursor: inherit;
	}

	.swatch {
		width: 18px;
		height: 18px;
		flex: none;
	}

	.hex {
		font-family: ui-monospace, monospace;
		font-size: 0.875em;
		letter-spacing: 0.02em;
	}

	input:focus-visible ~ .swatch {
		outline: 2px solid var(--cs-primary, currentColor);
		outline-offset: 2px;
	}
</style>
