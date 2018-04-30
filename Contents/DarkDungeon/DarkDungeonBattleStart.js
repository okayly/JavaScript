/********************************************************************
Title : DarkDungeonBattleStart
Date : 2016.12.12
Update : 2017.01.24
Desc : 어둠의 던전 - 배틀 시작
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var BaseDarkDungeon	= require('../../Data/Base/BaseDarkDungeon.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqDarkDungeonBattleStart = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('recv - ReqDarkDungeonBattleStart', p_recv);

		var recv_stage_id = parseInt(p_recv.stage_id);

		// 챕터, 스테이지 확인
		var base_stage = BaseDarkDungeon.inst.GetDarkDungeonStage(recv_stage_id);
		if ( typeof base_stage === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Stage in Base DarkDungeon Stage', recv_stage_id);
			return;
		}

		var base_dark_chapter = BaseDarkDungeon.inst.GetDarkDungeonChapter(base_stage.chapter_id);
		if ( typeof base_dark_chapter === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Chapter in Base DarkDungeon Chapter', chapter_id);
			return;
		}

		// GT_DARK_DUNGEON
		GTMgr.inst.GetGTDarkDungeon().find({
			where : { UUID : p_user.uuid, CHAPTER_ID : base_stage.chapter_id }
		})
		.then(function (p_ret_stage) {
			if ( p_ret_stage == null ) {
				// GT_DARK_DUNGEON insert
				GTMgr.inst.GetGTDarkDungeon().create({
					UUID			: p_user.uuid,
					CHAPTER_ID		: base_stage.chapter_id,
					CURR_STAGE_ID	: recv_stage_id,
					STATE			: DefineValues.inst.DarkDungoneStart,
					UPDATE_DATE		: Timer.inst.GetNowByStrDate(),
					REG_DATE		: Timer.inst.GetNowByStrDate()
				})
				.then(function (p_ret_stage_create) {
					console.log('ReqDarkDungeonBattleStart - create', p_ret_stage_create.dataValues);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonBattleStart - 4');
				});
			} else {
				// update
				p_ret_stage.updateAttributes({
					STATE			: DefineValues.inst.DarkDungoneStart,
					CURR_STAGE_ID	: base_stage.stage_id,
					UPDATE_DATE		: Timer.inst.GetNowByStrDate()
				})
				.then(function (p_ret_stage_update) {
					console.log('ReqDarkDungeonBattleStart - update', p_ret_stage_update.dataValues);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonBattleStart - 3');
				});
			}
			
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonBattleStart - 2');
		});
		
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;