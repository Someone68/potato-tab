<script lang="ts">
	type Corner = 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right';

	let {
		corner = 'top_left',
		border = true,
		children,
		...rest
	}: {
		corner?: Corner;
		border?: boolean;
		children: import('svelte').Snippet;
	} = $props();
</script>

<section class="{corner} {border ? 'border' : ''}" {...rest}>
	{@render children()}
</section>

<style>
	section {
		position: relative;
		&.top_left,
		&.bottom_left {
			border-left: 4px solid var(--cs-outline);
			&.top_left {
				padding: 0 10px;
				left: 10px;
				top: 10px;
			}

			&.bottom_left {
				padding: 0 10px;
				left: 10px;
				bottom: 10px;
			}

			&:not(.border) {
				padding-left: 2px;
			}
		}

		&.top_right,
		&.bottom_right {
			border-right: 4px solid var(--cs-outline);
			&.top_right {
				padding: 0 10px;
				right: 10px;
				top: 10px;
			}

			&.bottom_right {
				padding: 0 10px;
				right: 10px;
				bottom: 10px;
			}

			&:not(.border) {
				padding-right: 2px;
			}
		}

		&:not(.border) {
			border: none;
		}
	}
</style>
