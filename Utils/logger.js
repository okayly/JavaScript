var winston = require('winston');
var moment = require('moment');

var logger = new winston.Logger({
	transports: [
		new winston.transports.Console({
			level: 'debug',
			timestamp: function () {
				return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
			},
			colorize: true
		}),
		new winston.transports.DailyRotateFile({
			level: 'debug',
			handleExceptions: true,
			timestamp: function () {
				return moment().format("YYYY-MM-DD HH:mm:ss");
			},
			filename: './logs/log',
			datePattern: '.yyyy-MM-dd.log',   // app-debug.yyyy-MM-dd.log 파일로 저장됨
			json: false,
			maxsize: 1024 * 1024 * 100, // 100mb
			maxFiles: 10
		})
	]
});


module.exports = logger;