const log4js = require('log4js');

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'application.log' },
  },
  categories: {
    default: { appenders: ['out'], level: 'trace' },
    app: { appenders: ['app'], level: 'trace' },
  },
});

const logger = log4js.getLogger();
const logToFile = log4js.getLogger('app');

module.exports = logger;
module.exports.logToFile = logToFile;
