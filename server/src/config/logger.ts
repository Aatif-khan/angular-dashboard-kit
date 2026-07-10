/**
 * Logger interface defining core method signatures for standard log output.
 */
export interface Logger {
  info(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  error(message: string, ...meta: any[]): void;
  debug(message: string, ...meta: any[]): void;
}

/**
 * Standard Console implementation of the Logger interface.
 */
class ConsoleLogger implements Logger {
  info(message: string, ...meta: any[]): void {
    console.info(`[INFO] ${message}`, ...meta);
  }

  warn(message: string, ...meta: any[]): void {
    console.warn(`[WARN] ${message}`, ...meta);
  }

  error(message: string, ...meta: any[]): void {
    console.error(`[ERROR] ${message}`, ...meta);
  }

  debug(message: string, ...meta: any[]): void {
    // Suppress debug message outputs in production environments
    if (process.env['NODE_ENV'] !== 'production') {
      console.debug(`[DEBUG] ${message}`, ...meta);
    }
  }
}

export const logger: Logger = new ConsoleLogger();
