<script>
	import { trpc } from '$lib/trpc/client';
	import { page } from '$app/stores';

	import { setContext } from 'svelte';
	const blue_signup = true;
	setContext('SignupContext', { blue_signup });
</script>
