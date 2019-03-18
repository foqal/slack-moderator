import {Conditional} from "./conditional";
import {cachedTokenize, tokenize} from "../../tokenizer";

const TYPE = "token-equals";

class TokenEqualConditional extends Conditional {

    parse(rules) {
        this.value = tokenize(rules.value.toLowerCase()).join(" ");
        this.field = rules.field;
    }

    isMatched(message) {
        const tokens = cachedTokenize(message, this.field);
        return tokens && tokens.some(token => token == this.value);
    }
}

export {TYPE as Type, TokenEqualConditional as Conditional};
