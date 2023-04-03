export default () => ({
  title: 'Gallery App',
  description: 'Gallery App Description',
  version: '1.0',

  host: 'http://localhost',
  port: parseInt(process.env.PORT, 10) || 3001,

  mongoDbConnectionStringUri: 'mongodb://localhost:27017/talk-bird',

  jwtSecret: 'hello_JWT_SECRET',
  expiresIn: '1h',
  waterMarkImageName: 'nodejs-logo.png',
});
