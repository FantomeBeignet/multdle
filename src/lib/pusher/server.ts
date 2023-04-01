import { default as PusherServer } from 'pusher';
import { PUSHER_APP_ID, PUSHER_APP_SECRET } from '$env/static/private';

const PUSHER_APP_KEY = '6993c4f08815bfb293df';
const PUSHER_CLUSTER = 'eu';

export const pusherServer = new PusherServer({
	appId: PUSHER_APP_ID,
	key: PUSHER_APP_KEY,
	secret: PUSHER_APP_SECRET,
	cluster: PUSHER_CLUSTER
});
