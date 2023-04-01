import { t } from '$lib/trpc/t';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { rooms } from '$lib/trpc/routes/rooms';

export const router = t.router({
	rooms
});

export const caller = router.createCaller({});

export type Router = typeof router;

export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
