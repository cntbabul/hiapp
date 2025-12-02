class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
export default ErrorHandler;

export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === "JsonWebTokenError") {
        const message = `JsonWebTokenError: Invalid Token`;
        err = new ErrorHandler(message, 400);   
    }

    if (err.name === "TokenExpiredError") {
        const message = `TokenExpiredError: Token Expired`;
        err = new ErrorHandler(message, 400);   
    }

    if (err.name === "ValidationError") {
        const message = `ValidationError: ${err.message}`;
        err = new ErrorHandler(message, 400);   
    }   

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};