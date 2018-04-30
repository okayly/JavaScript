/********************************************************************
Title : DuckStamina
Date : 2016.05.30
Update : 2017.04.18
Desc : 테스트 패킷을 관리 - 스테미너
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');
var moment = require('moment');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 스테미너
	inst.ReqStamina = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet)  {
		logger.debug('UUID : %d, recv - ReqStamina -', p_uuid, p_recv);

		let recv_stamina = parseInt(p_recv.stamina);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where: { UUID: p_uuid, EXIST_YN: true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
				return;
			}
			let user_data = p_ret_user.dataValues;
			let now_date = moment();

			let ret_remain_time = Timer.inst.GetStaminaFullRemainTime(recv_stamina, user_data.MAX_STAMINA, user_data.LAST_STAMINA_CHANGE_DATE, DefineValues.inst.StaminaRecoverTime);
			let last_stamina_change_date = ( recv_stamina < user_data.MAX_STAMINA ) ? now_date.format('YYYY-MM-DD HH:mm:ss') : null;

			// GT_USER update
			p_ret_user.updateAttributes({
				STAMINA : recv_stamina,
				LAST_STAMINA_CHANGE_DATE : last_stamina_change_date
			})
			.then(function (p_ret_user_update) {
				p_ack_packet.stamina = p_ret_user_update.dataValues.STAMINA;
				p_ack_packet.stamina_remain_time = ret_remain_time;

				p_evt_packet.stamina = p_ret_user_update.dataValues.STAMINA;;
				p_evt_packet.stamina_remain_time = ret_remain_time;

				Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
			})
			.catch(function (p_error) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqStamina - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqStamina - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;