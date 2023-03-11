import { REDISHOST, REDISPASSWORD, REDISPORT, REDISUSER } from '$env/static/private';
import { Redis } from 'ioredis';

export const redis = new Redis({
	port: parseInt(REDISPORT),
	host: REDISHOST,
	username: REDISUSER,
	password: REDISPASSWORD
});
