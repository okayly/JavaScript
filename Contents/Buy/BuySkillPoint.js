/********************************************************************
Title : BuySkillPoint
Date : 2016.01.23
Update : 2016.07.19
Desc : 스킬포인트 구매
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues= require('../../Common/DefineValues.js');
var BaseVipRe	= require('../../Data/Base/BaseVipRe.js');

var Timer	= require('../../Utils/Timer.js');
var Sender	= require('../../App/Sender.js');
var moment	= require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqBuySkillPoint = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqBuySkillPoint -', p_user.uuid, p_recv);

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

			// 1. 재화 검사. 
			if ( user_data.CASH < DefineValues.inst.SkillPointChargeCash ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'Current Cash', p_ret_user.dataValues.CASH, 'Need Cash', DefineValues.inst.SkillPointChargeCash);
				return;
			}

			var base_vip = BaseVipRe.inst.GetVip(user_data.VIP_STEP);
			if ( base_vip == undefined ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Vip Info In Base');
				return;
			}

			// GT_DAILY_CONTENTS select
			GTMgr.inst.GetGTDailyContents().find({
				where : { UUID : p_user.uuid }
			})
			.then(function (p_ret_daily) {
				if ( p_ret_daily == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In Daily Table');
					return;
				}

				var daily_data = p_ret_daily.dataValues;
				if ( daily_data.BUY_SKILL_POINT_COUNT >= base_vip.skill_point_charge_count ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughBuyCount(), 'Current Count', daily_data.BUY_SKILL_POINT_COUNT, 'Max Count', base_vip.skill_point_charge_count);
					return;
				}

				var ret_skill_point	= user_data.SKILL_POINT + DefineValues.inst.SkillPointChargeAmount;
				var ret_cash		= user_data.CASH - DefineValues.inst.SkillPointChargeCash;
				var ret_count		= daily_data.BUY_SKILL_POINT_COUNT + 1;

				// GT_DAILY_CONTENTS update
				p_ret_daily.updateAttributes({
					BUY_SKILL_POINT_COUNT : ret_count
				})
				.then(function (p_ret_daily_update) {
					// GT_USER update
					p_ret_user.updateAttributes({
						CASH : ret_cash,
						SKILL_POINT : ret_skill_point,
						LAST_SKILL_POINT_CHANGE_DATE : null
					})
					.then(function (p_ret_user_update) {
						p_ack_packet.skill_point			= p_ret_user_update.dataValues.SKILL_POINT;
						p_ack_packet.cash					= p_ret_user_update.dataValues.CASH;
						p_ack_packet.remain_time			= 0;
						p_ack_packet.buy_skill_point_count	= p_ret_daily_update.dataValues.BUY_SKILL_POINT_COUNT;

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuySkillPoint - 4');
					})
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuySkillPoint - 3');
				})
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuySkillPoint - 2');
			})
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuySkillPoint - 1');
		});
	}

	exports.inst = inst;

})(exports || global);
(exports || global).inst;