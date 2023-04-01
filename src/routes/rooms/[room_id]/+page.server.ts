import { error } from '@sveltejs/kit';
import { caller } from '$lib/trpc/router';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	if (await caller.rooms.exists(params.room_id)) {
		return {
			roomName: params.room_id
		};
	}

	throw error(404, 'Not found');
}
