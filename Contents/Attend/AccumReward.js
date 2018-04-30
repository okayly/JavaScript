/********************************************************************
Title : AccumReward
Date : 2016.03.03
Update : 2016.07.25
Desc : 누적 출석 보상
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');
var RewardMgr = require('../../Contents/RewardMgr.js');

var BaseAttendRe= require('../../Data/Base/BaseAttendRe.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');
var moment = require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 누적 출석 보상 요청
	inst.ReqAttendAccumReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqAttendAccumReward -', p_user.uuid, p_recv);

		var reward_date = parseInt(p_recv.reward_day);

		var year = moment().year();
		var month= moment().month() + 1; // month()는 0부터 시작
		var today= moment().date();

		// GT_ATTEND select
		GTMgr.inst.GetGTAttend().find({
			where : { UUID : p_user.uuid, YEAR : year, MONTH : month, EXIST_YN : true }
		})
		.then(function (p_ret_attend) {
			if ( p_ret_attend == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Attend in GT_ATTEND');
				return;
			}
			var attend_data = p_ret_attend.dataValues;

			// Reward Day shift 연산
			var shift_day = 1 << reward_date;

			// 중복 수령 확인
			if ( attend_data.ACCUM_ATTEND_REWARD_LIST & shift_day ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyRewardPayment(), 'Reward Date', reward_date);
				return;
			}

			// 누적 출석일이 출석일보다 커야 한다.
			if ( reward_date > attend_data.ATTEND_DATE ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotNotEnoughAccumAttendDate(), 'Reward Date', reward_date, 'Attend Date', attend_data.ATTEND_DATE);
				return;
			}

			var accum_date_base = BaseAttendRe.inst.GetAccumDate(month, reward_date);
			// console.log('accum_date_base', accum_date_base);
			if ( typeof accum_date_base === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Accum Date In Base Month', month, 'Reward Date', reward_date);
				return;
			}

			var ret_reward_list = attend_data.ACCUM_ATTEND_REWARD_LIST | shift_day;

			// GT_ATTEND update
			p_ret_attend.updateAttributes({
				ACCUM_ATTEND_REWARD_LIST : ret_reward_list
			})
			.then(function (p_ret_attend_update) {
				p_ack_packet.accum_reward_date = reward_date;
				
				RewardMgr.inst.RewardBox(p_user,p_ack_cmd, p_ack_packet, accum_date_base.reward_list);
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAttendAccumReward - 3');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAttendAccumReward - 2');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;