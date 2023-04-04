import { caller } from '$lib/trpc/router';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	return {
		roomName: params.room_id,
		word: caller.games.getWord(params.room_id)
	};
}
