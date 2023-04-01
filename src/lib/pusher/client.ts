import { default as PusherClient } from 'pusher-js';

const PUSHER_APP_KEY = '6993c4f08815bfb293df';
const PUSHER_CLUSTER = 'eu';

export const pusherClient = new PusherClient(PUSHER_APP_KEY, {
	cluster: PUSHER_CLUSTER,
	authEndpoint: '/api/pusher/auth'
});
