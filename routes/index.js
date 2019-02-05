import express from "express";
const router = express.Router();


function post(name, handler) {
    router.post(name, async (request, response, next) => {
        try {
            await handler(request, response);
        } catch (error) {
            next(error);
        }
    });
}

post('/slack/hook', async function(request, response) {
    const body = request.body;
    if (body.token != request.config.slack.verificationToken) {
        response.status(401).send();
        return;
    }

    if (body.type == "url_verification" && body.challenge) {
        response.status(200).send(request.body.challenge);
        return;
    }

    await request.rules.processMessage(request, body);

    response.status(200).send({});
});


module.exports = router;
