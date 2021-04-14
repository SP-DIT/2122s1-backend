const cors = require('cors');

const statsManager = require('./managers/stats_manager');
const queueRoute = require('./routes/queue_route');
const statsRoute = require('./routes/stats_route');

const { app } = require('./app');
const { ERROR_CODE, ...errors } = require('./errors');

// CORS
app.use(cors());

app.use('/queue', queueRoute);
app.use('/stats', statsRoute);

// 404
app.use((req, res, next) => next(new errors.UrlNotFoundError(`${req.method} ${req.originalUrl} Not Found`)));

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    // Console.error for quick debugging using console
    console.error(error); // eslint-disable-line no-console

    // Extract information
    let status = 500;
    let code = ERROR_CODE.UNEXPECTED_ERROR;
    let message = 'Unexpected Error!';
    const reason = error.message;

    // Special case of errors
    if (error instanceof errors.InvalidDurationError) {
        status = 400;
        code = ERROR_CODE.INVALID_QUERY_PARAMETER;
        message = `❌ Invalid query parameter "duration" (${req.query.duration})`;
    } else if (error instanceof errors.InvalidFromError) {
        status = 400;
        code = ERROR_CODE.INVALID_QUERY_PARAMETER;
        message = `❌ Invalid query parameter "from" (${req.query.from})`;
    } else if (error instanceof errors.UrlNotFoundError) {
        status = 404;
        code = ERROR_CODE.URL_NOT_FOUND;
        message = `Resource not found`;
    }

    const payload = { code, error: message, reason };

    // Log and respond accordingly.
    statsManager.logErrors(status, payload).finally(() => res.status(status).json(payload));
});

module.exports = app;
