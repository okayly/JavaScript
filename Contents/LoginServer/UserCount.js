/********************************************************************
Title : UserCount
Date : 2016.08.29
Desc : 서버 유저 수
writer: jongwook
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqUserCount = function(p_socket, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('recv - ReqUserCount', p_recv, p_socket.id);

		p_ack_packet.url = p_socket.handshake.headers.host;
		p_ack_packet.user_count = UserMgr.inst.GetUserCount();
		p_ack_packet.socket_id = p_socket.id;

		Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;