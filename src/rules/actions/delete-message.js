import {Action} from "./action";

const TYPE = "delete-message";

class DeleteMessageAction extends Action {
    parse(rule) {
        this.slackApi = this.context.slackApis[rule.user];
    }
    async performAction(context, message) {
        await this.slackApi.deleteMessage(message.channel, message.ts);
        context.logger.info({to: message.user, rule: context.rule.name}, "Deleted Message");
    }
}

export {TYPE as Type, DeleteMessageAction as Action};
