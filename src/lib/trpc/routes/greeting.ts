import { t } from '$lib/trpc/t';

export const greeting = t.router({
	hello: t.procedure.query(() => {
		return 'Hello there !';
	})
});
