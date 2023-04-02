import { pusherServer } from '$lib/pusher/server';
import { redis } from '$lib/redis';
import { error } from '@sveltejs/kit';
import { randomUUID as uuid } from 'crypto';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const formData = await request.formData();
	const socketId = formData.get('socket_id') as string | null;
	const username = formData.get('username') as string | null;
	if (socketId == null || username == null) throw error(403);
	await redis.set(`socket:${socketId}`, username, 'EX', 7200);
	const authResponse = pusherServer.authenticateUser(socketId, {
		id: uuid(),
		user_info: { username: username }
	});
	return new Response(JSON.stringify(authResponse));
}
