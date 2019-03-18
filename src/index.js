import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import routes from "./routes/index";
import {Rules} from "./rules";
import {registerLogger} from "./logging";
import {loadResources} from "./resources";

function createApp(environment, config, rulesConfig) {
    const app = express();

    const logger = registerLogger(app, config);

    const context = {
        logger,
        config,
        rulesConfig,
        resources: loadResources()
    };

    context.rules = new Rules(context, rulesConfig);

    app.use((request, response, next) => {
        Object.entries(context).forEach(([key, value]) => {
            if (!request[key]) {
                request[key] = value;
            }
        });
        return next();
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());


    app.use('/', routes);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function(err, req, res, next) { //eslint-disable-line
        res.error = err;
        res.status(err.status || 500).send({
            message: err.message,
            error: environment === 'development' ? err : {}
        });
    });


    logger.info("Started...");

    return {app, context};
}

export {createApp};
