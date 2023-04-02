import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { redis } from '$lib/redis';
import { caller } from '$lib/trpc/router';
import { pusherServer } from '$lib/pusher/server';
import { getRandomWord } from '$lib/words';
import { createHash, getRandomValues } from 'crypto';

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
		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const gameSeed = parseInt(createHash('sha256').update(input).digest('hex'), 16);
		const seed = gameSeed + hours + minutes;
		return getRandomWord(seed);
	}),
	getSoloWord: t.procedure.query(() => {
		const seed = getRandomValues(new Int16Array(1))[0];
		console.log(seed);
		return getRandomWord(seed);
	})
});
