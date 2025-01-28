import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

interface RequestLogMessage {
  method?: string;
  url?: string;
  ip?: string;
  [key: string]: any;
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat()
);

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new DailyRotateFile({
      filename: `${process.env.LOG_DIR || "logs"}/storage-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: winston.format.combine(winston.format.json()),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => {
          if (
            info.message &&
            typeof info.message === "object" &&
            "method" in info.message
          ) {
            const { method, url, ip } = info.message as RequestLogMessage;
            return `${info.timestamp} [${info.level}]: ${method} ${url} (${ip})`;
          }
          return `${info.timestamp} [${info.level}]: ${
            info.message
          } ${JSON.stringify(info, null, 2)}`;
        })
      ),
    })
  );
}

export default logger;
