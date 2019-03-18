import {Action} from "./action";

const TYPE = "log-message";

class LogMessageAction extends Action {
    parse(rule) {
        this.message = rule.message || "Logging Message";
    }
    async performAction(context, message) {
        context.logger.info({message: message, rule: context.rule.name},  this.message);
    }
}

export {TYPE as Type, LogMessageAction as Action};
