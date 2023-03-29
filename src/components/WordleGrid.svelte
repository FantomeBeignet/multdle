<script>
	import WordleLine from './WordleLine.svelte';
	export const lines = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
</script>

<div>
	{#each lines as line}
		<WordleLine {line} />
	{/each}
</div>
