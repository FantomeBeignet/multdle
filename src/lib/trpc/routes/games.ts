import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { redis } from '$lib/redis';
import { caller } from '$lib/trpc/router';
import { pusherServer } from '$lib/pusher/server';
import { getRandomWord } from '$lib/words';

export const games = t.router({
	start: t.procedure.input(z.string()).mutation(async ({ input }) => {
		pusherServer.trigger(`presence-room-${input}`, 'start', {});
		caller.rooms.delete(input);
		return await redis.sadd('games', input);
	}),
	exists: t.procedure.input(z.string()).query(async ({ input }) => {
		return await redis.sismember('games', input);
	}),
	getWord: t.procedure.input(z.string()).query(async ({ input }) => {
		let seed: number;
		const redisSeed = await redis.get(`game:seed:${input}`);
		if (!redisSeed) {
			seed = crypto.getRandomValues(new Int16Array(1))[0];
			await redis.set(`game:seed:${input}`, seed, 'EX', 10);
		} else seed = parseInt(redisSeed);
		return getRandomWord(seed);
	})
});
