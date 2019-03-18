import {Conditional} from "./conditional";

const TYPE = "not";

class NotConditional extends Conditional {

    parse(rules) {
        this.childRule = this.parser.parse(rules.rule);
    }

    isMatched(message) {
        return !this.childRule.isMatched(message);
    }
}

export {TYPE as Type, NotConditional as Conditional};
