import {Conditional} from "./conditional";
const TYPE = "regex-match";

class RegexMatchConditional extends Conditional {

    parse(rules) {
        if (!rules.regex) {
            throw new Error("No regular expression defined in the rule");
        }
        this.regexp = new RegExp(rules.regex, rules.flags || "ig");
        this.field = rules.field;
    }

    isMatched(message) {
        const data = message[this.field];
        return data && this.regexp.test(data);
    }
}

export {TYPE as Type, RegexMatchConditional as Conditional};
