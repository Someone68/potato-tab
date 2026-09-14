<script>
	let {
		checked = $bindable(false),
		label = '',
		disabled = false,
		name = undefined,
		...rest
	} = $props();
</script>

<label class="switch" class:disabled>
	<input type="checkbox" role="switch" bind:checked {disabled} {name} {...rest} />
	<span class="track"><span class="thumb"></span></span>
	{#if label}<span class="text">{label}</span>{/if}
</label>

<style>
	.switch {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		user-select: none;
	}
	.switch.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	input {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}

	.track {
		position: relative;
		width: 44px;
		height: 24px;
		/*border-radius: 999px;*/
		background: var(--cs-surface-container);
		transition: background 150ms ease;
		flex: none;
		border: 1px solid var(--cs-outline);
	}

	.thumb {
		position: absolute;
		top: 4px;
		left: 4px;
		width: 16px;
		height: 16px;
		/*border-radius: 50%;*/
		background: var(--cs-primary);
		transition:
			transform 150ms ease,
			background 150ms ease;
	}

	input:checked + .track {
		background: var(--cs-primary);
		border-color: var(--cs-primary);
	}
	input:checked + .track .thumb {
		transform: translateX(20px);
		background: var(--cs-on-primary);
	}
	input:focus-visible + .track {
		outline: 2px solid var(--cs-primary);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.track,
		.thumb {
			transition: none;
		}
	}
</style>
