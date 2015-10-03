
var environment = process.env.NODE_ENV || 'development';
var mongoURI = '';
var port = '3030';
switch (environment){
    case 'testing':
        mongoURI = 'mongodb://localhost/ammSystemTest';
        port = '3030';
        break;
    case 'development':
        mongoURI = 'mongodb://localhost/ammSystemDev';
        port = process.env.PORT || 8090;
        break;
    default:
        mongoURI = '';
        port = process.env.PORT || 8090;
        break;
}
module.exports = {
    port: port,
    environment: environment,
    mongoURI: mongoURI,
    jwtTokenSecret: 'LeAmmS4cre5Str',
    jwtExpiration: 1, //days
    jwtAlgorithm: 'RS256'
};