/********************************************************************
Title : FriendRequestRefuse
Date : 2016.07.27
Update : 
Desc : 친구 요청 거절
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
	inst.ReqFriendRequestRefuse = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendRequestRefuse -', p_user.uuid, p_recv);

		var sequelize = mkDB.inst.GetSequelize();
		var refuse_uuid = parseInt(p_recv.refuse_uuid);

		if ( p_user.uuid == refuse_uuid || refuse_uuid == null || refuse_uuid == NaN) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectTargetUser(), 'Refuse UUID', refuse_uuid);
			return;
		}

		// GT_FRIEND_REQUEST select
		GTMgr.inst.GetGTFriendRequest().findAll({
			where : sequelize.or( sequelize.and({ UUID : refuse_uuid, REQUEST_UUID : p_user.uuid }), sequelize.and({ UUID : p_user.uuid, REQUEST_UUID : refuse_uuid }))
		})
		.then(function (p_ret_request_list) {
			// console.log('p_ret_request_list', p_ret_request_list);
			if ( p_ret_request_list == null || Object.keys(p_ret_request_list).length == 0 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectTargetUser(), 'Not Find User in GT_FRIEND_REQUEST Refuse UUID', refuse_uuid);
				return;
			}
			
			for ( var cnt in p_ret_request_list ) {
				(function (cnt) {
					// GT_FRIEND_REQUEST update
					p_ret_request_list[cnt].updateAttributes({
						UPDATE_DATE : Timer.inst.GetNowByStrDate(),
						EXIST_YN : false
					})
					.then(function (p_ret_request_update) {
						console.log('%d Request Refuse GT_FRIEND_REQUEST EXIST_YN :', cnt, p_ret_request_update.dataValues.EXIST_YN);
						var request_data = p_ret_request_update.dataValues;

						if ( request_data.REQUEST_UUID == p_user.uuid ) {
							p_ack_packet.refuse_uuid = request_data.UUID;

							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
						}
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestRefuse - 2');
					});
				})(cnt);
			}			
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendRequestRefuse - 1');
		});		
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;