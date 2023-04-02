<script>
	import { words } from './words.js';

	let gameWon;
	let gameLost;
	function selectRandomWord(words) {
		const randomIndex = Math.floor(Math.random() * words.length);
		return words[randomIndex];
	}

	const wordToFind = selectRandomWord(words);

	const grid = [
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];

	const classes = [
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];

	let currentRow = 0;

	function verifyWord(wordToFind, userWord) {
		console.log(wordToFind, userWord);
		wordToFind = wordToFind.toUpperCase();
		const correctIndexes = [];
		const misplacedIndexes = [];

		// Lettres correctes aux bons endroits (couleur verte)
		for (let i = 0; i < wordToFind.length; i++) {
			if (wordToFind[i] === userWord[i]) {
				correctIndexes.push(i);
			}
		}

		// Lettres correctes pas aux bons endroits (couleur jaune)
		for (let i = 0; i < wordToFind.length; i++) {
			if (!correctIndexes.includes(i)) {
				for (let j = 0; j < wordToFind.length; j++) {
					if (i !== j && wordToFind[j] === userWord[i]) {
						misplacedIndexes.push(i);
						break;
					}
				}
			}
		}
		console.log(correctIndexes, misplacedIndexes);
		// Mise à jour de la grille
		for (let i = 0; i < wordToFind.length; i++) {
			if (correctIndexes.includes(i)) {
				classes[currentRow][i] = 'bg-green-400';
			} else if (misplacedIndexes.includes(i)) {
				classes[currentRow][i] = 'bg-yellow-500';
			}
		}

		grid.splice(); // Apparemment il y a besoin de ça car Svelte actualise pas toujours les tableaux
		if (correctIndexes.length === 5) {
			gameWon = 1;
		}
	}

	function writeLetter(letter, { rowIndex, cellIndex }) {
		if (rowIndex === -1 && cellIndex === -1) {
			gameLost = 1;
		}
		classes[rowIndex][cellIndex] = ''; // efface les classes pour éviter les conflits avec les nouvelles classes
		grid[rowIndex][cellIndex] = letter.toUpperCase();
	}

	function getCurrentWord() {
		let word = '';
		grid[currentRow].forEach((letter) => {
			word += letter;
		});
		return word;
	}

	function handleKeyDown(event) {
		console.log('handleKeyDown called with event:', event);
		const key = event.key.toUpperCase();
		const isLetter = /^[A-Z]$/.test(key);
		if (event.key === 'Enter') {
			verifyWord(wordToFind, getCurrentWord());
			currentRow = (currentRow + 1) % 5;
			const { rowIndex, cellIndex } = getNextLetter();
			if (gameWon !== 1 && rowIndex === -1 && cellIndex === -1) {
				gameLost = 1;
			}
			grid.splice(); // Apparemment il y a besoin de ça car Svelte actualise pas toujours les tableaux
		} else if (isLetter) {
			writeLetter(event.key, getNextLetter());
		}
	}

	function getNextLetter() {
		for (let rowIndex = currentRow; rowIndex < grid.length; rowIndex++) {
			for (let cellIndex = 0; cellIndex < grid[rowIndex].length; cellIndex++) {
				if (!grid[rowIndex][cellIndex]) {
					return { rowIndex, cellIndex };
				}
			}
		}
		return { rowIndex: -1, cellIndex: -1 }; // retourne une coordonnée invalide s'il n'y a plus de cases vides
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="grid grid-cols-5 gap-4">
	{#each grid as row, rowIndex}
		{#each row as cell, cellIndex}
			<input
				type="text"
				class="bg-white w-10 h-10 border-2 border-gray-300 rounded-md flex items-center justify-center text-center font-medium text-gray-900 cursor-text outline-none focus:ring-2 ring-indigo-500 {classes[
					rowIndex
				][cellIndex]}"
				value={cell}
				disabled={rowIndex !== currentRow}
				on:input={(event) => {
					grid[rowIndex][cellIndex] = event.target.value.toUpperCase();
					classes[rowIndex][cellIndex] = ''; // efface les classes pour éviter les conflits avec les nouvelles classes
					grid.splice(); // Apparemment il y a besoin de ça car Svelte actualise pas toujours les tableaux
				}}
			/>
		{/each}
	{/each}
</div>

<div style="padding-left:50px" class="mt-4 text-center">
	{#if gameWon}
		<p class="text-green-500 font-bold">Victoire !</p>
	{:else if gameLost}
		<p class="text-red-500 font-bold">Défaite :(</p>
	{:else}
		<p class="text-gray-500">Bonne chance !</p>
	{/if}
</div>
