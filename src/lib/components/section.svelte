<script lang="ts">
	let { class: className = '', children, ...rest } = $props();
</script>

<section class={className} {...rest}>
	{@render children()}
</section>

<style>
	section {
		border-left: 4px solid var(--cs-outline);
		padding: 0 12px;
		margin-left: 12px;
		margin-top: 10px;
	}
</style>
