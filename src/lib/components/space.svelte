<script lang="ts">
	let { class: className = '', width = 0, height = 0, ...rest } = $props();
</script>

<div class={className} style="width: {width}px; height: {height}px;" {...rest}></div>
