/********************************************************************
Title : ChargeStamina
Date : 2016.02.02
Update : 2016.07.19
Desc : 스테미너 충전
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
	inst.ReqChargeStamina = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqChargeStamina -',p_user.uuid, p_recv);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;
			
			// 0. now 고정. 
			var now_date		= moment();
			var ret_stamina		= 0;
			var ret_remain_time	= 0;

			// 스태미너 변화가 없는 경우
			if (user_data.STAMINA >= user_data.MAX_STAMINA ) {
				if ( user_data.LAST_STAMINA_CHANGE_DATE == null ) {
					console.log('----- 1. 스태미너 변화 없음 -----');
					p_ack_packet.stamina			= user_data.STAMINA;
					p_ack_packet.stamina_remain_time= 0;

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					return;
				} else {
					console.log('----- 2. LAST_STAMINA_CHANGE_DATE = null -----');
					p_ret_user['LAST_STAMINA_CHANGE_DATE'] = null;
				}
			} else {
				// 1. 경과 시간 계산. 
				var diff_sec = (user_data.LAST_STAMINA_CHANGE_DATE != null) ? Timer.inst.GetDeltaTimeByBetweenDate(now_date, user_data.LAST_STAMINA_CHANGE_DATE) : 0;
				// 1-1. 경과 시간에 따른 충전량 계산.
				// 1-2. 현재 값에 합산.
				var add_stamina	= (diff_sec != 0) ? Math.floor(diff_sec / DefineValues.inst.StaminaRecoverTime) : 0;
				ret_stamina	= user_data.STAMINA + add_stamina;
				if ( ret_stamina > user_data.MAX_STAMINA ) {
					ret_stamina = user_data.MAX_STAMINA;
				}

				// 2. Max 까지 남은 시간 계산.
				ret_remain_time = Timer.inst.CalcRemainTime(DefineValues.inst.StaminaRecoverTime, ret_stamina, user_data.MAX_STAMINA, diff_sec);

				// 증가 스태미너가 없으면 남은 시간만 리턴
				if ( add_stamina == 0 && user_data.LAST_STAMINA_CHANGE_DATE != null ) {
					console.log('----- 3. 스태미너 남은 시간만 리턴 -----');
					p_ack_packet.stamina			= user_data.STAMINA;
					p_ack_packet.stamina_remain_time= ret_remain_time;

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					return;
				}

				// 스태미너가 증가하면 변경된 시간 update
				console.log('----- 4. 스태미너 변화 + LAST_STAMINA_CHANGE_DATE = now() -----');
				p_ret_user['STAMINA']					 = ret_stamina;
				p_ret_user['LAST_STAMINA_CHANGE_DATE']	 = now_date.format("YYYY-MM-DD HH:mm:ss");
			}

			// GT_USER update -  3. 업데이트 (충전 시간, 포인트)
			p_ret_user.save()
			.then(function (p_ret_user_update) {
				p_ack_packet.stamina			= p_ret_user_update.dataValues.STAMINA;
				p_ack_packet.stamina_remain_time= ret_remain_time;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqChargeStamina - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqChargeStamina - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;