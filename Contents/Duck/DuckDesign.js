/********************************************************************
Title : DuckDesign
Date : 2016.05.23
Update : 2016.08.22
Desc : 테스트 패킷을 관리
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var Sender = require('../../App/Sender.js');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 계정 확인
	inst.ReqConfirmAccount = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqConfirmAccount -', p_uuid, p_recv);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where: { ACCOUNT : p_recv.account, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			p_ack_packet.uuid = p_ret_user.dataValues.UUID;

			Sender.inst.toDuck(p_socket, 0, p_ack_cmd, p_ack_packet, null, null);
		})
		.catch(function (p_error) {
			logger.error("Error ReqConfirmAccount", p_error);
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;