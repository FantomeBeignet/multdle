<script lang="ts">
	export let players: string[];
	console.log(players);

	const rankOfNum = (i: number) => {
		var j = i % 10,
			k = i % 100;
		if (j == 1 && k != 11) {
			return i.toString() + 'st';
		}
		if (j == 2 && k != 12) {
			return i.toString() + 'nd';
		}
		if (j == 3 && k != 13) {
			return i.toString() + 'rd';
		}
		return i.toString() + 'th';
	};
</script>

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
	<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
		<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
			<tr>
				<th scope="col" class="px-6 py-3"> Player </th>
				<th scope="col" class="px-6 py-3"> Rank </th>
			</tr>
		</thead>
		<tbody>
			{#each players as player, i}
				<tr
					class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
				>
					<th
						scope="row"
						class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
					>
						{player}
					</th>
					<td class="px-6 py-4">{rankOfNum(i + 1)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
