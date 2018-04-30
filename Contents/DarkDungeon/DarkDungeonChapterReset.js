/********************************************************************
Title : DarkDungeonChapterReset
Date : 2016.12.15
Update : 2017.03.15
Desc : 어둠의 던전 - 리셋
writer: jongwook
********************************************************************/
var mkDB			= require('../../DB/mkDB.js');
var GTMgr			= require('../../DB/GTMgr.js');
var DarkDungeonMgr	= require('./DarkDungeonMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseDarkDungeon	= require('../../Data/Base/BaseDarkDungeon.js');
var BaseStageDropGroup	= require('../../Data/Base/BaseStageDropGroup.js');

var PacketDarkDungeonData = require('../../Packets/PacketDarkDungeon/PacketDarkDungeonData.js');

var Sender = require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');
var moment	= require('moment');

(function (exports) {
	// private
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqDarkDungeonChapterReset = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('recv - ReqDarkDungeonChapterReset', p_recv);

		var recv_chapter_id = parseInt(p_recv.chapter_id);

		// 챕터 확인
		var base_chapter = BaseDarkDungeon.inst.GetDarkDungeonChapter(recv_chapter_id);
		if ( typeof base_chapter === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Chapter in Base DarkDungeon Chapter', recv_chapter_id);
			return;
		}

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			// GT_DARK_DUNGEON
			GTMgr.inst.GetGTDarkDungeon().find({
				where : { UUID : p_user.uuid, CHAPTER_ID : recv_chapter_id }
			})
			.then(function (p_ret_darkdungeon) {
				if ( p_ret_darkdungeon == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist DarkDungeon in GT_DARK_DUNGEON', recv_chapter_id);
					return;
				}
				var darkdungeon_data = p_ret_darkdungeon.dataValues;

				// 필요 캐쉬 계산 (소모캐쉬 = 남은시간(초) * (1/30) ) 로 계산 된다.
				if ( darkdungeon_data.START_TIME == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Start DarkDungeon chapter_id', chapter_id);
					return;
				}

				var ret_cash = 0;
				var now = moment();
				var diff_seconds = now.diff(moment(darkdungeon_data.START_TIME), 'seconds');

				console.log('now', now.format('YYYY-MM-DD HH:mm:ss'), 'start_time', moment(darkdungeon_data.START_TIME).format('YYYY-MM-DD HH:mm:ss'), 'reset_time', base_chapter.reset_time, 'diff_seconds', diff_seconds);

				if ( diff_seconds < base_chapter.reset_time ) {
					var remain_time = base_chapter.reset_time - diff_seconds;
					var need_cash = parseInt(remain_time * ( 1 / 30 ));

					console.log('diff_seconds : %d, need_cash : %d', diff_seconds, need_cash);

					if ( user_data.CASH < need_cash ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'Current Cash', user_data.CASH, 'Need Cash', need_cash);
						return;
					}

					ret_cash = user_data.CASH - need_cash;
				}

				// 아이템 생성
				var reward_main_item_array = DarkDungeonMgr.inst.GetRewardStageMainItemArray(base_chapter.chapter_id);
				var first_stage = ( base_chapter.stage_array[0] == undefined ) ? 0 : base_chapter.stage_array[0];

				// GT_DARK_DUNGEON update
				p_ret_darkdungeon.updateAttributes({
					STATE				: DefineValues.inst.DarkDungoneWait,
					CURR_STAGE_ID		: first_stage,
					START_TIME			: Timer.inst.GetNowByStrDate(),
					UPDATE_DATE			: Timer.inst.GetNowByStrDate(),
					STAGE_DROP_ITEM_ID1	: ( reward_main_item_array[0] == undefined ) ? 0 : reward_main_item_array[0],
					STAGE_DROP_ITEM_ID2	: ( reward_main_item_array[1] == undefined ) ? 0 : reward_main_item_array[1],
					STAGE_DROP_ITEM_ID3	: ( reward_main_item_array[2] == undefined ) ? 0 : reward_main_item_array[2],
					STAGE_DROP_ITEM_ID4	: ( reward_main_item_array[3] == undefined ) ? 0 : reward_main_item_array[3],
					STAGE_DROP_ITEM_ID5	: ( reward_main_item_array[4] == undefined ) ? 0 : reward_main_item_array[4]
				})
				.then(function (p_ret_darkdungeon_update) {
					var darkdungeon_update = p_ret_darkdungeon_update.dataValues;
					// console.log('p_ret_darkdungeon_update', p_ret_darkdungeon_update.dataValues);

					var darkdungeon_chapter = new PacketDarkDungeonData.DarkDungeonChapter();
				
					darkdungeon_chapter.chapter_id		= darkdungeon_update.CHAPTER_ID;
					darkdungeon_chapter.curr_stage_id	= darkdungeon_update.CURR_STAGE_ID;
					darkdungeon_chapter.chapter_state	= darkdungeon_update.STATE;
					darkdungeon_chapter.start_unix_time	= Timer.inst.GetUnixTime(darkdungeon_update.START_TIME);

					darkdungeon_chapter.reward_main_item_list.push(darkdungeon_update.STAGE_DROP_ITEM_ID1);
					darkdungeon_chapter.reward_main_item_list.push(darkdungeon_update.STAGE_DROP_ITEM_ID2);
					darkdungeon_chapter.reward_main_item_list.push(darkdungeon_update.STAGE_DROP_ITEM_ID3);
					darkdungeon_chapter.reward_main_item_list.push(darkdungeon_update.STAGE_DROP_ITEM_ID4);
					darkdungeon_chapter.reward_main_item_list.push(darkdungeon_update.STAGE_DROP_ITEM_ID5);

					p_ack_packet.darkdungeon = darkdungeon_chapter;

					if ( need_cash > 0 ) {
						// GT_USER update
						p_ret_user.updateAttributes({
							CASH : ret_cash
						})
						.then(function (p_ret_user_update) {
							p_ack_packet.cash = p_ret_user_update.dataValues.CASH;

							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonChapterReset - 4');
						});
					} else {
						p_ack_packet.cash = user_data.CASH;

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					}
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonChapterReset - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonChapterReset - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonChapterReset - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;