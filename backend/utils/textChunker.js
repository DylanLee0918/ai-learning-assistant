export const chunkText = (text, chunkSize = 500, overlap = 50) => {
	if (!text || text.trim().length === 0) {
		return [];
	}

	const cleanedText = text
		.replace(/\r\n/g, "\n")
		.replace(/\s+/g, " ")
		.replace(/\n /g, "\n")
		.replace(/ \n/g, "\n")
		.trim();

	const paragraphs = cleanedText
		.split(/\n+/)
		.filter((p) => p.trim().length > 0);

	const chunks = [];
	let currentChunk = [];
	let currentWordCount = 0;
	let chunkIndex = 0;

	for (const paragraph of paragraphs) {
		const paragraphWords = paragraph.trim().split(/\s+/);
		const paragraphWordCount = paragraphWords.length;

		if (paragraphWordCount > chunkSize) {
			if (currentChunk.length > 0) {
				chunks.push({
					content: currentChunk.join("\n\n"),
					chunkIndex: chunkIndex++,
					pageNumber: 0,
				});
				currentChunk = [];
				currentWordCount = 0;
			}

			// ✅ Restored for loop
			for (
				let i = 0;
				i < paragraphWords.length;
				i += chunkSize - overlap
			) {
				const chunkWords = paragraphWords.slice(i, i + chunkSize);
				chunks.push({
					content: chunkWords.join(" "),
					chunkIndex: chunkIndex++,
					pageNumber: 0,
				});
				if (i + chunkSize >= paragraphWords.length) break;
			}
			continue;
		}

		// ✅ Fixed: currentWordCount (not currentChunk)
		if (
			currentWordCount + paragraphWordCount > chunkSize &&
			currentChunk.length > 0
		) {
			chunks.push({
				content: currentChunk.join("\n\n"),
				chunkIndex: chunkIndex++,
				pageNumber: 0,
			});

			const prevChunkText = currentChunk.join(" ");
			const prevWords = prevChunkText.split(/\s+/);
			const overlapText = prevWords
				.slice(-Math.min(overlap, prevWords.length))
				.join(" ");

			currentChunk = [overlapText, paragraph.trim()];
			currentWordCount =
				overlapText.split(/\s+/).length + paragraphWordCount;
		} else {
			currentChunk.push(paragraph.trim());
			currentWordCount += paragraphWordCount;
		}
	}

	if (currentChunk.length > 0) {
		chunks.push({
			content: currentChunk.join("\n\n"),
			chunkIndex: chunkIndex,
			pageNumber: 0,
		});
	}

	if (chunks.length === 0 && cleanedText.length > 0) {
		const allWords = cleanedText.split(/\s+/);
		for (let i = 0; i < allWords.length; i += chunkSize - overlap) {
			const chunkWords = allWords.slice(i, i + chunkSize);
			chunks.push({
				content: chunkWords.join(" "),
				chunkIndex: chunkIndex++,
				pageNumber: 0,
			});
			if (i + chunkSize >= allWords.length) break;
		}
	}

	return chunks;
};

export const findRelevantChunks = (chunks, query, topK = 5) => {
	if (!chunks || chunks.length === 0 || !query) return [];

	const stopWords = new Set([
		"what",
		"is",
		"the",
		"of",
		"as",
		"in",
		"a",
		"an",
		"and",
		"or",
		"to",
		"that",
		"this",
		"it",
		"for",
		"on",
		"are",
		"was",
		"with",
		"by",
		"at",
		"from",
		"stated",
		"text",
		"me",
		"tell",
		"about",
		"does",
	]);

	const queryWords = query
		.toLowerCase()
		.split(/\s+/)
		.filter((w) => w.length > 2 && !stopWords.has(w));

	// If no meaningful words, fallback to first topK chunks
	if (queryWords.length === 0) return chunks.slice(0, topK);

	const scored = chunks.map((chunk) => {
		const content = chunk.content.toLowerCase();
		const score = queryWords.reduce((acc, word) => {
			const matches = (content.match(new RegExp(word, "gi")) || [])
				.length;
			return acc + matches;
		}, 0);
		return { ...chunk, score };
	});

	const filtered = scored.filter((c) => c.score > 0);

	// Fallback: if nothing scored, still send first topK chunks to Gemini
	return (filtered.length > 0 ? filtered : chunks)
		.sort((a, b) => b.score - a.score)
		.slice(0, topK);
};
