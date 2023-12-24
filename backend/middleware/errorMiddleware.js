const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.OriginalUrl}`);
    res.status(404);
    next(error);
}

const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        status: statusCode,
        message: error.message
    })
}

export { notFound, errorHandler };