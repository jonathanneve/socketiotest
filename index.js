import express from 'express';
import { Server } from 'socket.io';
import morgan from 'morgan';
import winston from 'winston';

// Logging severity levels (based on NPM)
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  silly: 5, // We *must* use this somehow :)
};

// Associate colors with log levels
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
  silly: 'white',
});

const format = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),

  // String interpolation splat for %d %s-style messages
  winston.format.splat(),

  // Pretty-print structured output
  winston.format.prettyPrint(),

  // Set levels to uppercase and add brackets
  winston.format(info => {
    info.level = `[${info.level.toUpperCase()}]`;
    return info;
  })(),

  // Colorize log statements—this must happen after changing the info-level to
  // uppercase
  winston.format.colorize({ all: true }),

  // Define the format of the message showing the timestamp, the level and the
  // message. Convert pure objects to a string if necessary.
  winston.format.printf(info => {
    if (typeof info.message === 'object') {
      info.message = JSON.stringify(info.message, null, 3);
    }
    return `${info.timestamp} ${info.level} ${info.message}`;
  }),
);

// Define which transports the logger must use to print out messages—this can be
// used to write out to files or streams, but we only need to transport to
// console
const transports = [new winston.transports.Console()];

// Create the logger instance
const logger = winston.createLogger({
  level: 'debug',
  levels,
  format,
  transports,
});

const app = express();
app.use(morgan(
  ':remote-addr :method :url :status :response-time ms',
  {
    stream: {
      write: message => logger.http(message.trim()),
    },
  },
));
const port = 3001;
const httpServer = app.listen(port, () => {
  logger.info(
    `Server is now listening on port ${port} ✓`,
  );
  new Server(httpServer);
});

export default app;
