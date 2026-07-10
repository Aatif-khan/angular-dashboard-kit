/**
 * Standard Console implementation of the Logger interface.
 */
class ConsoleLogger {
    info(message, ...meta) {
        console.info(`[INFO] ${message}`, ...meta);
    }
    warn(message, ...meta) {
        console.warn(`[WARN] ${message}`, ...meta);
    }
    error(message, ...meta) {
        console.error(`[ERROR] ${message}`, ...meta);
    }
    debug(message, ...meta) {
        // Suppress debug message outputs in production environments
        if (process.env['NODE_ENV'] !== 'production') {
            console.debug(`[DEBUG] ${message}`, ...meta);
        }
    }
}
export const logger = new ConsoleLogger();
