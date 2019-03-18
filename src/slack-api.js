import requestPromise from 'request-promise';

const API_BASE = "https://slack.com/api/";


const REDACT_TOKENS = [
    "client_secret",
    "token",
    "code",
    "trigger_id"
];

function createDebugParams(form) {
    const debugForm = Object.assign({}, form);
    REDACT_TOKENS.forEach(token => {
        if (debugForm[token]) {
            debugForm[token] = "REDACTED";
        }
    });
    return debugForm;
}


const FORMAT_TYPE = {
    JSON: (request, form) => {

        if (form.token) {
            request.headers = {
                Authorization: "Bearer " + form.token,
                "Content-Type": "application/json; charset=\"utf-8\""
            };
            delete form.token;
        }
        request.json = true;
        request.body = form;

        return request;
    },
    DEFAULT: (request, form) => {
        request.form = form;
        return request;
    }
};


class SlackApi {
    constructor(context, accessToken) {
        this.context = context;
        this.accessToken = accessToken;
    }

    async getApiRaw(api, form, typeFormatter, url = null) {

        url = url || API_BASE + api;
        typeFormatter = typeFormatter || FORMAT_TYPE.DEFAULT;


        const requestParams = {
            uri: url,
            method: "POST"
        };

        const request = typeFormatter(requestParams, form);


        let data = null;
        try {
            this.context.logger.trace({api, params: createDebugParams(form), result: data}, "Starting Request.");

            const response = await requestPromise(request);
            data = typeof response === "string" ? JSON.parse(response) : response;
        } catch (err) {
            if (err.statusCode == 429) {
                throw new Error({message: "Rate Limit", status: 501, innerError: err});
            }
            this.context.logger.warn({api, params: createDebugParams(form)}, "Error getting data from slack.");
            throw new Error({message: "Error getting data from API", status: 501, innerError: err});
        }

        if (!data.ok) {
            this.context.logger.warn({api, params: createDebugParams(form), result: data}, "Error getting data from slack.");
            throw new Error({message: data.error, status: 501});
        }

        if (data.warning) {
             this.context.logger.warn({api, warnings: data.response_metadata.warnings}, "Warning message from Slack.");
        }
        this.context.logger.debug({api, url}, "Got data from slack api.");
        return data;
    }

     async getApi(api, request, typeFormatter = null, url = null) {
        const form = request ? {...request} : {};
        form.token = this.accessToken;
        return await this.getApiRaw(api, form, typeFormatter, url);
    }

    async postMessage(channel, user, text, attachments) {
        return this.getApi("chat.postEphemeral", {
            channel,
            user,
            text,
            attachments
        }, FORMAT_TYPE.JSON);
    }

    async sendMessage(channel, text, attachments) {
        return this.getApi("chat.postMessage", {
            channel,
            text,
            attachments
        }, FORMAT_TYPE.JSON);
    }

    async deleteMessage(channel, timestamp) {
        return this.getApi("chat.delete", {
            channel,
            ts: timestamp
        });
    }

    async blockUser(user) {
        return this.getApi("users.admin.setInactive", {
            user
        });
    }


}

export {SlackApi};
