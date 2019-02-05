import {Conditional} from "./conditional";

const TYPE = "and";

class AndConditional extends Conditional {

    parse(rules) {
        this.children = rules.rules.map(rule => this.parser.parse(rule));
    }

    isMatched(message) {
        return this.children.every(condition => condition.isMatched(message));
    }
}

export {TYPE as Type, AndConditional as Conditional};
