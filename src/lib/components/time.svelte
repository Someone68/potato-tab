<script lang="ts">
	let time: Date = $state(new Date());
	let formatted_time: string = $derived(
		time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
	);

	function updateTime() {
		time = new Date();
	}

	setInterval(updateTime, 1000);

	let { class: className = '', ...rest } = $props();
</script>

<h1 class={className} {...rest}>{formatted_time}</h1>
