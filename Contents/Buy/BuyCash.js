/********************************************************************
Title : 캐쉬 구매
Date : 2016.01.15
Update : 2016.07.19
Desc : 누적 캐쉬 양에 의해서 VIP 등급 변경
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var BaseBuyCashRe = require('../../Data/Base/BaseBuyCashRe.js');
var BaseVipRe = require('../../Data/Base/BaseVipRe.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqBuyCash = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqBuyCash -', p_user.uuid, p_recv);

		var cash_id = parseInt(p_recv.cash_id);

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

			var base_buy_cash = BaseBuyCashRe.inst.GetBuyCash(cash_id);
			if ( typeof base_buy_cash === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'CashID', cash_id, 'Not Exist Buy Cash Info In Base');
				return;
			}

			var ret_cash		= user_data.CASH + base_buy_cash.gain_cash;
			var ret_accum_cash	= user_data.ACCUM_BUY_CASH + base_buy_cash.gain_cash;

			var target_base_vip	= BaseVipRe.inst.GetVipFromAccumCash(ret_accum_cash);
			if ( typeof target_base_vip === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Vip Base Info');
				return;
			}

			var ret_vip_step = user_data.VIP_STEP;
			if ( target_base_vip.vip_step != user_data.VIP_STEP )  {
				ret_vip_step = target_base_vip.vip_step;
			}

			// GT_USER update
			p_ret_user.updateAttributes({
				CASH : ret_cash,
				VIP_STEP : ret_vip_step,
				ACCUM_BUY_CASH : ret_accum_cash
			})
			.then(function (p_ret_user_update) {
				p_ack_packet.cash			= ret_cash;
				p_ack_packet.vip_step		= ret_vip_step;
				p_ack_packet.accum_buy_cash	= ret_accum_cash;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyCash - 2');
			})
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyCash - 1');
		})
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;