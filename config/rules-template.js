
/*
    Looks for following environment variables
    NOTIFY_CHANNEL  - The channel ID to notify.
    NOTIFY_USER_TOKEN - The notify user token.
    ADMIN_USER_TOKEN - The admin user token.
 */


export default {
    users: {
        "notify-user": {
            token: process.env.NOTIFY_USER_TOKEN
        },
        "admin-user": {
            token: process.env.ADMIN_USER_TOKEN
        }
    },
    actions: {

    },
    rules: {

    }
};
