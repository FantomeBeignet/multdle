import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { redis } from '$lib/redis';

export const sockets = t.router({
	remove: t.procedure.input(z.string()).mutation(async ({ input }) => {
		return await redis.del(`socket:${input}`);
	})
});
