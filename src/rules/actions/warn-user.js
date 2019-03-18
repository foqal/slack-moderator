import {Action} from "./action";

const TYPE = "warn-user";

class WarnUserAction extends Action {
    parse(rule) {
        this.slackApi = this.context.slackApis[rule.user];
        this.message = rule.message;
    }
    async performAction(context, message) {
        if (!message.user) {
            context.logger.warn({rule: context.rule.name}, "Cant post warning to user since user doesn't exist.");
            return;
        }
        const msg = this.message.replace(/\$\{user\}/g, message.user).replace(/\$\{channel\}/g, message.channel);
        await this.slackApi.postMessage(message.channel, message.user, msg) ;
        context.logger.info({to: message.user, rule: context.rule.name}, "Posting warning message");
    }
}

export {TYPE as Type, WarnUserAction as Action};
