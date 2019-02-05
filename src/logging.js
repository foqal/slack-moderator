import bunyan from "bunyan";
import uuid from 'uuid/v4';
import "colors";


const HR_TO_NANO = 1e9;
const NANO_TO_MS = 1e6;


function createLogger(config, args) {
    const logConfig = config.logging;

    let stdoutLevel = logConfig.stdoutLevel;
    if (args) {
        stdoutLevel = args.verbose ? "DEBUG" : stdoutLevel;
    }

    const logger = bunyan.createLogger({
        name: logConfig.appName,
        serializers: bunyan.stdSerializers,
        streams: [
            {
                level: stdoutLevel,
                stream: process.stdout // log INFO and above to stdout
            },
            {
                level: 'error',
                path: logConfig.errorPath  // log ERROR and above to a file
            }
        ]
    });

    ["debug", "info", "error", "warn", "trace"].forEach(name => {
        logger[name] = logger[name].bind(logger);
    });

    return logger;
}


function colorText(status, config, text) {
    if (!config.color) {
        return text;
    }
    else if (status >= 500) {
        return text.red;
    }
    else if (status >= 400) {
        return text.yellow;
    }
    else if (status >= 300) {
        return text.cyan;
    }
    else if (status >= 200) {
        return text.green;
    }
    return text;
}

function hrTimeToMs(took) {
    return ((took[0] * HR_TO_NANO) + took[1]) / NANO_TO_MS;
}

function startTimer () {
    const start = process.hrtime();
    return () => hrTimeToMs(process.hrtime(start));
}


function registerLogger (app, config) {
    const logConfig = config.logging;
    const logger = createLogger(config);

    app.logger = logger;

    app.use(function (req, res, next) {
        req.requestId = uuid().replace(/-/g, "");


        const contextLogger = logger.child({requestId: req.requestId});
        req.logger = contextLogger;

        const timer = startTimer();

        res.on('finish', () => {

            const originalUrl = req.originalUrl.replace(/(=[^&]+)/g, "=REDACTED");
            const requestMilli = timer();
            const level = logConfig.requestLevels[res.statusCode] || logConfig.requestLevels.default;
            const msg = colorText(res.statusCode, logConfig, req.method) + " - " + originalUrl + " - " + res.statusCode;

            const properties = {
                status: res.statusCode,
                path: originalUrl,
                method: req.method,
                responseLength: res._headers["content-length"], // eslint-disable-line no-underscore-dangle
                ts: requestMilli,
                ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
            };

            if (res.error) {
                properties.path = req.protocol + '://' + req.get('host') + originalUrl;
                if (res.statusCode >= 500) {
                    properties.err = res.error;
                } else {
                    properties.errorMessage = res.error.message;
                }
            }
            contextLogger[level](properties, msg);

        });

        next();
    });

    return logger;
}

export {registerLogger};

