<script lang="ts">
	import { pusherClient } from '$lib/pusher/client';
	import type { PresenceChannel } from 'pusher-js';
	import { onDestroy, onMount } from 'svelte';
	import { usernameStore } from '$lib/stores';
	import type Pusher from 'pusher-js';
	import { trpc } from '$lib/trpc/client';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let data;

	let client: Pusher;

	let channel: PresenceChannel;
	let members: { id: string; username: string }[] = [];

	const addMember = async (memberId: string, username: string) => {
		if (username) {
			const _members = [...members, { id: memberId, username: username }];
			members = _members;
		}
	};

	const removeMember = async (memberId: string) => {
		const _members = members.filter(({ id, username }) => {
			id !== memberId;
		});
		members = _members;
	};

	const startGame = async () => {
		await trpc($page).games.start.mutate(data.roomName);
		goto(`/play/${data.roomName}`);
	};

	onMount(() => {
		const { roomName } = data;

		client = pusherClient($usernameStore);
		client.bind('pusher:signin_success', (data: unknown) => {
			channel = client.subscribe(`presence-room-${roomName}`) as PresenceChannel;
			channel.bind('pusher:subscription_succeeded', async () => {
				channel.members.each(async (member: any) => {
					addMember(member.id, member.info?.username);
				});
				channel.bind('pusher:member_added', async (member: any) => {
					addMember(member.id, member.info?.username);
				});
				channel.bind('pusher:member_removed', async (member: any) => {
					removeMember(member.id);
				});
			});
		});
		client.signin();
		client.connection.bind('disconnected', async () => {
			await trpc($page).sockets.remove.mutate(client.connection.socket_id);
		});
	});

	onDestroy(() => {
		client.disconnect();
	});
</script>

<div class="flex items-center justify-center w-full">
	<div class="max-w-3xl w-full flex flex-col items-start justify-center p-16 gap-12">
		<h1 class="dark:text-white font-semibold text-2xl">Room name: {data.roomName}</h1>
		<div class="flex flex-col items-center justify-center gap-4">
			<p class="dark:text-white font-semibold text-xl">Players:</p>
			<div class="flex -space-x-4">
				{#each members as member (member)}
					<img
						class="w-10 h-10 rounded-full dark:border-gray-800"
						src={`https://avatar.fantomebeig.net/linear/${member.username}?initial`}
						alt=""
					/>
				{/each}
			</div>
		</div>
		<div class="flex items-center justify-center w-full">
			<button
				class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				on:click={startGame}>Start game</button
			>
		</div>
	</div>
</div>
