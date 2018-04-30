/********************************************************************
Title : DuckSkillPoint 
Date : 2016.06.01
Updsate : 2016.08.22
Desc : 테스트 패킷을 관리 - 스킬포인트
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var BaseVipRe = require('../../Data/Base/BaseVipRe.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');
var moment = require('moment');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 스킬포인트 
	inst.ReqSkillPoint = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet)  {
		logger.debug('UUID : %d, recv - ReqSkillPoint -', p_uuid, p_recv);

		var skill_point = parseInt(p_recv.skill_point);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			// 시간 경과로 스킬 포인트가 증가 변경된 경우
			var vip_base = BaseVipRe.inst.GetVip(user_data.VIP_STEP);
			if ( typeof vip_base === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Vip Info In Base');
				return;
			}

			var now_date = moment();

			var charge_time = vip_base.skill_point_charge_time;
			var diff_sec = (user_data.LAST_SKILL_POINT_CHANGE_DATE != null) ? Timer.inst.GetDeltaTimeByBetweenDate(now_date, user_data.LAST_SKILL_POINT_CHANGE_DATE) : 0;
			// 경과 시간에 따른 충전량 계산.
			var add_point = (diff_sec != 0) ? Math.floor(diff_sec / charge_time) : 0;
						
			// 보유 스킬 포인트는 최대 스킬포인트를 넘을 수 없다.
			if ( skill_point > user_data.MAX_SKILL_POINT ) {
				skill_point = user_data.MAX_SKILL_POINT;
			}

			ret_remain_time = Timer.inst.CalcRemainTime(charge_time, skill_point, user_data.MAX_SKILL_POINT, diff_sec);

			// GT_USER update
			p_ret_user['SKILL_POINT'] = ( skill_point >= user_data.MAX_SKILL_POINT ) ? user_data.MAX_SKILL_POINT : skill_point;
			p_ret_user['LAST_SKILL_POINT_CHANGE_DATE'] = ( skill_point >= user_data.MAX_SKILL_POINT ) ? null : Timer.inst.GetNowByStrDate();

			p_ret_user.save()
			.then(function (p_ret_user_update) {
				p_ack_packet.skill_point = p_ret_user_update.dataValues.SKILL_POINT;
				p_ack_packet.skill_point_remain_time = ret_remain_time;

				p_evt_packet.skill_point = p_ret_user_update.dataValues.SKILL_POINT;;
				p_evt_packet.skill_point_remain_time = ret_remain_time;

				Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
			})
			.catch(function (p_error) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqSkillPoint - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqSkillPoint - 1');
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;