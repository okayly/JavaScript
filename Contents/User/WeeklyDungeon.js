/********************************************************************
Title : WeeklyDungeon
Date : 2016.11.25
Desc : 로그인 정보 - 요일 던전 횟수 요청
writer: dongsu
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var Sender	= require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqWeeklyDungeon = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqWeeklyDungeon -', p_user.uuid, p_recv);

		GTMgr.inst.GetGTDailyContents().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_daily) {
			if ( p_ret_daily == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_DAILY_CONTENT');
				return;
			}

			p_ack_packet.exec_count = p_ret_daily.dataValues.EXEC_WEEKLY_DUNGEON_PLAY_COUNT;
			
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqWeeklyDungeon - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;