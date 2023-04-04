<script lang="ts">
	export let targetWord: string;
	export let onWin: () => void;
	export let onLose: () => void;

	const letterMap = new Map<string, number>();
	targetWord
		.toUpperCase()
		.split('')
		.forEach((l) => {
			if (!letterMap.has(l)) letterMap.set(l, 1);
			else {
				const count = letterMap.get(l) as number;
				letterMap.set(l, count + 1);
			}
		});

	type Position = { rowIndex: number; cellIndex: number };

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
		const markedLetters = new Map<string, number>();

		// Lettres correctes aux bons endroits (couleur verte)
		for (let i = 0; i < wordToFind.length; i++) {
			if (wordToFind[i] === userWord[i]) {
				correctIndexes.push(i);
				if (!markedLetters.has(wordToFind[i])) markedLetters.set(wordToFind[i], 1);
				else {
					const count = markedLetters.get(wordToFind[i]) as number;
					markedLetters.set(wordToFind[i], count + 1);
				}
			}
		}
		// Lettres correctes pas aux bons endroits (couleur jaune)
		for (let i = 0; i < userWord.length; i++) {
			if (!correctIndexes.includes(i)) {
				for (let j = 0; j < wordToFind.length; j++) {
					const markedNumber = markedLetters.get(userWord[i]) ?? 0;
					const totalNumber = letterMap.get(wordToFind[j]) ?? 0;
					if (i !== j && wordToFind[j] === userWord[i] && markedNumber < totalNumber) {
						misplacedIndexes.push(i);
						markedLetters.set(userWord[i], markedNumber + 1);
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
			onWin();
		}
	}

	function writeLetter(letter: string, { rowIndex, cellIndex }: Position) {
		if (rowIndex === -1 && cellIndex === -1) {
			gameLost = 1;
			onLose();
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
		if (event.key === 'Enter' && getCurrentWord().length === 5) {
			verifyWord(targetWord, getCurrentWord());
			currentRow = (currentRow + 1) % 5;
			const { rowIndex, cellIndex } = getNextLetter();
			if (gameWon !== 1 && rowIndex === -1 && cellIndex === -1) {
				gameLost = 1;
				onLose();
			}
			// grid.splice(); // Apparemment il y a besoin de ça car Svelte actualise pas toujours les tableaux
			grid = grid;
		} else if (event.key === 'Backspace') {
			const { rowIndex, cellIndex } = getNextLetter();
			grid[currentRow][cellIndex > 0 ? cellIndex - 1 : 4] = '';
			grid = grid;
		} else if (isLetter && getCurrentWord().length < 5) {
			writeLetter(event.key, getNextLetter());
		}
	}

	function getNextLetter(): Position {
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

<div class="grid grid-cols-5 gap-2">
	{#each grid as row, rowIndex}
		{#each row as cell, cellIndex}
			<div class={classes[rowIndex][cellIndex]}>{grid[rowIndex][cellIndex]}</div>
		{/each}
	{/each}
</div>
