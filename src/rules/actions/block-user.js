import {Action} from "./action";

const TYPE = "block-user";

class BlockUserAction extends Action {
    parse(rule) {
        this.slackApi = this.context.slackApis[rule.user];
    }
    async performAction(context, message) {
        await this.slackApi.blockUser(message.user);
        context.logger.info({to: message.user, rule: context.rule.name}, "Blocked user");
    }
}

export {TYPE as Type, BlockUserAction as Action};
