export default {
    rules: "rules",
    slack: {
        verificationToken: "[VERTIFICATION TOKEN FROM BOT]",
    },
    logging: {
        appName: "moderator",
        stdoutLevel: "debug",
        errorPath: "/var/tmp/moderator-error.log",
        requestLevels: {
            default: "info",
            500: "error",
            404: "warn"
        },
        color: true
    },
};
