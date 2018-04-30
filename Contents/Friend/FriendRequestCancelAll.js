/********************************************************************
Title : FriendRequestCancelAll
Date : 2016.08.04
Update : 
Desc : 친구 - 요청 전부 취소
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
	inst.ReqFriendRequestCancelAll = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendRequestCancelAll -', p_user.uuid, p_recv);

		// GT_FRIEND_REQUEST select - 자신을 친구 요청한 데이터
		GTMgr.inst.GetGTFriendRequest().findAndCountAll({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_request_list) {
			// console.log('p_ret_request_list', p_ret_request_list);
			if ( p_ret_request_list.count <= 0 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNoFriendRequest(), 'Not Find Request User in GT_FRIEND_REQUEST');
				return;
			}

			var str_now = Timer.inst.GetNowByStrDate();

			for ( var row in p_ret_request_list.rows ) {
				// GT_FRIEND_REQUEST update - 친구 요청자 처리
				p_ret_request_list.rows[row].updateAttributes({
					UPDATE_DATE : str_now,
					EXIST_YN : false
				})
				.then(function (p_ret_request_update) {
					var update_data = p_ret_request_update.dataValues;
					console.log('Request Cancel UUID : %d, REQUEST_UUID : %d, EXIST_YN :', update_data.UUID, update_data.REQUEST_UUID, update_data.EXIST_YN);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestCancelAll - 2');
				});

				// Packet
				p_ack_packet.cancel_uuid_list.push(p_ret_request_list.rows[row].dataValues.REQUEST_UUID);
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestCancelAll - 1');
		});		
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;