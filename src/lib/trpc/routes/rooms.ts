import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { redis } from '$lib/redis';
import randomWords from 'random-words';

export const rooms = t.router({
	create: t.procedure.mutation(async () => {
		const roomName = randomWords({ exactly: 2, join: '-' });
		await redis.sadd('rooms', roomName);
		return roomName;
	}),
	join: t.procedure
		.input(z.object({ room: z.string(), username: z.string(), userId: z.string() }))
		.mutation(async ({ input }) => {
			const { room, username, userId } = input;
			return await redis.hset(`room:${room}`, userId, username);
		}),
	exists: t.procedure.input(z.string()).query(async ({ input }) => {
		return await redis.sismember('rooms', input);
	}),
	getMemberUsername: t.procedure
		.input(z.object({ room: z.string(), id: z.string() }))
		.query(async ({ input }) => {
			const { room, id } = input;
			return await redis.hget(`room:${room}`, id);
		})
});
