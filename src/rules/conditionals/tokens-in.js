import {Conditional} from "./conditional";
import {cachedTokenize} from "../../tokenizer";
const TYPE = "tokens-in";

class TokensInConditional extends Conditional {

    parse(rules) {
        const {maxWordCount, words} = this.context.resources[rules.list.toLowerCase()];
        this.list = words;
        this.maxWordCount = maxWordCount;
        this.field = rules.field;
    }

    isMatched(message) {
        const tokens = cachedTokenize(message, this.field);
        if (!tokens) {
            return;
        }

        for (let i = 0; i < tokens.length; i++) {
            const stop = Math.max(i - this.maxWordCount, 0);
            for (let j = i; j >= stop; j--) {
                const words = tokens.slice(j, i + 1).join(" ");
                if (this.list.has(words)){
                    return true;
                }
            }
        }
        return false;
    }
}

export {TYPE as Type, TokensInConditional as Conditional};
