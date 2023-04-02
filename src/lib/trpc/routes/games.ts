import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { redis } from '$lib/redis';
import { caller } from '$lib/trpc/router';

export const games = t.router({
	start: t.procedure.input(z.string()).mutation(async ({ input }) => {
		caller.rooms.delete(input);
		return await redis.sadd('games', input);
	})
});
