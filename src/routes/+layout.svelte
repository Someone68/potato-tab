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

		body {
			background-color: var(--cs-surface);
			color: var(--cs-on-surface);
			font-family: 'Iosevka Charon Mono', monospace;
		}
	}
</style>
