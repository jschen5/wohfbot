interface WordFreqs {
    [token: string]: number,
}

interface TokenToFollowingTokens {
    [token: string]: string[]
}

interface MarkovChain {
    [token: string]: WordFreqs
}


function markovChainFromMessages(messages: string[]): MarkovChain {
    const tokenToNextTokens = {};

    for (const message of messages) {
        const corpus = message.split(' ');

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
                .reduce((acc: WordFreqs, currVal: string): WordFreqs => {
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

    return markovChain;
}
