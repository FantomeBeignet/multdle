<script>
	import { words } from './words.js';

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

	let currentRow = 0;

	function verifyWord(wordToFind, userWord) {
		console.log(wordToFind, userWord);
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

		// Mise à jour de la grille (pas encore correcte, à modifier
		for (let i = 0; i < wordToFind.length; i++) {
			const cell = grid[currentRow][i];
			if (correctIndexes.includes(i)) {
				grid[currentRow][i] = `<span class="text-green-500">${cell}</span>`;
			} else if (misplacedIndexes.includes(i)) {
				grid[currentRow][i] = `<span class="text-orange-500">${cell}</span>`;
			}
		}

		grid.splice(); // Apparemment il y a besoin de ça car Svelte actualise pas toujours les tableaux
	}

	function getCurrentWord() {
		let word = '';
		grid[currentRow].forEach((letter) => {
			word += letter;
		});
		return word;
	}

	function handleKeyDown(event) {
		event.preventDefault();
		console.log('handleKeyDown called with event:', event);
		if (event.key === 'Enter') {
			verifyWord(wordToFind, getCurrentWord());
			currentRow = (currentRow + 1) % 5;
			grid.splice(); // Apparemment il y a besoin de ça car Svelte actualise pas toujours les tableaux
		}
	}
</script>

<div class="grid grid-cols-5 gap-4">
	{#each grid as row, rowIndex}
		{#each row as cell, cellIndex}
			<input
				type="text"
				class="bg-white w-10 h-10 border-2 border-gray-300 rounded-md flex items-center justify-center text-center font-medium text-gray-900 cursor-text outline-none focus:ring-2 ring-indigo-500"
				value={cell}
				on:window:keydown|preventDefault={handleKeyDown}
				disabled={rowIndex !== currentRow}
				on:input={(event) => {
					grid[rowIndex][cellIndex] = event.target.value.toUpperCase();
					grid.splice(); // Apparemment il y a besoin de ça car Svelte actualise pas toujours les tableaux
				}}
			/>
		{/each}
	{/each}
</div>
