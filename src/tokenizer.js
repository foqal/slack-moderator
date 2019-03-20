import natural from "natural";

function tokenize(value) {
    return value
            .toLowerCase()
            .split(" ")
            .mapFilter(token => token.replace(/^[^a-z0-9-!@<]+/, ""))
            .map(token => natural.PorterStemmer.stem(token));
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
