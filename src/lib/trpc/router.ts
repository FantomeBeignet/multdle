import { t } from '$lib/trpc/t';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { rooms } from '$lib/trpc/routes/rooms';
import { sockets } from '$lib/trpc/routes/sockets';
import { games } from '$lib/trpc/routes/games';

export const router = t.router({
	rooms,
	sockets,
	games
});

export const caller = router.createCaller({});

export type Router = typeof router;

export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
