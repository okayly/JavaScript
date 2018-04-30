/********************************************************************
Title : BuyGold
Date : 2016.01.14
Update : 2017.03.15
Desc : 골드 구매
writer: jongwook
********************************************************************/
var GTMgr		= require('../../DB/GTMgr.js');

var BaseVipRe		= require('../../Data/Base/BaseVipRe.js');
var BaseBuyGoldRe	= require('../../Data/Base/BaseBuyGoldRe.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqBuyGold = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqBuyGold -', p_user.uuid, p_recv);

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

				var base_vip = BaseVipRe.inst.GetVip(user_data.VIP_STEP);
				if ( typeof base_vip === 'undefined' ) {
					Sender.inst.toPeer(user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Vip Info in Base');
					return;
				}

				// 최대 구매 가능 확인. 
				if ( daily_data.BUY_GOLD_COUNT >= base_vip.max_buy_gold_count ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughBuyCount(), 'User Count', daily_data.BUY_GOLD_COUNT, 'Max Count', base_vip.max_buy_gold_count);
					return;
				}

				// 캐쉬 확인. 
				var ret_buy_count = daily_data.BUY_GOLD_COUNT + 1;
				var buy_gold_base = BaseBuyGoldRe.inst.GetBuyGold(ret_buy_count);
				if ( typeof buy_gold_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Buy Gold Info In Base');
					return;
				}

				if ( user_data.CASH < buy_gold_base.need_cash ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'Current Cash', user_data.CASH, 'Need Cash', buy_gold_base.need_cash);
					return;
				}

				// 획득. (+겜블)
				var ret_multiple= buy_gold_base.GetGoldGamble();
				var ret_cash	= user_data.CASH - buy_gold_base.need_cash;
				var ret_gold	= user_data.GOLD + (buy_gold_base.gain_gold * ret_multiple)

				// GT_USER update
				p_ret_user.updateAttributes({
					GOLD : ret_gold,
					CASH : ret_cash
				})
				.then(function (p_ret_user_update) {
					// GT_DAILY_CONTENTS update
					p_ret_daily.updateAttributes({
						BUY_GOLD_COUNT : ret_buy_count
					})
					.then(function (p_ret_daily_update) {
						p_ack_packet.gold				= ret_gold;
						p_ack_packet.cash				= ret_cash;
						p_ack_packet.gain_gold			= buy_gold_base.gain_gold * ret_multiple;
						p_ack_packet.gamble_multiple	= ret_multiple;
						p_ack_packet.buy_gold_count		= ret_buy_count;

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyGold - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyGold - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyGold - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyGold - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;