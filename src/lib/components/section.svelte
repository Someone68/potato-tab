<script lang="ts">
	type Corner = 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right';

	let {
		corner = 'top_left',
		children,
		...rest
	}: {
		corner?: Corner;
		children: import('svelte').Snippet;
	} = $props();
</script>

<section class={corner} {...rest}>
	{@render children()}
</section>

<style>
	section {
		position: relative;
		&.top_left,
		&.bottom_left {
			border-left: 4px solid var(--cs-outline);
			&.top_left {
				padding: 0 12px;
				left: 12px;
				top: 10px;
			}

			&.bottom_left {
				padding: 0 12px;
				left: 12px;
				bottom: 10px;
			}
		}

		&.top_right,
		&.bottom_right {
			border-right: 4px solid var(--cs-outline);
			&.top_right {
				padding: 0 12px;
				right: 12px;
				top: 10px;
			}

			&.bottom_right {
				padding: 0 12px;
				right: 12px;
				bottom: 10px;
			}
		}
	}
</style>
