<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global {
		@import url('https://fonts.googleapis.com/css2?family=Iosevka+Charon+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
		* {
			margin: 0;
			padding: 0;
		}

		html,
		body {
			width: 100%;
			height: 100vh;
		}

		:root {
			/* ayu dark */
			--bg: #0b0e14;
			--surface: #0d1017;
			--surface-alt: #0f131a;
			--surface-hover: #131721;
			--surface-sunk: #11151c;

			--fg: #bfbdb6;
			--fg-muted: #565b66;
			--fg-subtle: #acb6bf8c;
			--fg-on-accent: #0b0e14;

			--outline: #565b6645;
			--outline-strong: #565b6680;
			--shadow: #00000080;

			--accent: #e6b450;
			--accent-hover: #e1af4b;
			--accent-bg: #e6b45033;
			--accent-border: #e6b4504d;

			--selection: #409fff40;
			--selection-dim: #409fff21;

			--error: #d95757;
			--success: #7fd962;
			--info: #73b8ff;
			--danger-alt: #f26d78;
			--warning: #ffb454;
		}

		body {
			background-color: var(--bg);
			color: var(--fg);
			font-family: 'Iosevka Charon Mono', monospace;
		}
	}
</style>
