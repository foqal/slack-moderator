import {Conditional} from "./conditional";

const TYPE = "or";

class OrConditional extends Conditional {

    parse(rules) {
        this.children = rules.rules.map(rule => this.parser.parse(rule));
    }

    isMatched(message) {
        return this.children.some(condition => condition.isMatched(message));
    }
}

export {TYPE as Type, OrConditional as Conditional};
