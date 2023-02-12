import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';

const url = '/api/trpc';

export const handle: Handle = createTRPCHandle({ router, url, createContext });
