<script lang="ts">
	export let targetWord: string;

	const classDefault =
		'flex items-center justify-center w-12 h-12 p-2 border lg:w-16 lg:h-16 border-gray-600 bg-gray-900 dark:text-white text-center lg:text-2xl';
	const classMissplaced =
		'flex items-center justify-center w-12 h-12 p-2 border lg:w-16 lg:h-16 border-gray-600 bg-amber-400 dark:text-white text-center lg:text-2xl';
	const classCorrect =
		'flex items-center justify-center w-12 h-12 p-2 border lg:w-16 lg:h-16 border-gray-600 bg-green-600 dark:text-white text-center lg:text-2xl';
	const classOut =
		'flex items-center justify-center w-12 h-12 p-2 border lg:w-16 lg:h-16 border-gray-600 bg-gray-700 dark:text-white text-center lg:text-2xl';

	let gameWon: number;
	let gameLost: number;

	const classes = [
		[classDefault, classDefault, classDefault, classDefault, classDefault],
		[classDefault, classDefault, classDefault, classDefault, classDefault],
		[classDefault, classDefault, classDefault, classDefault, classDefault],
		[classDefault, classDefault, classDefault, classDefault, classDefault],
		[classDefault, classDefault, classDefault, classDefault, classDefault]
	];

	let grid = [
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	];

	let currentRow = 0;

	function verifyWord(wordToFind: string, userWord: string) {
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
		// Mise à jour de la grille
		for (let i = 0; i < wordToFind.length; i++) {
			if (correctIndexes.includes(i)) {
				classes[currentRow][i] = classCorrect;
			} else if (misplacedIndexes.includes(i)) {
				classes[currentRow][i] = classMissplaced;
			} else {
				classes[currentRow][i] = classOut;
			}
		}

		// grid.splice(); // Apparemment il y a besoin de ça car Svelte actualise pas toujours les tableaux
		grid = grid;
		if (correctIndexes.length === 5) {
			gameWon = 1;
		}
	}

	function writeLetter(letter: string, { rowIndex, cellIndex }) {
		if (rowIndex === -1 && cellIndex === -1) {
			gameLost = 1;
		}
		classes[rowIndex][cellIndex] = classDefault; // efface les classes pour éviter les conflits avec les nouvelles classes
		grid[rowIndex][cellIndex] = letter.toUpperCase();
	}

	function getCurrentWord() {
		let word = '';
		grid[currentRow].forEach((letter) => {
			word += letter;
		});
		return word;
	}

	function handleKeyDown(event: KeyboardEvent) {
		const key = event.key.toUpperCase();
		const isLetter = /^[A-Z]$/.test(key);
		if (event.key === 'Enter') {
			verifyWord(targetWord, getCurrentWord());
			currentRow = (currentRow + 1) % 5;
			const { rowIndex, cellIndex } = getNextLetter();
			if (gameWon !== 1 && rowIndex === -1 && cellIndex === -1) {
				gameLost = 1;
			}
			// grid.splice(); // Apparemment il y a besoin de ça car Svelte actualise pas toujours les tableaux
			grid = grid;
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
				class={classes[rowIndex][cellIndex]}
				value={cell}
				disabled={rowIndex !== currentRow}
				on:input={(event) => {
					grid[rowIndex][cellIndex] = event.target?.value.toUpperCase();
					classes[rowIndex][cellIndex] = ''; // efface les classes pour éviter les conflits avec les nouvelles classes
					// grid.splice(); // Apparemment il y a besoin de ça car Svelte actualise pas toujours les tableaux
					grid = grid;
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
