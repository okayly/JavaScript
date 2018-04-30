/********************************************************************
Title : BuyStamina
Date : 2016.01.15
Update : 2016.08.30
Desc : 스테미너 구매
writer: jongwook
********************************************************************/
var GTMgr	= require('../../DB/GTMgr.js');

var BaseVipRe		= require('../../Data/Base/BaseVipRe.js');
var BaseBuyStaminaRe= require('../../Data/Base/BaseBuyStaminaRe.js');

var DefineValues = require('../../Common/DefineValues.js');

var Timer	= require('../../Utils/Timer.js');
var Sender	= require('../../App/Sender.js');
var moment	= require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqBuyStamina = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqBuyStamina -', p_user.uuid, p_recv);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where: { UUID: p_user.uuid, EXIST_YN: true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			var vip_base = BaseVipRe.inst.GetVip(user_data.VIP_STEP);
			if ( vip_base == undefined ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Vip Info In Base Vip Step', user_data.VIP_STEP);
				return;
			}

			// GT_DAILY_CONTENTS select
			GTMgr.inst.GetGTDailyContents().find({
				where : { UUID : p_user.uuid, EXIST_YN : true }
			})
			.then(function (p_ret_daily) {
				if ( p_ret_daily == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User Daily In GT_DAILY_CONTENTS');
					return;
				}
				var daily_data = p_ret_daily.dataValues;

				if ( daily_data.BUY_STAMINA_COUNT >= vip_base.max_buy_stamina_count ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughBuyCount(), 'Buy Count', daily_data.BUY_STAMINA_COUNT, 'Max Count', vip_base.max_buy_stamina_count);
					return;
				}

				var ret_buy_count	= daily_data.BUY_STAMINA_COUNT + 1;
				var buy_stamina_base= BaseBuyStaminaRe.inst.GetBuyStamina(ret_buy_count);
				if ( typeof buy_stamina_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Buy Count', buy_stamina_count, 'Not Exist Buy Stamina Info In Base');
					return;
				}

				if ( user_data.CASH < buy_stamina_base.need_cash ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'Current Cash', user_data.CASH, 'Need Cash', buy_stamina_base.need_cash);
					return;
				}

				// GT_DAILY_CONTENTS update
				p_ret_daily.updateAttributes({
					BUY_STAMINA_COUNT : ret_buy_count
				})
				.then(function (p_ret_daily_update) {
					var ret_cash	= user_data.CASH - buy_stamina_base.need_cash;
					var ret_stamina	= user_data.STAMINA + buy_stamina_base.gain_stamina;

					var now_date = moment();
					var diff_sec = Timer.inst.GetDeltaTimeByBetweenDate(now_date, user_data.LAST_STAMINA_CHANGE_DATE);
					// Max 까지 남은 시간 계산.
					var ret_remain_time = Timer.inst.CalcRemainTime(DefineValues.inst.StaminaRecoverTime, ret_stamina, user_data.MAX_STAMINA, diff_sec);
					var last_stamina_change_date = ( ret_stamina < user_data.MAX_STAMINA ) ? now_date.format('YYYY-MM-DD HH:mm:ss') : null;

					// GT_USER update
					p_ret_user.updateAttributes({
						CASH : ret_cash,
						STAMINA : ret_stamina,
						LAST_STAMINA_CHANGE_DATE : last_stamina_change_date
					})
					.then(function (p_ret_user_update) {
						p_ack_packet.cash				= p_ret_user_update.dataValues.CASH;
						p_ack_packet.stamina			= p_ret_user_update.dataValues.STAMINA;
						p_ack_packet.remain_time		= ret_remain_time;
						p_ack_packet.buy_stamina_count	= p_ret_daily_update.BUY_STAMINA_COUNT;

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyStamina - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyStamina - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyStamina - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyStamina - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;