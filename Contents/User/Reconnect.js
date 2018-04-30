/********************************************************************
Title : Reconnect
Date : 2016.07.14
Update : 2016.11.21
Desc : 서버 재연결
writer: dongsu
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqReconnect = function (p_socket, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %s, recv - ReqReconnect -', p_socket.id, p_recv);

		var target_uuid	= parseInt(p_recv.uuid);

		if ( UserMgr.inst.ProcessReconnect(target_uuid, p_socket) == true ) {
			p_ack_packet.result = PacketRet.inst.retSuccess();
			logger.info('UUID : %d, 재연결 성공.', target_uuid);
		} else {
			p_ack_packet.result = PacketRet.inst.retFail();
			logger.info('UUID : %d, 재연결 실패.', target_uuid);
		}

		p_socket.emit(p_ack_cmd, JSON.stringify(p_ack_packet));
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;