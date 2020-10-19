import createLogger from "./logger.mjs";
import createServer from "./server/index.mjs";

const logger = createLogger();
const server = createServer(logger, 8000);

// TODO: Signal handling