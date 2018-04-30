/********************************************************************
Title : DailyReward
Date : 2016.03.03
Update : 2016.08.30
Desc : 일일 출석 보상
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');
var RewardMgr = require('../../Contents/RewardMgr.js');

var BaseAttendRe= require('../../Data/Base/BaseAttendRe.js');
var BaseVipRe	= require('../../Data/Base/BaseVipRe.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');
var moment = require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var RewardProcess = function(p_user, p_recv, p_ack_cmd, p_ack_packet, p_vip_step, p_month, p_today, p_accum_attend_date) {
		var reward_base = BaseAttendRe.inst.GetAttendDailyReward(p_month, p_accum_attend_date);
		if ( typeof reward_base === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Attend Daily Reward In Base Accum Attend Date', p_accum_attend_date);
			return;
		}

		// VIP 단계 이상이면 보상이 2배
		var is_vip_reward = ( reward_base.reward_2x_vip_step != 0 && p_vip_step >= reward_base.reward_2x_vip_step ) ? true : false;
		
		p_ack_packet.accum_attend_date	= p_accum_attend_date;
		p_ack_packet.vip_reward			= is_vip_reward;

		console.log('is_vip_reward', is_vip_reward);
		
		// 보상 목록을 array로 만들어야 한다.
		if ( is_vip_reward == true ) {
			var temp_list = [];
			for ( var cnt in reward_base.reward_list ) {
				var reward = reward_base.reward_list[cnt];
				reward.reward_count = reward.reward_count * 2;
				temp_list.push(reward);
			}
			// console.log('temp_list', temp_list);
			RewardMgr.inst.RewardBox(p_user, p_ack_cmd, p_ack_packet, temp_list);
		} else {
			// console.log('reward_list', reward_base.reward_list);
			RewardMgr.inst.RewardBox(p_user, p_ack_cmd, p_ack_packet, reward_base.reward_list);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	// 출석 보상 요청
	inst.ReqAttendDailyReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqAttendDAilyReward -', p_user.uuid, p_recv);

		var year = moment().year();
		var month= moment().month() + 1; // month()는 0부터 시작
		var today= moment().date();

		// GT_USER select - VIP 2배 보상 확인
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			// GT_ATTEND select
			GTMgr.inst.GetGTAttend().find({
				where : { UUID : p_user.uuid, YEAR : year, MONTH : month, EXIST_YN : true }
			})
			.then(function (p_ret_attend) {
				// console.log('p_ret_attend', p_ret_attend);
				if ( p_ret_attend == null ) {
					var accum_attend_date = 1;

					// GT_ATTEND create
					GTMgr.inst.GetGTAttend().create({
						UUID				: p_user.uuid,
						YEAR				: year,
						MONTH				: month,
						ACCUM_ATTEND_DATE	: accum_attend_date,// 누적 출석일
						LAST_ATTEND_DATE	: today 			// 마지막 출석한 날짜
					})
					.then(function (p_ret_attend_create) {
						RewardProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, user_data.VIP_STEP, month, today, accum_attend_date);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAttendDailyReward - 4');
					});
				} else {
					var attend_data = p_ret_attend.dataValues;

					// 같은날 2번 받는지 확인
					if ( today == attend_data.LAST_ATTEND_DATE ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAttendAccumOverToday(), 'RewardDay', today, 'AccumDay', attend_data.LAST_ATTEND_DATE);
						return; 
					}

					// 보상일
					var accum_attend_date = attend_data.ACCUM_ATTEND_DATE + 1;

					// GT_ATTEND update
					p_ret_attend.updateAttributes({
						ACCUM_ATTEND_DATE : accum_attend_date,
						LAST_ATTEND_DATE : today
					})
					.then(function (p_ret_attend_update) {
						RewardProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, user_data.VIP_STEP, month, today, accum_attend_date);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAttendDailyReward - 3');
					});
				}
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAttendDailyReward - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAttendDailyReward - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 추가 출석 보상 요청
	inst.ReqAddAttendDailyReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqAddAttendDailyReward -', p_user.uuid, p_recv);

		var year = moment().year();
		var month= moment().month() + 1; // month()는 0부터 시작
		var today= moment().date();

		// GT_USER select - VIP 단계 확인
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			var vip_base = BaseVipRe.inst.GetVip(user_data.VIP_STEP);
			if ( typeof vip_base === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Vip In Base Vip Step', user_data.VIP_STEP);
				return;
			}

			// GT_DAILY_CONTENTS select
			GTMgr.inst.GetGTDailyContents().find({
				where : { UUID : p_user.uuid, EXIST_YN : true }
			})
			.then(function (p_ret_daily_contents) {
				if ( p_ret_daily_contents == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find DailyContents in GT_DAILY_CONTENTS');
					return;
				}
				var daily_data = p_ret_daily_contents.dataValues;

				if ( daily_data.BUY_ADD_ATTEND_COUNT >= vip_base.max_buy_add_attend_count ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughBuyCount(), 'Current Count', daily_data.BUY_ADD_ATTEND_COUNT, 'Max Count', vip_base.max_buy_add_attend_count);
					return;
				}

				var buy_add_attend_count = daily_data.BUY_ADD_ATTEND_COUNT + 1;
				var need_cash = BaseAttendRe.inst.GetAddAttendNeedCash(buy_add_attend_count);
				if ( typeof need_cash === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find NeedCash In Base Buy Add Attend Count', buy_add_attend_count);
					return;
				}

				// 캐쉬 확인
				if ( user_data.CASH < need_cash ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'Current Cash', user_data.CASH, 'Need Cash', need_cash);
					return;
				}
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

					// 보상일 - 추가 출석일이 오늘 날짜 보다 많게 추가 출석을 할 수 없다.
					var accum_attend_date = attend_data.ACCUM_ATTEND_DATE + 1;
					if ( accum_attend_date > today) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectDate(), 'Incorrect Date', accum_attend_date);
						return;
					}

					// GT_DAILY_CONTENTS update
					p_ret_daily_contents.updateAttributes({
						BUY_ADD_ATTEND_COUNT : buy_add_attend_count
					})
					.then(function (p_ret_daily_contents_update) {
						// GT_USER update - 캐쉬 설정
						p_ret_user.updateAttributes({
							CASH : user_data.CASH - need_cash
						})
						.then(function (p_ret_user_update) {
							// Packet 설정
							p_ack_packet.buy_add_attend_count = buy_add_attend_count;
							p_ack_packet.cash = p_ret_user_update.dataValues.CASH;

							// GT_ATTEND update
							p_ret_attend.updateAttributes({
								ACCUM_ATTEND_DATE : accum_attend_date
							})
							.then(function (p_ret_attend_update) {
								RewardProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, user_data.VIP_STEP, month, today, accum_attend_date);
							})
							.catch(function (p_error) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAddAttendDailyReward - 6');
							});
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAddAttendDailyReward - 5');
						});
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAddAttendDailyReward - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAddAttendDailyReward - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAddAttendDailyReward - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAddAttendDailyReward - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;