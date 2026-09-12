<script>
	let { class: className = '', children, ...rest } = $props();
</script>

<section class={className} {...rest}>
	{@render children()}
</section>

<style>
	section {
		border-left: 4px solid var(--outline);
		padding: 12px;
		margin-left: 12px;
	}
</style>
