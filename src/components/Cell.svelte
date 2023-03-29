<script>
	export let cell;
</script>

<div
	class="bg-white w-10 h-10 border-2 border-gray-300 rounded-md flex items-center justify-center text-center font-medium text-gray-900 cursor-text outline-none focus:ring-2 ring-indigo-500"
>
	{#if cell.value}
		{cell.value}
	{/if}
</div>
