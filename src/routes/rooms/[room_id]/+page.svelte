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
			channel = client.subscribe(`presence-${roomName}`) as PresenceChannel;
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

<nav
	class="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 w-full z-20 border-b border-gray-200 dark:border-gray-600"
>
	<div class="container flex flex-wrap items-center justify-between mx-auto">
		<a href="/" class="flex items-center">
			<img src="../favicon.png" class="h-6 mr-3 sm:h-9" alt="Favicon.png" />
			<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
				>Multdle</span
			>
		</a>
		<div class="flex md:order-2">
			<button
				type="button"
				class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>Play</button
			>
			<button
				data-collapse-toggle="navbar-sticky"
				type="button"
				class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
				aria-controls="navbar-sticky"
				aria-expanded="false"
			>
				<span class="sr-only">Open main menu</span>
				<svg
					class="w-6 h-6"
					aria-hidden="true"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
		</div>
		<div
			class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
			id="navbar-sticky"
		>
			<ul
				class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
			>
				<li>
					<a
						href="/"
						class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
						aria-current="page">Home</a
					>
				</li>
				<li>
					<a
						href="/rooms"
						class="block py-2 pl-3 pr-4 text-white class:bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
						>Rooms</a
					>
				</li>
				<li>
					<a
						href="/login"
						class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
						>Login</a
					>
				</li>
				<li>
					<a
						href="/signup"
						class="block py-2 pl-3 pr-4 text-gray-700 class:bg-blue-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
						>Sign Up</a
					>
				</li>
			</ul>
		</div>
	</div>
</nav>

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
