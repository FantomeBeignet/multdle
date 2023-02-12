<script>
	import { trpc } from '$lib/trpc/client';
	import { page } from '$app/stores';

	let greeting = 'Press the button to receive a greeting!';

	const greet = async () => {
		greeting = await trpc($page).greeting.hello.query();
	};
</script>

<button on:click={greet}>Greet me!</button>
<p>{greeting}</p>
