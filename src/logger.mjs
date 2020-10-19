import pino from "pino";

export default function createLogger(debug = true) {
    return pino({
        level: debug ? 'trace' : 'silent'
    });
}