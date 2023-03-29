<script>
	import Cell from './Cell.svelte';
	export const grid = [
		{ id: 1, value: '' },
		{ id: 2, value: '' },
		{ id: 3, value: '' },
		{ id: 4, value: '' },
		{ id: 5, value: '' }
	];
</script>

<div class="flex justify-center flex-wrap">
	{#each grid as cell}
		<Cell {cell} />
	{/each}
</div>
