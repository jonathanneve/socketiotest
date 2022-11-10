import express from 'express';
import { Server } from 'socket.io';
import morgan from 'morgan';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.splat(),
    winston.format.prettyPrint(),
    winston.format(info => {
      info.level = `[${info.level.toUpperCase()}]`;
      return info;
    })(),
  
    winston.format.printf(info => {
      if (typeof info.message === 'object') {
        info.message = JSON.stringify(info.message, null, 3);
      }
      return `${info.timestamp} ${info.level} ${info.message}`;
    }),
  ),
  transports: [new winston.transports.Console()]
});

const morganMiddleware = morgan(
':remote-addr :method :url :status :response-time ms',
{
  stream: {
    write: message => logger.http(message.trim()),
  },
});

const app = express();
app.use(morganMiddleware);
const port = 3001;
const httpServer = app.listen(port, () => {
  logger.info(
    `Server is now listening on port ${port} ✓`,
  );
  new Server(httpServer);
});

export default app;
