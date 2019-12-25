interface WordFreqs {
    [token: string]: number,
}

type WordCounts = WordFreqs;

interface TokenToFollowingTokens {
    [token: string]: string[]
}

interface MarkovChain {
    [token: string]: WordFreqs
}

interface MarkovData {
    markovChain: MarkovChain,
    startWords: string[],
    endWords: string[],
}

export function markovDataFromMessages(messages: string[]): MarkovData {
    const tokenToNextTokens = {};
    const startWords = [];
    const endWords = [];

    for (const message of messages) {
        const corpus = message.split(' ');

        startWords.push(corpus[0]);
        endWords.push(corpus[corpus.length - 1]);

        corpus.forEach((token: string, index: number) => {
            const nextToken = corpus[index + 1];
            if (nextToken) {
                if (tokenToNextTokens.hasOwnProperty(token)) {
                    tokenToNextTokens[token].push(nextToken);
                } else {
                    tokenToNextTokens[token] = [nextToken];
                }
            }
        });
    }

    const markovChain = Object.keys(tokenToNextTokens)
        .reduce((chain: MarkovChain, token: string) => {
            const nextTokens = tokenToNextTokens[token];
            const wordCounts = nextTokens
                .reduce((acc: WordCounts, currVal: string): WordCounts => {
                    if (acc.hasOwnProperty(currVal)) {
                        acc[currVal]++;
                    } else {
                        acc[currVal] = 1;
                    }
                    return acc;
                }, {});

            const wordFreqs = Object.keys(wordCounts)
                .reduce((acc: WordFreqs, currVal: string): WordFreqs => {
                    return {
                        [currVal]: wordCounts[currVal] / nextTokens.length,
                        ...acc,
                    };
                }, {});

            chain[token] = wordFreqs;
            return {
                [token]: wordFreqs,
                ...chain,
            };
        }, {});

    return { markovChain, startWords, endWords };
}

export function messageFromMarkovData(markovData: MarkovData): string {
    const { markovChain, startWords, endWords } = markovData;

    // First choose a random start word.
    const startWord = startWords[Math.floor(Math.random() * startWords.length)];

    let message = [startWord];
    let currWord = startWord;
    let nextWord;
    while (!endWords.hasOwnProperty(nextWord)) {
        nextWord = chooseNextWord(currWord, markovChain);
        
        if (!nextWord) break;

        message = [...message, nextWord];

        currWord = nextWord;
    }

    return message.join(' ');
}

function chooseNextWord(currentWord: string, markovChain: MarkovChain): string {
    const threshold = Math.random();
    let probTotal = 0;
    
    const wordFreqs = markovChain[currentWord];
    if (!wordFreqs) {
        return '';
    }

    for (const word of Object.keys(wordFreqs)) {
        probTotal += wordFreqs[word];

        if (probTotal > threshold) return word;
    }

    return '';
}
