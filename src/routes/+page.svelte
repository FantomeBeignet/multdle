<script>
	import { setContext } from 'svelte';
	const blue_signup = true;
	setContext('SignupContext', { blue_signup });
</script>

<div class="flex flex-col items-center justify-center w-full p-10 lg:p-32 gap-4 lg:gap-6">
	<h1
		class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
	>
		Welcome to Multdle
	</h1>
	<p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
		Multdle is a multiplayer version of the infamous Wordle. Gather friends and create a room, or
		play alone if you wish!
	</p>
	<a
		href="/rooms"
		class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
	>
		Play with friends
		<svg
			class="w-5 h-5 ml-2 -mr-1"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			><path
				fill-rule="evenodd"
				d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/></svg
		>
	</a>
</div>
