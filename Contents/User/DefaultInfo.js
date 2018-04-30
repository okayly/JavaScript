/********************************************************************
Title : DefaultInfo
Date : 2016.07.18
Update : 2017.03.15
Desc : 로그인 정보 - 유저 기본 정보
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var BaseVipRe	= require('../../Data/Base/BaseVipRe.js');
var DefineValues= require('../../Common/DefineValues.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');
var moment	= require('moment');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqDefaultInfo = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqDefaultInfo -', p_user.uuid, p_recv);

		// GT_USER select - 1. 유저 정보 확인. 
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}
			// console.log('user_data', p_ret_user.dataValues);
			var user_data = p_ret_user.dataValues;			

			var base_vip = BaseVipRe.inst.GetVip(user_data.VIP_STEP);
			if ( typeof base_vip == 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Vip Info In Base');
				return;
			}
	
			// info renew
			var now_date = moment();
			var str_now = Timer.inst.GetNowByStrDate();

			// 스테미너
			var ret_stamina = user_data.STAMINA;
			var ret_stamina_remain_time = 0;
			if ( user_data.STAMINA < user_data.MAX_STAMINA ) {
				console.log('***** 로그인 스테미너 계산 *****');
				var stamina_diff_sec = ( user_data.LAST_STAMINA_CHANGE_DATE != null ) ? Timer.inst.GetDeltaTimeByBetweenDate(now_date, user_data.LAST_STAMINA_CHANGE_DATE) : 0;

				// 1-1. 경과 시간에 따른 충전량 계산. 
				// 1-2. 현재 값에 합산.
				var add_stamina	= (stamina_diff_sec != 0) ? Math.floor(stamina_diff_sec / DefineValues.inst.StaminaRecoverTime) : 0;
				ret_stamina	= user_data.STAMINA + add_stamina;
				if ( ret_stamina > user_data.MAX_STAMINA ) {
					ret_stamina = user_data.MAX_STAMINA;
				}

				// 2. Max 까지 남은 시간 계산.
				ret_stamina_remain_time	= Timer.inst.CalcRemainTime(DefineValues.inst.StaminaRecoverTime, ret_stamina, user_data.MAX_STAMINA, stamina_diff_sec);

				if ( add_stamina != 0 ) {
					p_ret_user['STAMINA'] = ret_stamina;
					p_ret_user['LAST_STAMINA_CHANGE_DATE'] = ( ret_stamina >= user_data.MAX_STAMINA ) ? null : str_now;
				}
			} else {
				if ( user_data.LAST_STAMINA_CHANGE_DATE != null )
					p_ret_user['LAST_STAMINA_CHANGE_DATE'] = null;
			}

			// 스킬 포인트
			var ret_skillpoint = user_data.SKILL_POINT;
			var ret_skillpoint_remain_time = 0;
			if ( user_data.SKILL_POINT < user_data.MAX_SKILL_POINT ) {
				console.log('***** 로그인 스킬 포인트 계산 *****');
				var skillpoint_diff_sec	= ( user_data.LAST_SKILL_POINT_CHANGE_DATE != null ) ? Timer.inst.GetDeltaTimeByBetweenDate(now_date, user_data.LAST_SKILL_POINT_CHANGE_DATE) : 0;
				
				// 1-1. 경과 시간에 따른 충전량 계산. 
				// 1-2. 현재 값에 합산. 
				var add_skillpoint = ( base_vip.skill_point_charge_time != 0 ) ? Math.floor(skillpoint_diff_sec / base_vip.skill_point_charge_time) : 0;
				ret_skillpoint = user_data.SKILL_POINT + add_skillpoint;
				if ( ret_skillpoint > user_data.MAX_SKILL_POINT ) {
					ret_skillpoint = user_data.MAX_SKILL_POINT;
				}

				// 2. Max 까지 남은 시간 계산.
				ret_skillpoint_remain_time = Timer.inst.CalcRemainTime(base_vip.skill_point_charge_time, ret_skillpoint, user_data.MAX_SKILL_POINT, skillpoint_diff_sec);

				if (add_skillpoint != 0) {
					p_ret_user['SKILL_POINT'] = ret_skillpoint;
					p_ret_user['LAST_SKILL_POINT_CHANGE_DATE'] = (ret_skillpoint >= user_data.MAX_SKILL_POINT) ? null : str_now;
				}
			} else {
				if (user_data.LAST_SKILL_POINT_CHANGE_DATE != null)
					p_ret_user['LAST_SKILL_POINT_CHANGE_DATE'] = null;
			}

			// GT_USER update
			p_ret_user.save()
			.then(function (p_ret_user_update) {
				p_ack_packet.nick					= user_data.NICK;
				p_ack_packet.icon					= user_data.ICON;
				p_ack_packet.level					= user_data.USER_LEVEL;
				p_ack_packet.exp					= user_data.USER_EXP;
				p_ack_packet.gold					= user_data.GOLD;
				p_ack_packet.cash					= user_data.CASH;
				p_ack_packet.point_honor			= user_data.POINT_HONOR;
				p_ack_packet.point_alliance			= user_data.POINT_ALLIANCE;
				p_ack_packet.point_challenge		= user_data.POINT_CHALLENGE;

				p_ack_packet.max_stamina			= user_data.MAX_STAMINA;
				p_ack_packet.max_skill_point		= user_data.MAX_SKILL_POINT;

				p_ack_packet.stamina				= p_ret_user_update.STAMINA;
				p_ack_packet.skill_point			= p_ret_user_update.SKILL_POINT;

				p_ack_packet.stamina_remain_time	= ret_stamina_remain_time;
				p_ack_packet.skill_point_remain_time= ret_skillpoint_remain_time;

				p_ack_packet.account_buff_point		= user_data.ACCOUNT_BUFF_POINT;
				p_ack_packet.max_equip_item_inventory_slot	= user_data.MAX_EQUIP_ITEM_INVENTORY_SLOT;
				p_ack_packet.buy_equip_item_inventory_slot	= user_data.BUY_EQUIP_ITEM_INVENTORY_SLOT;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDefaultInfo - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDefaultInfo - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;