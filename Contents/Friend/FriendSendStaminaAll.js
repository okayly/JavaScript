/********************************************************************
Title : FriendSendStamina
Date : 2016.08.02
Update : 2017.03.28
Desc : 친구 - 스태미너 보내기
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
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
	inst.ReqFriendSendStaminaAll = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqFriendSendStaminaAll -', p_user.uuid, p_recv);

		var sequelize = mkDB.inst.GetSequelize();

		// GT_USER select - 스태미너 받아야 한다.
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistUser(), 'Not Find User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;
			var limit_time= DefineValues.inst.OneDayHours;

			// GT_FRIEND select - 1. 자신의 SEND_STAMINA_DATE 설정
			GTMgr.inst.GetGTFriend().findAndCountAll({
				where : sequelize.and( { UUID : p_user.uuid, EXIST_YN : true },
							sequelize.or(
								{ SEND_STAMINA_DATE : null },
								{ SEND_STAMINA_DATE : { lte : moment().subtract(limit_time, 'hours').format('YYYY-MM-DD HH:mm:ss') } }
							)
					   )
			})
			.then(function (p_ret_friend_list) {
				// console.log('p_ret_friend_list', p_ret_friend_list);
				if ( p_ret_friend_list.count <= 0 ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistUser(), 'Not Find Friend in GT_FRIEND');
					return;
				}

				var now			= moment();
				var str_now		= now.format('YYYY-MM-DD HH:mm:ss');
				var ret_stamina	= user_data.STAMINA + (p_ret_friend_list.count * DefineValues.inst.FriendBonusStamina);

				// GT_USER update
				p_ret_user.updateAttributes({
					STAMINA : ret_stamina,
					LAST_STAMINA_CHANGE_DATE : str_now
				})
				.then(function (p_ret_update_user) {
					var update_data = p_ret_update_user.dataValues;
					
					p_ack_packet.send_stamina_unix_time = Timer.inst.GetUnixTime(str_now);
					p_ack_packet.stamina				= update_data.STAMINA;
					p_ack_packet.stamina_remain_time	= Timer.inst.GetStaminaFullRemainTime(now, update_data.STAMINA, update_data.MAX_STAMINA, update_data.LAST_STAMINA_CHANGE_DATE, DefineValues.inst.StaminaRecoverTime);

					var friend_uuid_list = [];

					// GT_FRIEND update - 자신
					for ( var row in p_ret_friend_list.rows ) {
						friend_uuid_list.push(p_ret_friend_list.rows[row].dataValues.FRIEND_UUID);

						(function (row) {
							// GT_FRIEND update
							p_ret_friend_list.rows[row].updateAttributes({
								SEND_STAMINA_DATE : str_now
							})
							.then(function (p_ret_friend_update) {
								var update_data_my = p_ret_friend_update.dataValues;
								console.log('UPDATE Send Stamina All GT_FRIEND UUID : %d, FRIEND_UUID : %d, SEND_STAMINA_DATE :', update_data_my.UUID, update_data_my.FRIEND_UUID, moment(update_data_my.SEND_STAMINA_DATE).format('YYYY-MM-DD HH:mm:ss'));
							})
							.catch(function (p_error) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendSendStaminaAll - 4');
							});
						})(row);
					}
					
					p_ack_packet.friend_uuid_list = friend_uuid_list;
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

					// 친구들 스태미너 설정
					FriendStaminaProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, friend_uuid_list, str_now);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendSendStaminaAll - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendSendStaminaAll - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqFriendSendStaminaAll - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var FriendStaminaProcess = function(p_user, p_recv, p_ack_cmd, p_ack_packet, p_friend_uuid_list, p_str_now) {
		// GT_FRIEND select - 2. 친구의 RECV_STAMINA_DATE 설정
		GTMgr.inst.GetGTFriend().findAll({
			where : { UUID : { in : p_friend_uuid_list }, FRIEND_UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_friend_list_other) {
			// console.log('p_ret_friend_list_other', p_ret_friend_list_other);
			var evt_cmd		= PacketNotice.inst.cmdEvtFriendRecvStamina();
			var evt_packet	= PacketNotice.inst.GetPakcetEvtFriendRecvStamina();

			for ( var cnt in p_ret_friend_list_other ) {
				// GT_FRIEND update
				p_ret_friend_list_other[cnt].updateAttributes({
					RECV_STAMINA_DATE	: p_str_now,
					IS_TAKE_STAMINA		: false,
					UPDATE_DATE			: p_str_now,
				})
				.then(function (p_ret_friend_update_other) {
					var update_data_other = p_ret_friend_update_other.dataValues;
					// console.log('update_data_other', update_data_other);

					evt_packet.friend_uuid				= p_user.uuid;
					evt_packet.recv_stamina_unix_time	= Timer.inst.GetUnixTime(update_data_other.RECV_STAMINA_DATE);

					Sender.inst.toTargetPeer(update_data_other.UUID, evt_cmd, evt_packet);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error FriendStaminaProcess - 2');
				});
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error FriendStaminaProcess - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;