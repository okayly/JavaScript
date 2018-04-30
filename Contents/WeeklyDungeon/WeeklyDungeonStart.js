/********************************************************************
Title : WeeklyDungeonStart
Date : 2016.08.08
Update : 2016.11.25
Desc : 요일 던전 시작
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var BaseHeroRe			= require('../../Data/Base/BaseHeroRe.js');
var BaseWeeklyDungeon 	= require('../../Data/Base/BaseWeeklyDungeon.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqWeeklyDungeonStart = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqWeeklyDungeonStart -', p_user.uuid, p_recv);
		
		var recv_stage_id	= parseInt(p_recv.stage_id);

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

			GTMgr.inst.GetGTDailyContents().find({
				where : { UUID : p_user.uuid, EXIST_YN : true }
			})
			.then(function (p_ret_daily) {
				if ( p_ret_daily == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_DAILY_CONTENT');
					return;
				}

				var daily_data = p_ret_daily.dataValues;
				var dungeon_base = BaseWeeklyDungeon.inst.GetBaseWeeklyDungeon(recv_stage_id);
				if ( typeof dungeon_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Weekly Dungeon Info In Base Stage ID', recv_stage_id);
					return;
				}

				// 1. 요일 확인. 
				// 요일 확인 - 일요일은 모든 던전 입장 가능(sunday : 0)
				var today = Timer.inst.GetNowDayByInt();
				if ( today != 0 && dungeon_base.open_week != today) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotMatchDayOfWeek());
					return;
				}

				// 2. 요일에 따른 가능 횟수 확인. (일요일 6회 나머지 3회.)
				// 상수는 Common으로 이동.
				if ( (today == 0 && daily_data.EXEC_WEEKLY_DUNGEON_PLAY_COUNT >= 6) || 
					 (today != 0 && daily_data.EXEC_WEEKLY_DUNGEON_PLAY_COUNT >= 3)) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughExecCount());
						return; 
				}

				// 3. 스테미너 확인. 
				if ( user_data.STAMINA < dungeon_base.need_stamina ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughStamina(), 'Need Stamina', dungeon_base.need_stamina, 'Current Stamina', user_data.STAMINA);
					return;
				}

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqWeeklyDungeon - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqWeeklyDungeon - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;