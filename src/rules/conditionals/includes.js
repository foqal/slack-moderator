import {Conditional} from "./conditional";

const TYPE = "includes";

class IncludesConditional extends Conditional {

    parse(rules) {
        this.field = rules.field;
        this.value = rules.value;
    }

    isMatched(message) {
        const data = message[this.field];
        return data && data.includes(this.value);
    }
}

export {TYPE as Type, IncludesConditional as Conditional};
