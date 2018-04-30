/********************************************************************
Title : DarkDungeonNextStage
Date : 2016.12.20
Update : 2017.01.24
Desc : 어둠의 던전 - 전 챕터 정보
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');
var RewardMgr = require('../RewardMgr.js');

var BaseDarkDungeon	= require('../../Data/Base/BaseDarkDungeon.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketDarkDungeonData = require('../../Packets/PacketDarkDungeon/PacketDarkDungeonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqDarkDungeonNextStage = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('recv - ReqDarkDungeonNextStage', p_recv);

		var recv_chapter_id = parseInt(p_recv.chapter_id);

		// 챕터 확인
		var base_chapter = BaseDarkDungeon.inst.GetDarkDungeonChapter(recv_chapter_id);
		if ( typeof base_chapter === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Chapter in Base DarkDungeon Chapter ID', recv_chapter_id);
			return;
		}

		// GT_VERSION
		GTMgr.inst.GetGTDarkDungeon().find({
			where : { UUID : p_user.uuid, CHAPTER_ID : recv_chapter_id, EXIST_YN : true }
		})
		.then(function (p_ret_chapter) {
			if ( p_ret_chapter == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Chapter in GT_DARK_DUNGEON Chapter ID', recv_chapter_id);
				return;
			}			
			var data_chapter = p_ret_chapter.dataValues;

			var find_index = base_chapter.stage_array.indexOf(data_chapter.CURR_STAGE_ID);
			if ( find_index == -1 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Stage Index Chapter ID', recv_chapter_id, 'Stage ID', data_chapter.CURR_STAGE_ID);
				return;
			}

			// 다음 스테이지 검사
			var stage_slot = find_index + 1;
			console.log('base_chapter.stage_array', base_chapter.stage_array, 'stage_slot', stage_slot);

			if ( stage_slot >= base_chapter.stage_array.length ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Next Stage Chapter ID', recv_chapter_id, 'Stage Slot', stage_slot);
				return;
			}

			// GT_DARK_DUNGEON update STATE : WAIT
			p_ret_chapter.updateAttributes({
				CURR_STAGE_ID	: base_chapter.stage_array[stage_slot],
				STATE			: DefineValues.inst.DarkDungoneWait,
				UPDATE_DATE		: Timer.inst.GetNowByStrDate()
			})
			.then(function (p_ret_chapter_update) {
				p_ack_packet.chapter_id	= p_ret_chapter_update.CHAPTER_ID;
				p_ack_packet.stage_id	= p_ret_chapter_update.CURR_STAGE_ID;
				p_ack_packet.chapter_state = p_ret_chapter_update.STATE;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonNextStage - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonNextStage - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;