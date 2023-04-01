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
	exists: t.procedure.input(z.string()).query(async ({ input }) => {
		return await redis.sismember('rooms', input);
	})
});
