/********************************************************************
Title : FriendTakeStaminaAll
Date : 2016.08.04
Update : 
Desc : 친구 - 스태미너 전부 획득
       스태미너를 친구에게 받고 24시간 동안 획득 할 수 있다.
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender	= require('../../App/Sender.js');
var moment	= require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqFriendTakeStaminaAll = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendTakeStaminaAll -', p_user.uuid, p_recv);

		// GT_USER select - 스태미너 받아야 한다.
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistUser(), 'Not Find User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues
			var limit_time= DefineValues.inst.OneDayHours;
		
			// GT_FRIEND select - 친구인지 확인
			GTMgr.inst.GetGTFriend().findAndCountAll({
				where : { UUID : p_user.uuid,
				     RECV_STAMINA_DATE : { gte : moment().subtract(limit_time, 'hours').format('YYYY-MM-DD HH:mm:ss') },
				     IS_TAKE_STAMINA : false,
				     EXIST_YN : true }
			})
			.then(function (p_ret_friend_list) {
				// console.log('p_ret_friend_list', p_ret_friend_list);
				if ( p_ret_friend_list.count <= 0 ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistUser(), 'Friend Count', p_ret_friend_list.count);
					return;
				}

				var now			= moment();
				var str_now		= now.format('YYYY-MM-DD HH:mm:ss');
				var ret_stamina	= user_data.STAMINA + (p_ret_friend_list.count * DefineValues.inst.FriendTakeStamina);

				// 스태미너 벋움 처리
				for ( var row in p_ret_friend_list.rows ) {
					p_ack_packet.friend_uuid_list.push(p_ret_friend_list.rows[row].dataValues.FRIEND_UUID);

					// GT_FRIEND update
					p_ret_friend_list.rows[row].updateAttributes({
						IS_TAKE_STAMINA	: true,
						UPDATE_DATE		: str_now
					})
					.then(function (p_ret_friend_update) {
						var update_data = p_ret_friend_update.dataValues;
						console.log('UPDATE Recv Stamina All GT_FRIEND UUID : %d, FRIEND_UUID : %d, SEND_STAMINA_DATE :', update_data.UUID, update_data.FRIEND_UUID, moment(update_data.RECV_STAMINA_DATE).format('YYYY-MM-DD HH:mm:ss'));
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendTakeStaminaAll - 1');
					});
				}

				// GT_USER update
				p_ret_user.updateAttributes({
					STAMINA : ret_stamina,
					LAST_CHANGE_STAMINA_DATE : str_now
				})
				.then(function (p_ret_user_update) {
					var user_data_update = p_ret_user_update.dataValues;

					p_ack_packet.stamina = user_data_update.STAMINA;

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendTakeStaminaAll - 1');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendTakeStaminaAll - 2');
			});
		})			
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendTakeStaminaAll - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;