/********************************************************************
Title : DarkDungeon
Date : 2016.12.19
Desc : 어둠의 던전 - 전 챕터 정보
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var PacketDarkDungeonData = require('../../Packets/PacketDarkDungeon/PacketDarkDungeonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqDarkDungeon = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('recv - ReqDarkDungeon', p_recv);

		// GT_VERSION
		GTMgr.inst.GetGTDarkDungeon().findAll({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_chapter) {
			for ( var cnt in p_ret_chapter ) {
				var data_chapter = p_ret_chapter[cnt].dataValues;

				var darkdungeon_chapter = new PacketDarkDungeonData.DarkDungeonChapter();
				
				darkdungeon_chapter.chapter_id		= data_chapter.CHAPTER_ID;
				darkdungeon_chapter.curr_stage_id	= data_chapter.CURR_STAGE_ID;
				darkdungeon_chapter.chapter_state	= data_chapter.STATE;
				darkdungeon_chapter.start_unix_time	= Timer.inst.GetUnixTime(data_chapter.START_TIME);

				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID1);
				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID2);
				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID3);
				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID4);
				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID5);
				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID6);
				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID7);
				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID8);
				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID9);
				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID10);

				p_ack_packet.darkdungeon_list.push(darkdungeon_chapter);
			}
			
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeon - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;