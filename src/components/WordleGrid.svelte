<script>
	import WordleLine from './WordleLine.svelte';
	export const lines = [
		{ lineindex: 1, line: ['', '', '', '', ''] },
		{ lineindex: 2, line: ['', '', '', '', ''] },
		{ lineindex: 3, line: ['', '', '', '', ''] },
		{ lineindex: 4, line: ['', '', '', '', ''] },
		{ lineindex: 5, line: ['', '', '', '', ''] }
	];
	function handleKeyPress(event, lineIndex) {
		const key = event.key;
		const currentLine = lines[lineIndex];
		for (let i = 0; i < currentLine.line.length; i++) {
			if (currentLine.line[i] === '') {
				currentLine.line[i] = key;
				break;
			}
		}
	}
</script>

<div>
	{#each lines as line, lineIndex}
		<WordleLine {line} {lineIndex} on:keypress={(event) => handleKeyPress(event, lineIndex)} />
	{/each}
</div>
