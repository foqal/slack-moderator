
import fs from 'fs';
import path from 'path';
import {SlackApi} from "../slack-api";

function importAllToMap(rootPath, field) {
    const list = fs.readdirSync(rootPath);
    return list.mapFilter(fileName => {
        const required = require(path.join(rootPath, fileName));
        if (!required.Type) {
            return;
        }
        return {
            type: required.Type,
            require: required[field]
        };
    }).toIdMap("type", "require");
}


const TYPE_TO_CONDITIONAL = importAllToMap(path.join(__dirname, "./conditionals"), "Conditional");
const TYPE_TO_ACTION = importAllToMap(path.join(__dirname, "./actions"), "Action");


class ActionParser {

    constructor(context) {
        this.context = context;
    }

    parse(rule) {
        const type = TYPE_TO_ACTION[rule.type];
        if (!type) {
            throw new Error("Action type unknown: " + rule.type);
        }

        const action = new type(this.context, this);
        action.parse(rule);
        return action;
    }

    parseRulesMap(rules) {
        return Object.entries(rules).map(([name, value]) => ({
            name,
            value: this.parse(value)
        })).toIdMap("name", "value");
    }
}

class RuleParser {
    constructor(context) {
        this.context = context;
    }

    parse(rule) {
        const type = TYPE_TO_CONDITIONAL[rule.type];
        if (!type){
            throw new Error("No conditional found for " + rule.type);
        }

        const condition = new type(this.context, this);
        condition.parse(rule);
        return condition;
    }
}


class Rules {
    constructor(context, rules) {
        const parser = new RuleParser(context);

        const slackApis = Object.keys(rules.users)
                            .toIdMap(user => user, user => new SlackApi(context, rules.users[user].token));

        context.slackApis = slackApis;

        const actions = new ActionParser(context);
        const actionsMap = actions.parseRulesMap(rules.actions);

        this.checks = Object.entries(rules.rules).map(([name, rule]) => {
            return {
                name,
                description: rule.description,
                if: parser.parse(rule.if),
                actions: rule.actions.map(action => actionsMap[action])
            };
        });

    }

    async processMessage(context, message) {
        const event = message.event;
        const matches = this.checks.filter(check => check.if.isMatched(event));
        if (!matches.isEmpty) {
            await matches.forEachConcurrent(async match => {
                const currentContext = {
                    rule: match,
                    ...context
                };
                await match.actions.forEachPromise(async action => {
                    await action.performAction(currentContext, event);
                });
            });
        }
    }
}

export {Rules};
