import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { redis } from '$lib/redis';
import { caller } from '$lib/trpc/router';
import { pusherServer } from '$lib/pusher/server';

export const games = t.router({
	start: t.procedure.input(z.string()).mutation(async ({ input }) => {
		caller.rooms.delete(input);
		pusherServer.trigger(input, 'start', {});
		return await redis.sadd('games', input);
	}),
	exists: t.procedure.input(z.string()).query(async ({ input }) => {
		return await redis.sismember('games', input);
	})
});
