import natural from "natural";

const tokenizer = new natural.TreebankWordTokenizer();

function tokenize(value) {
    return tokenizer.tokenize(value.toLowerCase()).map(token => natural.PorterStemmer.stem(token));
}

function cachedTokenize(message, field) {
    let tokensContainer = message.tokens;
    if (!tokensContainer) {
        tokensContainer = message.tokens = {};
    }

    let tokens = tokensContainer[field];
    if (!tokens) {
        const value = message[field];
        if (value) {
            tokens = tokensContainer[field] = tokenize(value);
        }
    }

    return tokens;
}
export {tokenize, cachedTokenize};
