<script>
	import { invalidateAll } from '$app/navigation';
	import WordleGrid from '../../components/WordleGrid.svelte';
	export let data;

	console.log('data:', data);
	let gameEnded = false;

	const restartGame = () => {
		invalidateAll().then(() => console.log(data));
		gameEnded = false;
		data = data;
	};
</script>

<div class="flex items-center justify-center w-full">
	<div class="flex flex-col items-center justify-center w-full p-10 max-w-4xl lg:px-16 gap-12">
		<h1
			class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center"
		>
			Solo play
		</h1>
		{#key data.word}
			<WordleGrid
				targetWord={data.word}
				onWin={() => {
					gameEnded = true;
				}}
				onLose={() => {
					gameEnded = true;
				}}
			/>
		{/key}
		{#if gameEnded}
			<button
				on:click={restartGame}
				class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>Replay</button
			>
		{/if}
	</div>
</div>
