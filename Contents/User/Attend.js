/********************************************************************
Title : Attend
Date : 2016.07.25
Desc : 로그인 정보 - 출석
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var BaseAttendRe = require('../../Data/Base/BaseAttendRe.js');

var Sender = require('../../App/Sender.js');
var moment = require('moment');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqAttend = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqAttend -', p_user.uuid, p_recv);

		var year = moment().year();
		var month= moment().month() + 1; // month()는 0부터 시작

		// GT_ATTEND select
		GTMgr.inst.GetGTAttend().find({
			where : { UUID : p_user.uuid, YEAR : year, MONTH : month, EXIST_YN : true }
		})
		.then(function (p_ret_attend) {
			if ( p_ret_attend == null ) {
				p_ack_packet.attend_accum_day		= 0;
				p_ack_packet.last_attend_reward_day	= null;
				p_ack_packet.buy_add_attend_count	= 0;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				return;
			}
			var attend_data = p_ret_attend.dataValues;

			// GT_DAILY_CONTENTS
			GTMgr.inst.GetGTDailyContents().find({
				where : { UUID : p_user.uuid, EXIST_YN: true }
			})
			.then(function (p_ret_daily_contents) {
				if ( p_ret_daily_contents == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Not Exist DailyContents Info In GT_DAILY_CONTENTS');
					return;
				}
				var daily_data = p_ret_daily_contents.dataValues;

				p_ack_packet.attend_accum_day		= attend_data.ACCUM_ATTEND_DATE;
				p_ack_packet.last_attend_reward_day	= attend_data.LAST_ATTEND_DATE;
				p_ack_packet.buy_add_attend_count	= daily_data.BUY_ADD_ATTEND_COUNT;

				var accum_attend_reward_base = BaseAttendRe.inst.GetBaseAccumAttendReward(month);
				if ( typeof accum_attend_reward_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Accum Date In Base Month', month);
					return;
				}

				// 누적 보상 확인
				var date_list = accum_attend_reward_base.attend_accum_date_list;
				// console.log('date_list', date_list);
				for ( var cnt in date_list ) {
					// console.log('value : %d, DB : %d, shift : %d, ret :', date_list[cnt], attend_data.ACCUM_ATTEND_REWARD_LIST, (1 << date_list[cnt]), attend_data.ACCUM_ATTEND_REWARD_LIST & (1 << date_list[cnt]));
					if ( attend_data.ACCUM_ATTEND_REWARD_LIST & (1 << date_list[cnt]) ) {
						p_ack_packet.attend_accum_reward_days.push(date_list[cnt]);
					}
				}

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAttend - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAttend - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;