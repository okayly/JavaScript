/********************************************************************
Title : FriendTakeStamina
Date : 2016.08.02
Update : 2017.03.28
Desc : 친구 - 스태미너 획득
       스태미너를 친구에게 받고 24시간 동안 획득 할 수 있다.
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');
var moment	= require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqFriendTakeStamina = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendTakeStamina -', p_user.uuid, p_recv);

		var friend_uuid = parseInt(p_recv.friend_uuid);
		if ( p_user.uuid == friend_uuid || friend_uuid == null || isNaN(friend_uuid) ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectTargetUser(), 'Friend UUID', friend_uuid);
			return;
		}
		// GT_FRIEND select - 친구인지 확인
		GTMgr.inst.GetGTFriend().find({
			where : { UUID : p_user.uuid, FRIEND_UUID : friend_uuid, EXIST_YN : true }
		})
		.then(function (p_ret_friend) {
			if ( p_ret_friend == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Friend UUID', friend_uuid);
				return;
			}
			var friend_data = p_ret_friend.dataValues;

			var now = moment();

			// 24시간이 지난건 못받는다.
			var diff_hour = now.diff(moment(friend_data.RECV_STAMINA_DATE), 'hours');
			if ( diff_hour > DefineValues.inst.OneDayHours ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistTakeStaminaTimeOver(), 'Diff Hours', diff_hour);
				return;
			}

			if ( friend_data.IS_TAKE_STAMINA == true ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyTakeStamina(), 'Diff Hours', diff_hour, 'Is Recv Stamina', friend_data.IS_TAKE_STAMINA);
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

				var str_now	= Timer.inst.GetNowByStrDate();

				// GT_FRIEND update
				p_ret_friend.updateAttributes({
					IS_TAKE_STAMINA : true,
					UPDATE_DATE : str_now
				})
				.then(function (p_ret_friend_update) {
					// GT_USER update
					p_ret_user.updateAttributes({
						STAMINA : user_data.STAMINA + DefineValues.inst.FriendTakeStamina,
						LAST_CHANGE_STAMINA_DATE : str_now
					})
					.then(function (p_ret_user_update) {
						var user_data_update = p_ret_user_update.dataValues;

						p_ack_packet.friend_uuid		= friend_uuid;
						p_ack_packet.stamina			= user_data_update.STAMINA;
						p_ack_packet.remain_stamina_time= Timer.inst.GetStaminaFullRemainTime(now, user_data_update.STAMINA, user_data_update.MAX_STAMINA, user_data_update.LAST_CHANGE_STAMINA_DATE, DefineValues.inst.StaminaRecoverTime);

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendTakeStamina - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendTakeStamina - 3');
				});				
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendTakeStamina - 2');
			});
		})			
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendTakeStamina - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;