
var environment = process.env.NODE_ENV || 'development';
var mongoURI = '';
switch (environment){
    case 'testing':
        mongoURI = 'mongodb://localhost/ammSystemTest';
        break;
    case 'development':
        mongoURI = 'mongodb://localhost/ammSystemDev';
        break;
    default:
        mongoURI = '';
        break;
}
module.exports = {
    port: process.env.PORT || 8090,
    environment: environment,
    mongoURI: mongoURI
};