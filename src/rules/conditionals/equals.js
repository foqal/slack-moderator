import {Conditional} from "./conditional";

const TYPE = "equal";

class EqualConditional extends Conditional {

    parse(rules) {
        this.field = rules.field;
        this.value = rules.value;
    }

    isMatched(message) {
        const data = message[this.field];
        return data && message[this.field] == this.value;
    }
}

export {TYPE as Type, EqualConditional as Conditional};
