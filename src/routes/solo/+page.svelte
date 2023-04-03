<script>
	import WordleGrid from '../../components/WordleGrid.svelte';
	export let data;
</script>

<div class="flex items-center justify-center w-full">
	<div class="flex flex-col items-center justify-center w-full p-10 max-w-4xl lg:px-16">
		<h1
			class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center"
		>
			Solo play
		</h1>
		<WordleGrid targetWord={data.word} onWin={() => undefined} />
	</div>
</div>
