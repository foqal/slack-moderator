# Slack Moderator

As Slack is taking over for IRC as the community default platform, and because Slack isn't really designed
as a community app, we need some basic moderation features. This project is to help create basic moderation
rules to help control bad actors, and stop spam.

Since we dont want the bad actors to have the signals that we look for, we create a configurable interface which allows you to create rules and checks that apply to each message or event from Slack. The rules themselves are hidden away but accessible if you contact us. Ultimately this is just a processor that runs configs and speaks Slack.

# Installing + Running

## Bot
To install simply run:
```
$ npm i -g slack-moderator
```

Once its installed you can run to see the basic options.
```
$ slack-moderator --help
```

You will need to create 2 config files for this to run - ([Rules Config](#rules-config) and [General Config](#general-config) once that is done, you can simply run the bot like:
```
$ slack-moderator --config [PATH_TO_CONFIG] --rules-config [PATH_TO_RULES_CONFIG]
```

## Slack
To have the Slack moderator be able to work, you will need to create a Slack Bot and point it at the Slack Moderator bot. I will not cover this, but this will require hosting the Slack Moderator app somewhere and creating a public url to it.

1. Go to the Apps dashboard in Slack - https://api.slack.com/apps and create a new App. Giving it the name you want to use.
2. Under the Basic Information tab, you will want to store the verification token. This will be used in [General Config](#general-config).
3. Click on Event Subscriptions and and click "On" to enable event subscriptions.
    3.1 In the Request URL, enter whatever url you are exposing the bot as. The path should be /slack/hook. For example, if the external URL of your bot is "https://my-host.aws.com" the request URL should be "https://my-host.aws.com/slack/hook". 
    3.2 Once you change, it Slack will automatically test that endpoint. Make sure your bot is running and this will work.
    3.3 Subscribe to events that you want to monitor. This will depend on the rules you want to run. For example, if you want to simply see all public channel messages, subscribe to "message.channels". If you want to disable file sharing, add "file_shared".
    3.4 Save Changes at the bottom.
4. Under Bot Users - click "Add a Bot User". Here you will need to give it a display name and username then click Save Changes
5. Install the app to your workspace. You will then get a "But User OAuth Access Token" which you will use in [Rules Config](#rules-config).
6. Apply the stored tokens to your [Rules Config](#rules-config) and [General Config](#general-config) and restart the Slack Moderator Bot.

# Config
Most of the config is pretty simple however the rules also contain the info for the attack vectors. For some rules contact us and we will give you a base to work with.

## General Config
This is the default config. You can configure it however you want but you will need to add the verification token you got from step 2 in [Installing Slack](#slack)
```
exports.default = {
    rules: "rules",
    server: {
        host: "0.0.0.0",
        port: 3000
    },
    slack: {
        verificationToken: "[VERIFICATION_TOKEN]",
    },
    logging: {
        appName: "moderator",
        stdoutLevel: "info",
        errorPath: "/var/tmp/moderator-error.log",
        requestLevels: {
            default: "info",
            500: "error",
            404: "warn"
        },
        color: true
    },
};
```


## Rules Config
The rules file consists of 3 sections and like the general config is a javascript file.

So lets say you wanted to create a rule that deletes a message from any user that writes potato. It would look something like:
```
exports.default = {
    users: {
        "admin-user": {
            "token": "[USER_TOKEN_WITH_ADMIN_PERMISSIONS]"
        }
    },
    actions: {
        "delete-current-message": {
            type: "delete-message",
            user: "admin-user"
        }
    },
    rules: {
        "remove-text-potato": {
            "description": "Removes the message if a user writes potato",
            if: {
                type: "and",
                rules: [
                    {
                        field: "type",
                        type: "equal",
                        value: "message"
                    },
                    {
                        field: "text",
                        type: "token-equals",
                        value: "potato"
                    },
                ]
            },
            actions: [
                "delete-current-message"
            ]
        }
    }
}
```



The general pattern is:
```
exports.default = {
    users: {
        "[user-name]": {
            "token": "[xoxb-slack-user-or-bot-token]"
        }
    },
    actions: {
        "[action-name]": {
            type: "[action-type]",
            ... other options here
        }
    },
    rules: {
        "[rule-name]": {
            "description": "Friendly description to describe what the rule does",
            if: {
                ...conditions
            },
            actions: [
                "[action-name]"
            ]
        }
    }
}
```



### Users
These are the users you want to perform certain actions on behalf of. The only thing we need here is the token used to act on behalf of this user.
```
...
users: {
    "my-user": {
        "token": "[xoxb-slack-user-or-bot-token]"
    }
},
...
```
 
 
 
### Actions
This is a block where you can configure certain actions to run and use them in the rules as triggers. For example,
```
...
actions: {
    "my-action": {
        type: "notify",
        channel: "[my-admin-channel]",
        message: "User <@${user}> wrote 'potato' messages on channel <#${channel}>.",
        user: "my-user"
    }
},
...
```

There are currently a few actions we support:
#### Notify
This action will send a message to the specified channel with the specified message. There are a few strings that are able to be replaced into the message to let the channel know what happened.

*Fields:*

| field   | description  |
| ------  | ------------ |
| channel | The channel ID to use. The easiest way to find this is looking at the URL when in a slack channel. For example in https://my-slack.slack.com/messages/C1111111 C1111111 is the channel ID.
| message | The message to write to the channel. Currently you can use `${user}` and `${channel}` to replace the raw channel and user id.
| user    | This is the user to run the command as. This should match to a user registered in the [Users Section](#users)

*Example:*
```
...
"my-action": {
    type: "notify",
    channel: "[my-admin-channel]", 
    message: "User <@${user}> wrote 'potato' messages on channel <#${channel}>.",
    user: "my-user"
}
...
```

#### delete-message
This action will delete the message send by the user.

*Fields:*

| field   | description  |
| ------  | ------------ |
| user    | This is the user to run the command as. This should match to a user registered in the [Users Section](#users). This user has to have admin permissions.

*Example:*
```
...
"my-action": {
    type: "delete-message",
    user: "my-user"
}
...
```

#### block-user
This action will block the current user.

*Fields:*

| field   | description  |
| ------  | ------------ |
| user    | This is the user to run the command as. This should match to a user registered in the [Users Section](#users). This user has to have admin permissions.

*Example:*
```
...
"my-action": {
    type: "delete-message",
    user: "my-user"
}
...
```


### Rules
