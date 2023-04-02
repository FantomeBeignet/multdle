<script lang="ts">
	import { page } from '$app/stores';
	import { trpc } from '$lib/trpc/client';
	import { usernameStore } from '$lib/stores';
	import { goto } from '$app/navigation';

	let username = '';
	let roomId = '';

	let usernameError = '';
	let roomError = '';

	const createRoom = async () => {
		usernameError = '';
		if (username == '') {
			usernameError = 'You must specify a username';
			return;
		}
		usernameStore.set(username);
		const roomName = await trpc($page).rooms.create.mutate();
		goto(`/rooms/${roomName}`);
	};

	const joinRoom = async () => {
		usernameError = '';
		roomError = '';
		if (username == '') {
			usernameError = 'You must specify a username';
			return;
		}
		if (roomId == '') {
			roomError = 'You must specify a room name';
			return;
		}
		usernameStore.set(username);
		if (!(await trpc($page).rooms.exists.query(roomId))) {
			roomError = 'This room does not exist';
			roomId = '';
			return;
		}
		goto(`/rooms/${roomId}`);
	};
</script>

<div class="flex items-center justify-center w-full ">
	<div class="flex flex-col flex-1 items-center justify-center max-w-xl py-32 gap-10">
		<div class="flex flex-col items-center w-full gap-6">
			<div class="relative z-0 group w-full">
				<input
					type="email"
					name="floating_email"
					id="floating_email"
					class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
					placeholder=" "
					required
					bind:value={username}
				/>
				<label
					for="floating_email"
					class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
					>Username</label
				>
			</div>
			<span class="text-red-600">{usernameError}</span>
			<div class="w-full flex items-end justify-center">
				<button
					type="submit"
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					on:click={createRoom}>Create room</button
				>
			</div>
		</div>
		<span class="w-full text-center font-semibold dark:text-white">OR</span>
		<div class="flex flex-col items-center w-full gap-6">
			<div class="relative z-0 group w-full">
				<input
					type="email"
					name="floating_email"
					id="floating_email"
					class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
					placeholder=" "
					required
					bind:value={roomId}
				/>
				<label
					for="floating_email"
					class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
					>Room ID</label
				>
			</div>
			<span class="text-red-600">{roomError}</span>
			<div class="w-full flex items-end justify-center">
				<button
					type="submit"
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					on:click={joinRoom}>Join room</button
				>
			</div>
		</div>
	</div>
</div>
