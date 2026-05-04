export class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    // Log error for the developer
    console.error('❌ Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    // Handle Prisma Specific Errors
    if (err.code === 'P2002') {
        return res.status(400).json({
            error: 'Duplicate field value entered',
            message: `A record with this ${err.meta?.target} already exists.`
        });
    }
    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Not Found',
            message: 'The requested record does not exist.'
        });
    }
    // Send friendly response to the client
    res.status(err.statusCode).json({
        status: err.statusCode < 500 ? 'fail' : 'error',
        message: err.message || 'Internal server error'
    });
};
// Wrapper to catch errors in async routes automatically
export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
