import { caller } from '$lib/trpc/router';

/** @type {import('./$types').PageLoad} */
export async function load() {
	const word = caller.games.getSoloWord();
	return { word: word };
}
