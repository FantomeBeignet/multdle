import { pusherServer } from '$lib/pusher/server';
import { error } from '@sveltejs/kit';
import { randomUUID as uuid } from 'crypto';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const formData = await request.formData();
	const socketId = formData.get('socket_id') as string | null;
	const channelName = formData.get('channel_name') as string | null;
	if (socketId == null || channelName == null) throw error(500);
	const presenceData = {
		user_id: uuid()
	};
	const authResponse = pusherServer.authorizeChannel(socketId, channelName, presenceData);
	return new Response(JSON.stringify(authResponse));
}
