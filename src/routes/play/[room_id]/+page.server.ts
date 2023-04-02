import { error } from '@sveltejs/kit';
import { caller } from '$lib/trpc/router';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	if (await caller.games.exists(params.room_id)) {
		return {
			roomName: params.room_id,
			word: caller.games.getWord(params.room_id)
		};
	}

	throw error(404, 'Not found');
}
