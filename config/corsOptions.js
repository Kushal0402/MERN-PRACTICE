const origins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        if (origins.indexOf(origin) !== -1 || !origin) {
            callback(null,true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}

module.exports = corsOptions