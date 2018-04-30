/********************************************************************
Title : FriendRequestCancel
Date : 2016.08.03
Update : 
Desc : 친구 - 요청 취소
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var PacketNotice = require('../../Packets/PacketNotice/PacketNotice.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------	
	inst.ReqFriendRequestCancel = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendRequestCancel -', p_user.uuid, p_recv);

		var sequelize = mkDB.inst.GetSequelize();
		var cancel_uuid = parseInt(p_recv.cancel_uuid);

		if ( p_user.uuid == cancel_uuid || cancel_uuid == null || cancel_uuid == NaN ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectTargetUser(), 'Accept UUID', cancel_uuid);
			return;
		}

		// GT_FRIEND_REQUEST select - 자신을 친구 요청한 데이터
		GTMgr.inst.GetGTFriendRequest().find({
			where : { UUID : p_user.uuid, REQUEST_UUID : cancel_uuid, EXIST_YN : true }
		})
		.then(function (p_ret_request) {
			// console.log('p_ret_request', p_ret_request);
			if ( p_ret_request == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectTargetUser(), 'Not Find User in GT_FRIEND_REQUEST Request UUID', cancel_uuid);
				return;
			}

			// GT_FRIEND_REQUEST update - 친구 요청자 처리
			p_ret_request.updateAttributes({
				UPDATE_DATE : Timer.inst.GetNowByStrDate(),
				EXIST_YN : false
			})
			.then(function (p_ret_request_update) {
				p_ack_packet.cancel_uuid = p_ret_request.dataValues.REQUEST_UUID;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestCancel - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestCancel - 1');
		});		
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;