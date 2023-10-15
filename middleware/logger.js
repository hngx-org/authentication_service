const log4js = require('log4js');

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: 'logs/debug.log',
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
    },
    console: {
      type: 'console',
    },
  },
  categories: {
    default: {
      appenders: ['file', 'console'],
      level: 'debug',
    },
  },
});
const logger = log4js.getLogger();

module.exports = logger;
