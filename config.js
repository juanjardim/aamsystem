
var environment = process.env.NODE_ENV || 'development';
module.exports = {
    port: process.env.PORT || 8090,
    environment: environment,
    mongoURI: (environment == 'development') ? 'mongodb://localhost/ammSystem' : ''
};