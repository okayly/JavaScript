/********************************************************************
Title : FriendSendStamina
Date : 2016.08.02
Update : 2017.03.28
Desc : 친구 - 스태미너 보내기
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketNotice = require('../../Packets/PacketNotice/PacketNotice.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');
var moment	= require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqFriendSendStamina = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendSendStamina -', p_user.uuid, p_recv);

		var friend_uuid = parseInt(p_recv.friend_uuid);
		if ( p_user.uuid == friend_uuid || friend_uuid == null || isNaN(friend_uuid) ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectTargetUser(), 'Friend UUID', friend_uuid);
			return;
		}

		// GT_USER select - 스태미너 받아야 한다.
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues

			// GT_FRIEND select - 1. 자신의 SEND_STAMINA_DATE 설정
			GTMgr.inst.GetGTFriend().find({
				where : { UUID : p_user.uuid, FRIEND_UUID : friend_uuid, EXIST_YN : true }
			})
			.then(function (p_ret_friend_my) {
				if ( p_ret_friend_my == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Friend in GT_FRIEND Friend UUID', friend_uuid);
					return;
				}
				var my_data = p_ret_friend_my.dataValues;

				var now		= moment();
				var str_now	= now.format('YYYY-MM-DD HH:mm:ss');

				// SEND_STAMINA_DATE가 null 이거나 24시간이 지나야 보낼 수 있다.
				var diff_hour = now.diff(moment(my_data.SEND_STAMINA_DATE), 'hours');
				if ( diff_hour < DefineValues.inst.OneDayHours ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughOneDayHours(), 'Diff Hours', diff_hour);
					return;
				}

				// GT_USER update
				p_ret_user.updateAttributes({
					STAMINA : user_data.STAMINA + DefineValues.inst.FriendBonusStamina,
					LAST_STAMINA_CHANGE_DATE : str_now
				})
				.then(function (p_ret_user_update) {
					var user_update_data = p_ret_user_update.dataValues;

					p_ack_packet.friend_uuid		= my_data.FRIEND_UUID;
					p_ack_packet.stamina			= user_update_data.STAMINA;
					p_ack_packet.stamina_remain_time= Timer.inst.GetStaminaFullRemainTime(user_update_data.STAMINA, user_update_data.MAX_STAMINA, user_update_data.LAST_STAMINA_CHANGE_DATE, DefineValues.inst.StaminaRecoverTime);

					// GT_FRIEND update
					p_ret_friend_my.updateAttributes({
						SEND_STAMINA_DATE : str_now
					})
					.then(function (p_ret_my_update) {

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

						// 친구 스태미너 설정
						RecvStaminaProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, friend_uuid, str_now);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendSendStamina - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendSendStamina - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendSendStamina - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendSendStamina - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var RecvStaminaProcess = function(p_user, p_recv, p_ack_cmd, p_ack_packet, p_friend_uuid, p_str_now) {
		// GT_FRIEND select - 2. 친구의 RECV_STAMINA_DATE 설정
		GTMgr.inst.GetGTFriend().find({
			where : { UUID : p_friend_uuid, FRIEND_UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_friend) {
			// GT_FRIEND update
			p_ret_friend.updateAttributes({
				RECV_STAMINA_DATE	: p_str_now,
				IS_TAKE_STAMINA		: false,
				UPDATE_DATE			: p_str_now,				
			})
			.then(function (p_ret_friend_update) {
				var evt_cmd		= PacketNotice.inst.cmdEvtFriendRecvStamina();
				var evt_packet	= PacketNotice.inst.GetPakcetEvtFriendRecvStamina();

				evt_packet.friend_uuid				= p_user.uuid;
				evt_packet.recv_stamina_unix_time	= Timer.inst.GetUnixTime(p_ret_friend_update.dataValues.RECV_STAMINA_DATE);

				Sender.inst.toTargetPeer(p_friend_uuid, evt_cmd, evt_packet);
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error RecvStaminaProcess - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error RecvStaminaProcess - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;