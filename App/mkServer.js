/********************************************************************
Title : mkServer 
Date : 2015.09.24
Update : 2016.11.21
Desc : Node.js + Socket.IO 를 이용한 서버 구성
writer: dongsu
********************************************************************/
var express = require('express');
var process = require('process');
var http = require('http');

var Recv = require('./Recv.js');

var UserMgr = require('../Data/Game/UserMgr.js');

(function (exports) {	
	// private member
	var app = express;
	var io;

	// public member
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.run = function() {
		var port = 2542;
		var httpServer = http.createServer(app).listen(port, function (req, res) {
		    logger.debug('Starting Game Server ...');
		    if ( process.pid ) {
		    	logger.debug('@@@@@@@@ This Game Server PID is ' + process.pid + ' @@@@@@@@');
		    }
		});
		
		io = require('socket.io').listen(httpServer);

		// for handshake 
		io.use(function (socket, next) {
			var handshake_data = socket.request;
			next();
		});
		 
		// main logic
		// io.set('close timeout', 1200);
		// io.set('hearbeat interval', 600);
		// io.set('hearbeat timeout', 600);
		io.sockets.setMaxListeners(1000);

		io.sockets.on('connection', function (socket) {
			// console.log('socket', socket);
			// console.log('socket.handshake', socket.handshake.headers);
			// console.log('Connect Type', socket.handshake.query.connect_type);
			// console.log('io.engine', io.engine);
			// console.log('io.engine.clientsCount', io.engine.clientsCount);

			// 유저 접속
			if ( typeof socket.handshake.query.connect_type === 'undefined' ) {
				logger.info('☆ connected client from socket.id is', socket.id, 'IP :', socket.handshake.address, '☆');

				// disconnect
				socket.on('disconnect', function (p_data) {
					try {
						// logger.info('disconnect - Socket ID : ' + socket.id + ' 원인 : ' + p_data + ' 연결 종료.');
						UserMgr.inst.DelUser(socket.id, socket.request.connection.remoteAddress, p_data);
					} catch (p_error) {
						err_report.inst.SendReport(p_error.stack);
					}
				});

				Recv.inst.Distribute(socket);
				UserMgr.inst.ProcessClearLogoutUser();
			} else {
				logger.info('☆☆ connected login server from socket.id is', socket.id, 'IP :', socket.handshake.address, '☆☆');

				Recv.inst.LoginDistribute(socket);
			}
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
