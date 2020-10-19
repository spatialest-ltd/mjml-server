import express from "express";
import bodyParser from "body-parser"
import mjml2html from "mjml";
import extractToken from "./token.mjs";

const token = process.env.MJML_TOKEN;
const testMode = process.env.NODE_ENV !== 'production';

function parseMJML() {
    return bodyParser.raw({
        inflate: true,
        limit: 1000000, // 1 MB
        type: 'application/xml+mjml'
    });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function checkToken(req, res, next) {
    if (!token) {
        next();
        return;
    }
    if (token !== extractToken(req)) {
        res.status(401);
        res.send({
            msg: "Invalid token provided",
            status: 401
        })
    }
    next();
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function health(req, res) {
    res.send({
        pid: process.pid,
        healthy: true, // Implement proper health check, like memory usage
        uptime: process.uptime(),
        protected: token !== undefined,
    });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function test(req, res) {
    res.contentType('text/html');
    res.sendFile(process.cwd() + '/html/try.html');
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function parse(req, res) {
    try {
        const mjml = mjml2html(req.body.toString(), {
            beautify: true,
            keepComments: true
        });
        res.contentType('text/html');
        res.send(mjml.html);
    } catch (e) {
        res.status(400);
        res.send({
            msg: e.message,
            status: 400
        })
    }
}

/**
 * @param port
 * @param logger
 * @return {http.Server}
 */
export default function createServer(logger, port = 8000) {
    const app = express();

    app.get('/', health);
    app.post('/parse', checkToken, parseMJML(), parse);
    if (testMode) {
        app.get('/try', test)
    }

    return app.listen(port, () => {
        logger.info(`Server started in port ${port}`);
        if (token) {
            logger.info('Your mjml token is ' + token);
        } else {
            logger.warn('Your mjml service is running unprotected');
        }
    });
}