import {Conditional} from "./conditional";

const TYPE = "equal";

class EqualConditional extends Conditional {

    parse(rules) {
        this.field = rules.field;
        this.value = rules.value;
        this.isNull = rules.null;
    }

    isMatched(message) {
        const data = message[this.field];
        if (this.isNull != null) {
            return this.isNull ? !data : data;
        }
        return (data && message[this.field] == this.value);
    }
}

export {TYPE as Type, EqualConditional as Conditional};
