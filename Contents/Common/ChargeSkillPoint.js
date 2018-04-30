/********************************************************************
Title : ChargeSkillPoint
Date : 2016.02.02
Update : 2016.07.19
Desc : 스킬 포인트 충전
	   시간이 경과 해서 충전 포인트가 생겼을때 LAST_SKILL_POINT_CHANGE_DATE를 update 한다.
	   (매번 update 하면 비교해야할 기준 시간이 초기화 되어 버린다)
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var BaseVipRe = require('../../Data/Base/BaseVipRe.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');
var moment	= require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqChargeSkillPoint = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqChargeSkillPoint -', p_user.uuid, p_recv);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			var now_date		= moment();
			var ret_point		= 0;
			var ret_remain_time	= 0;
			// console.log('START skill_point: %d, now: %s, this.last_change_skill_point_date: %s', user_data.SKILL_POINT, now_date.format('YYYY-MM-DD HH:mm:ss'), moment(user_data.LAST_SKILL_POINT_CHANGE_DATE).format('YYYY-MM-DD HH:mm:ss'));

			// 스킬 포인트 변화가 없는 경우
			if ( user_data.SKILL_POINT >= user_data.MAX_SKILL_POINT ) {
				if (user_data.LAST_SKILL_POINT_CHANGE_DATE == null) {
					console.log('----- 1. 스킬포인트 변화 없음 -----');
					p_ack_packet.skill_point = user_data.SKILL_POINT;
					p_ack_packet.skill_point_remain_time = 0;

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					return;
				} else {
					console.log('----- 2. LAST_SKILL_POINT_CHANGE_DATE = null -----');
					p_ret_user['LAST_SKILL_POINT_CHANGE_DATE'] = null;
				}
			} else {
				// 시간 경과로 스킬 포인트가 증가 변경된 경우
				var vip_base = BaseVipRe.inst.GetVip(user_data.VIP_STEP);
				if ( typeof vip_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Vip Info In Base');
					return;
				}

				var charge_time = vip_base.skill_point_charge_time;
				var diff_sec = (user_data.LAST_SKILL_POINT_CHANGE_DATE != null) ? Timer.inst.GetDeltaTimeByBetweenDate(now_date, user_data.LAST_SKILL_POINT_CHANGE_DATE) : 0;
				// 1-1. 경과 시간에 따른 충전량 계산.
				var add_point = (diff_sec != 0) ? Math.floor(diff_sec / charge_time) : 0;
				// 1-2. 현재 값에 합산.
				ret_point = user_data.SKILL_POINT + add_point;
				// 보유 스킬 포인트는 최대 스킬포인트를 넘을 수 없다.
				if ( ret_point > user_data.MAX_SKILL_POINT ) {
					ret_point = user_data.MAX_SKILL_POINT;
				}

				// 스킬 포인트가 FULL 까지 남은 시간
				ret_remain_time = Timer.inst.CalcRemainTime(charge_time, ret_point, user_data.MAX_SKILL_POINT, diff_sec);
				// console.log('diff_sec : %d, add_point : %d, ret_point : %d, ret_remain_time : %d', diff_sec, add_point, ret_point, ret_remain_time);

				// 증가 스킬 포인트가 없으면 남은 시간만 리턴
				if ( add_point == 0 && user_data.LAST_SKILL_POINT_CHANGE_DATE != null ) {
					console.log('----- 3. 스킬포인트 남은 시간만 리턴 -----');
					p_ack_packet.skill_point			= user_data.SKILL_POINT;
					p_ack_packet.skill_point_remain_time= ret_remain_time;

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					return;
				}

				// 스킬 포인트가 증가하면 변경된 시간 update
				console.log('----- 4. 스킬포인트 변화 + LAST_SKILL_POINT_CHANGE_DATE = now() -----');
				p_ret_user['SKILL_POINT']					= ret_point;
				p_ret_user['LAST_SKILL_POINT_CHANGE_DATE']	= (add_point >= user_data.MAX_SKILL_POINT) ? null : now_date.format("YYYY-MM-DD HH:mm:ss");
			}

			// GT_USER update
			p_ret_user.save()
			.then(function (p_ret_user_update) {
				// console.log('p_ret_user_update', p_ret_user_update.dataValues);
				p_ack_packet.skill_point			= p_ret_user_update.dataValues.SKILL_POINT;
				p_ack_packet.skill_point_remain_time= ret_remain_time;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqChargeSkillPoint - 2');
			});			
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqChargeSkillPoint - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;