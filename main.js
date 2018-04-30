/********************************************************************
Title : main
Date : 2015.09.14
Update : 2017.04.07
Desc : mobile kuf server
writer: dongsu
********************************************************************/
global.HashMap		= require('hashmap');
global.logger		= require('./Utils/logger.js');
global.err_handler	= require('domain').create();
global.err_report	= require('./Utils/ErrorReport.js');

//------------------------------------------------------------------------------------------------------------------
err_handler.on('error', function(p_error) {
	console.log('err_handler');
	
	logger.error('err_handler - ', p_error.stack);
  	// err_report.inst.SendReport(err.stack);
});

global.Rand = require('./Utils/Random.js');
// var redis_module = require('redis');
// redis = redis_module.createClient(6379, '127.0.0.1'); // 기본 포트 6379
// redis = redis_module.createClient(6379, '192.168.0.141'); // 기본 포트 6379

//------------------------------------------------------------------------------------------------------------------
var mkServer	= require('./App/mkServer.js');
var mkDB		= require('./DB/mkDB.js');
var Packet		= require('./Packets/Packet.js');

var fs = require('fs');

//------------------------------------------------------------------------------------------------------------------
process.on('uncaughtException', function (p_error) {
	console.log('Caught exception: %s', p_error.stack);
});

//------------------------------------------------------------------------------------------------------------------
// load

Packet.inst.InitPacket();

//------------------------------------------------------------------------------------------------------------------
fs.readFile('config.json', 'utf8', err_handler.bind(function (p_error, data) {
	if (p_error)
		throw p_error;

	var config = JSON.parse(data);
	// console.log('config:', config);
	logger.debug('============================ DB Connection info ============================');
	logger.debug('DB: ' + config.DB.DBName);
	logger.debug('Acc: ' + config.DB.DBAcc);
	logger.debug('PW: ' + config.DB.DBPw);
	logger.debug('IP: ' + config.DB.DBIP);
	logger.debug('PORT: ' + config.DB.DBPort);

	// set DB connect
	mkDB.inst.InitMkDB(config.DB);
}));

//------------------------------------------------------------------------------------------------------------------
err_handler.run( function() {
	// start server 
	mkServer.inst.run();
});