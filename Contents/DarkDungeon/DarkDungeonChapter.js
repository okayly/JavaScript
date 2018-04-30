/********************************************************************
Title : DarkDungeonChapter
Date : 2016.12.09
Update : 2016.12.20
Desc : 어둠의 던전 - 챕터 정보
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
	inst.ReqDarkDungeonChapter = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('recv - ReqDarkDungeonChapter', p_recv);

		var recv_chapter_id = parseInt(p_recv.chapter_id);

		// GT_VERSION
		GTMgr.inst.GetGTDarkDungeon().find({
			where : { UUID : p_user.uuid, CHAPTER_ID : recv_chapter_id, EXIST_YN : true }
		})
		.then(function (p_ret_chapter) {
			if ( p_ret_chapter != null ) {
				var data_chapter = p_ret_chapter.dataValues;

				var darkdungeon_chapter = new PacketDarkDungeonData.DarkDungeonChapter();
				console.log('darkdungeon_chapter', darkdungeon_chapter);
				
				darkdungeon_chapter.chapter_id		= data_chapter.CHAPTER_ID;
				darkdungeon_chapter.curr_stage_id	= data_chapter.CURR_STAGE_ID;
				darkdungeon_chapter.chapter_state	= data_chapter.STATE;
				darkdungeon_chapter.start_unix_time	= Timer.inst.GetUnixTime(data_chapter.START_TIME);

				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID1);
				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID2);
				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID3);
				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID4);
				darkdungeon_chapter.reward_main_item_list.push(data_chapter.STAGE_DROP_ITEM_ID5);

				p_ack_packet.darkdungeon = darkdungeon_chapter;
			} else {
				p_ack_packet.darkdungeon = null;
			}
			
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonChapter - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;