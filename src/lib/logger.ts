export type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  [key: string]: any;
}

class Logger {
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      environment: process.env.NODE_ENV || "development",
      ...context,
    };

    console.log(JSON.stringify(logEntry));
  }

  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  }

  error(message: string, error?: any, context?: LogContext) {
    const errorContext = error instanceof Error ? {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
      ...context
    } : { error, ...context };

    this.log("error", message, errorContext);
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== "production") {
      this.log("debug", message, context);
    }
  }
}

export const logger = new Logger();
