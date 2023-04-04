<script lang="ts">
	import { pusherClient } from '$lib/pusher/client';
	import type { PresenceChannel } from 'pusher-js';
	import { onDestroy, onMount } from 'svelte';
	import { usernameStore } from '$lib/stores';
	import type Pusher from 'pusher-js';
	import { trpc } from '$lib/trpc/client';
	import { page } from '$app/stores';
	import WordleGrid from '../../../components/WordleGrid.svelte';
	import { invalidateAll } from '$app/navigation';
	import Scoreboard from '../../../components/Scoreboard.svelte';

	export let data;

	let client: Pusher;
	let memberId: string;
	let username: string;

	let channel: PresenceChannel;
	let membersPlaying: { id: string; username: string }[] = [];
	let membersDone: { id: string; username: string }[] = [];
	let playerEnded = false;
	let gameEnded = false;

	const addMember = async (memberId: string, username: string) => {
		if (username) {
			const _members = [...membersPlaying, { id: memberId, username: username }];
			membersPlaying = _members;
		}
	};

	const removeMember = async (memberId: string) => {
		const _members = membersPlaying.filter(({ id, username }) => id !== memberId);
		membersPlaying = _members;
	};

	const markMemberDone = (memberId: string) => {
		const member = membersPlaying.find((member) => member.id === memberId);
		if (!member) return;
		const newDone = [...membersDone, member];
		membersDone = newDone;
		const newPlaying = membersPlaying.filter(({ id, username }) => id !== memberId);
		membersPlaying = newPlaying;
	};

	const triggerDone = async () => {
		channel.trigger('client-done', {});
		markMemberDone(memberId);
		if (membersPlaying.length === 0) await trpc($page).games.markDone.mutate(data.roomName);
	};

	const restartGame = () => {
		invalidateAll().then(() => {
			gameEnded = false;
			playerEnded = false;
			data = data;
		});
	};

	const triggerRestart = async () => {
		await trpc($page).games.restart.mutate(data.roomName);
	};

	onMount(() => {
		const { roomName } = data;

		client = pusherClient($usernameStore);
		client.bind('pusher:signin_success', (data: unknown) => {
			channel = client.subscribe(`presence-game-${roomName}`) as PresenceChannel;
			channel.bind('pusher:subscription_succeeded', async () => {
				memberId = channel.members.me.id;
				username = channel.members.me.info.username;
				channel.members.each(async (member: any) => {
					addMember(member.id, member.info?.username);
				});
				channel.bind('pusher:member_added', async (member: any) => {
					addMember(member.id, member.info?.username);
				});
				channel.bind('pusher:member_removed', async (member: any) => {
					removeMember(member.id);
				});
				channel.bind('client-done', (data: any, metadata: any) => {
					markMemberDone(metadata.user_id);
				});
				channel.bind('game-end', (data: any) => {
					gameEnded = true;
				});
				channel.bind('restart', (data: any) => {
					restartGame();
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
		<div class="grid grid-cols-2 w-full">
			<div class="flex flex-col items-start justify-center gap-4">
				<p class="dark:text-white font-semibold text-xl">Playing</p>
				<div class="flex -space-x-4">
					{#each membersPlaying as member (member)}
						<img
							class="w-10 h-10 rounded-full dark:border-gray-800"
							src={`https://avatar.fantomebeig.net/linear/${member.username}?initial`}
							alt=""
						/>
					{/each}
				</div>
			</div>
			<div class="flex flex-col items-end justify-center gap-4">
				<p class="dark:text-white font-semibold text-xl">Done</p>
				<div class="flex flex-row-reverse avatars-reversed">
					{#each membersDone as member (member)}
						<img
							class="w-10 h-10 rounded-full dark:border-gray-800"
							src={`https://avatar.fantomebeig.net/linear/${member.username}?initial`}
							alt=""
						/>
					{/each}
				</div>
			</div>
		</div>
		<div class="flex flex-col w-full items-center justify-center gap-10">
			{#if !playerEnded}
				{#key data.word}
					<WordleGrid
						targetWord={data.word}
						onWin={() => {
							trpc($page)
								.games.setPlayerTime.mutate({
									room: data.roomName,
									player: username,
									time: new Date().toString()
								})
								.then((res) => {
									if (res) {
										triggerDone();
										playerEnded = true;
									}
								});
						}}
						onLose={() => {
							trpc($page)
								.games.setPlayerTime.mutate({
									room: data.roomName,
									player: username,
									time: null
								})
								.then((res) => {
									if (res) {
										triggerDone();
										playerEnded = true;
									}
								});
						}}
					/>
				{/key}
			{:else}
				{#key membersDone}
					{#await trpc($page).games.getPlayersTime.query(data.roomName) then players}
						<Scoreboard {players} />
					{/await}
				{/key}
			{/if}
			{#if gameEnded}
				<button
					on:click={triggerRestart}
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>Replay</button
				>
			{/if}
		</div>
	</div>
</div>

<style>
	.avatars-reversed > :not([hidden]) ~ :not([hidden]) {
		--tw-space-x-reverse: 0;
		margin-left: calc(-1rem * var(--tw-space-x-reverse));
		margin-right: calc(-1rem * calc(1 - var(--tw-space-x-reverse)));
	}
</style>
