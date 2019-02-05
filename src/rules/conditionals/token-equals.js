import {Conditional} from "./conditional";

const TYPE = "token-equals";

class TokenEqualConditional extends Conditional {

    parse(rules) {
        this.value = rules.value.toLowerCase();
        this.field = rules.field;
    }

    parseTokens(value) {
        return value.toLowerCase().split(" ").mapFilter(token => token.replace(/^[^a-z0-9-!@<]+/, "").replace(/[^a-z0-9->]+$/, ""));
    }

    isMatched(message) {

        let tokensContainer = message.tokens;
        if (!tokensContainer) {
            tokensContainer = message.tokens = {};
        }

        let tokens = tokensContainer[this.field];
        if (!tokens) {
            const value = message[this.field];
            if (value) {
                tokens = tokensContainer[this.field] = this.parseTokens(value);
            }
        }

        return tokens && tokens.some(token => token == this.value);
    }
}

export {TYPE as Type, TokenEqualConditional as Conditional};
