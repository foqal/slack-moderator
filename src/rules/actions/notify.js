import {Action} from "./action";

const TYPE = "notify";

class NotifyAction extends Action {
    parse(rule) {
        this.slackApi = this.context.slackApis[rule.user];
        this.channel = rule.channel;
        this.message = rule.message;
    }
    async performAction(context, message) {
        const msg = this.message.replace(/\$\{user\}/g, message.user || message.bot_id).replace(/\$\{channel\}/g, message.channel);
        await this.slackApi.sendMessage(this.channel, msg);
        context.logger.info({to: message.user, rule: context.rule.name}, "Sending Message");
    }
}

export {TYPE as Type, NotifyAction as Action};
