<script lang="ts">
	import { pusherClient } from '$lib/pusher/client';
	import type { PresenceChannel } from 'pusher-js';
	import { onDestroy, onMount } from 'svelte';
	import { usernameStore } from '$lib/stores';
	import type Pusher from 'pusher-js';
	import { trpc } from '$lib/trpc/client';
	import { page } from '$app/stores';

	export let data;

	let client: Pusher;

	let channel: PresenceChannel;
	let membersPlaying: { id: string; username: string }[] = [];
	let membersDone: { id: string; username: string }[] = [];

	const addMember = async (memberId: string, username: string) => {
		if (username) {
			const _members = [...membersPlaying, { id: memberId, username: username }];
			membersPlaying = _members;
		}
	};

	const removeMember = async (memberId: string) => {
		const _members = membersPlaying.filter(({ id, username }) => {
			id !== memberId;
		});
		membersPlaying = _members;
	};

	const markMemberDone = (memberId: string) => {
		const member = membersPlaying.find((member) => member.id === memberId);
		if (!member) return;
		const newDone = [...membersDone, member];
		membersDone = newDone;
		const newPlaying = membersPlaying.filter((member) => member !== member);
		membersPlaying = newPlaying;
	};

	const triggerDone = () => {
		channel.trigger('client-done', {});
		markMemberDone(client.user.user_data.id);
	};

	onMount(() => {
		const { roomName } = data;

		client = pusherClient($usernameStore);
		client.bind('pusher:signin_success', (data: unknown) => {
			channel = client.subscribe(`presence-game-${roomName}`) as PresenceChannel;
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
				channel.bind('client-done', (data: any, metadata: any) => {
					markMemberDone(metadata.user_id);
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
	</div>
</div>

<style>
	.avatars-reversed > :not([hidden]) ~ :not([hidden]) {
		--tw-space-x-reverse: 0;
		margin-left: calc(-1rem * var(--tw-space-x-reverse));
		margin-right: calc(-1rem * calc(1 - var(--tw-space-x-reverse)));
	}
</style>
