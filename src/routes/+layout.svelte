<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0"
	/>
</svelte:head>

{@render children()}

<style>
	:global {
		@import url('https://fonts.googleapis.com/css2?family=Iosevka+Charon+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
		* {
			margin: 0;
			padding: 0;
		}

		:root {
			--font: 'Iosevka Charon Mono', monospace;
		}

		body {
			background-color: var(--cs-surface);
			color: var(--cs-on-surface);
			font-family: var(--font);

			/* specific to potato-tab */
			overflow: hidden;
		}

		h1 {
			font-size: 2rem;
			font-weight: bold;
		}

		h2 {
			font-size: 1.5rem;
			font-weight: bold;
		}

		h3 {
			font-size: 1.25rem;
			font-weight: bold;
		}

		p {
			font-size: 1rem;
			font-weight: normal;
		}
	}
</style>
