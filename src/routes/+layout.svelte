<script>
	import '../app.css';

	// import { dev } from '$app/environment';
	// import { inject } from '@vercel/analytics';

	// inject({ mode: dev ? 'development' : 'production' });

	// Web vitals
	import { webVitals } from '$lib/vitals';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	let analyticsId = import.meta.env.VERCEL_ANALYTICS_ID ?? '';

	$: if (browser && analyticsId) {
		webVitals({
			path: $page.url.pathname,
			params: $page.params,
			analyticsId
		});
	}
</script>

<slot />
