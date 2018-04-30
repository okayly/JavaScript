/********************************************************************
Title : Version
Date : 2016.05.25
Desc : 버전 관리
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');
var Sender = require('../../App/Sender.js');

(function (exports) {
	// private
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqVersion = function (p_socket, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('recv - ReqVersion', p_recv);

		// GT_VERSION
		GTMgr.inst.GetGTVersion().find({})
		.then(function (p_ret_version) {
			// console.log('p_ret_version', p_ret_version);
			if ( p_ret_version == null ) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Error ReqVersion - 2');
				return;
			}

			p_ack_packet.result			= PacketRet.inst.retSuccess();
			p_ack_packet.app_version	= p_ret_version.dataValues.APP_VERSION;
			p_ack_packet.data_version	= p_ret_version.dataValues.DATA_VERSION;
			
			p_socket.emit(p_ack_cmd, JSON.stringify(p_ack_packet));
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqVersion - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;