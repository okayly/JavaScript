/********************************************************************
Title : Vip
Date : 2016.04.27
Update : 2016.08.01
Desc : 유저 VIP 정보
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender = require('../../App/Sender.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqVip = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqVip -', p_user.uuid, p_recv);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			p_ack_packet.step			= user_data.VIP_STEP;
			p_ack_packet.accum_buy_cash	= user_data.ACCUM_BUY_CASH;

			// console.log('user_data.VIP_STEP_REWARD_LIST', user_data.VIP_STEP_REWARD_LIST, DefineValues.inst.MaxVipStep);

			// Vip 보상 bit 연산
			for ( var step = 0; step <= DefineValues.inst.MaxVipStep; ++step) {
				var shift_step = 1 << step;
				// console.log('step : %d, shift_step : %d', step, shift_step);

				if ( user_data.VIP_STEP_REWARD_LIST & shift_step ) {
					p_ack_packet.reward_steps.push(step);
				}
			}

			// GT_DAILY_CONTENTS select
			GTMgr.inst.GetGTDailyContents().find({
				where : { UUID : p_user.uuid, EXIST_YN : true }
			})
			.then(function (p_ret_daily) {
				if ( p_ret_daily == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User Daily in GT_DAILY_CONTENTS');
					return;
				}
				var daily_data = p_ret_daily.dataValues;

				p_ack_packet.buy_stamina_count		= daily_data.BUY_STAMINA_COUNT;
				p_ack_packet.buy_gold_count			= daily_data.BUY_GOLD_COUNT;
				p_ack_packet.buy_add_attend_count	= daily_data.BUY_ADD_ATTEND_COUNT;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqVip - 1');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqVip - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;

