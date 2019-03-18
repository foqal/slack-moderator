import {Conditional} from "./conditional";

const TYPE = "disabled";

class DisabledConditional extends Conditional {
    parse() {
        //ignore
    }
    isMatched() {
        return false;
    }
}

export {TYPE as Type, DisabledConditional as Conditional};
