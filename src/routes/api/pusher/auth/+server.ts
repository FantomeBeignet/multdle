import { pusherServer } from '$lib/pusher/server';
import { redis } from '$lib/redis';
import { error } from '@sveltejs/kit';
import { randomUUID as uuid } from 'crypto';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const formData = await request.formData();
	const socketId = formData.get('socket_id') as string | null;
	const channelName = formData.get('channel_name') as string | null;
	if (socketId == null || channelName == null) throw error(403);
	const username = await redis.get(`socket:${socketId}`);
	const presenceData = {
		user_id: uuid(),
		user_info: { username: username }
	};
	const authResponse = pusherServer.authorizeChannel(socketId, channelName, presenceData);
	return new Response(JSON.stringify(authResponse));
}
