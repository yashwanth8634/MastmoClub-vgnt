// Lightweight logger without external dependencies to avoid Turbopack bundling issues
// Replaces pino which was causing 'thread-stream' test file inclusion during build

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLogLevel = (
  process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug")
) as LogLevel;
const logLevelValue = LOG_LEVELS[currentLogLevel] || 1;

class Logger {
  private formatLog(level: LogLevel, message: string, data?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const log: Record<string, any> = {
      timestamp,
      level,
      message,
    };
    if (data) {
      Object.assign(log, data);
    }
    return JSON.stringify(log);
  }

  debug(message: string, data?: Record<string, any>) {
    if (logLevelValue <= LOG_LEVELS.debug) {
      console.log(this.formatLog("debug", message, data));
    }
  }

  info(message: string, data?: Record<string, any>) {
    if (logLevelValue <= LOG_LEVELS.info) {
      console.log(this.formatLog("info", message, data));
    }
  }

  warn(message: string, data?: Record<string, any>) {
    if (logLevelValue <= LOG_LEVELS.warn) {
      console.warn(this.formatLog("warn", message, data));
    }
  }

  error(message: string, data?: Record<string, any>) {
    if (logLevelValue <= LOG_LEVELS.error) {
      console.error(this.formatLog("error", message, data));
    }
  }
}

const logger = new Logger();

export default logger;
