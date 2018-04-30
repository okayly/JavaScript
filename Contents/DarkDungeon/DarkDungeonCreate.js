/********************************************************************
Title : DarkDungeonCreate
Date : 2016.12.19
Update : 2017.01.24
Desc : 어둠의 던전 - 챕터 만들기
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');
var DarkDungeonMgr	= require('./DarkDungeonMgr.js');

var BaseDarkDungeon	= require('../../Data/Base/BaseDarkDungeon.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketDarkDungeonData = require('../../Packets/PacketDarkDungeon/PacketDarkDungeonData.js');

var Sender = require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private
	// public
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	var SendPacket = function (p_user, p_recv, p_ack_cmd, p_ack_packet, p_ret_darkdungeon) {
		var darkdungeon_data = p_ret_darkdungeon.dataValues;
		// console.log('p_ret_darkdungeon', p_ret_darkdungeon.dataValues);

		var darkdungeon = new PacketDarkDungeonData.DarkDungeonChapter();
	
		darkdungeon.chapter_id		= darkdungeon_data.CHAPTER_ID;
		darkdungeon.curr_stage_id	= darkdungeon_data.CURR_STAGE_ID;
		darkdungeon.chapter_state	= darkdungeon_data.STATE;
		darkdungeon.start_unix_time	= Timer.inst.GetUnixTime(darkdungeon_data.START_TIME);

		darkdungeon.reward_main_item_list.push(darkdungeon_data.STAGE_DROP_ITEM_ID1);
		darkdungeon.reward_main_item_list.push(darkdungeon_data.STAGE_DROP_ITEM_ID2);
		darkdungeon.reward_main_item_list.push(darkdungeon_data.STAGE_DROP_ITEM_ID3);
		darkdungeon.reward_main_item_list.push(darkdungeon_data.STAGE_DROP_ITEM_ID4);
		darkdungeon.reward_main_item_list.push(darkdungeon_data.STAGE_DROP_ITEM_ID5);

		p_ack_packet.darkdungeon = darkdungeon;

		Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqDarkDungeonCreate = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('recv - ReqDarkDungeonCreate', p_recv);

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

			if ( user_data.USER_LEVEL < base_chapter.limit_level ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughUserLevel(), 'User Level', user_data.USER_LEVEL, 'Limit Level', base_chapter.limit_level);
				return;
			}

			// GT_DARK_DUNGEON
			GTMgr.inst.GetGTDarkDungeon().find({
				where : { UUID : p_user.uuid, CHAPTER_ID : recv_chapter_id }
			})
			.then(function (p_ret_darkdungeon) {
				// 아이템 생성
				var reward_main_item_array = DarkDungeonMgr.inst.GetRewardStageMainItemArray(base_chapter.chapter_id);
				var first_stage = ( base_chapter.stage_array[0] == undefined ) ? 0 : base_chapter.stage_array[0];

				if ( p_ret_darkdungeon == null ) {
					// GT_DARK_DUNGEON insert
					GTMgr.inst.GetGTDarkDungeon().create({
						UUID				: p_user.uuid,
						CHAPTER_ID			: base_chapter.chapter_id,
						CURR_STAGE_ID		: first_stage,
						STATE				: DefineValues.inst.DarkDungoneWait,
						START_TIME			: Timer.inst.GetNowByStrDate(),
						UPDATE_DATE			: Timer.inst.GetNowByStrDate(),
						STAGE_DROP_ITEM_ID1	: ( reward_main_item_array[0] == undefined ) ? 0 : reward_main_item_array[0],
						STAGE_DROP_ITEM_ID2	: ( reward_main_item_array[1] == undefined ) ? 0 : reward_main_item_array[1],
						STAGE_DROP_ITEM_ID3	: ( reward_main_item_array[2] == undefined ) ? 0 : reward_main_item_array[2],
						STAGE_DROP_ITEM_ID4	: ( reward_main_item_array[3] == undefined ) ? 0 : reward_main_item_array[3],
						STAGE_DROP_ITEM_ID5	: ( reward_main_item_array[4] == undefined ) ? 0 : reward_main_item_array[4],
						STAGE_DROP_ITEM_ID6	: ( reward_main_item_array[5] == undefined ) ? 0 : reward_main_item_array[5],
						STAGE_DROP_ITEM_ID7	: ( reward_main_item_array[6] == undefined ) ? 0 : reward_main_item_array[6],
						STAGE_DROP_ITEM_ID8	: ( reward_main_item_array[7] == undefined ) ? 0 : reward_main_item_array[7],
						STAGE_DROP_ITEM_ID9	: ( reward_main_item_array[8] == undefined ) ? 0 : reward_main_item_array[8],
						STAGE_DROP_ITEM_ID10: ( reward_main_item_array[9] == undefined ) ? 0 : reward_main_item_array[9],
						REG_DATE			: Timer.inst.GetNowByStrDate()
					})
					.then(function (p_ret_darkdungeon_create) {
						// console.log('ReqDarkDungeonCreate - create', p_ret_darkdungeon_create.dataValues);
						SendPacket(p_user, p_recv, p_ack_cmd, p_ack_packet, p_ret_darkdungeon_create);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonCreate - 4');
					}); 
				} else {
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
						STAGE_DROP_ITEM_ID5	: ( reward_main_item_array[4] == undefined ) ? 0 : reward_main_item_array[4],
						STAGE_DROP_ITEM_ID6	: ( reward_main_item_array[5] == undefined ) ? 0 : reward_main_item_array[5],
						STAGE_DROP_ITEM_ID7	: ( reward_main_item_array[6] == undefined ) ? 0 : reward_main_item_array[6],
						STAGE_DROP_ITEM_ID8	: ( reward_main_item_array[7] == undefined ) ? 0 : reward_main_item_array[7],
						STAGE_DROP_ITEM_ID9	: ( reward_main_item_array[8] == undefined ) ? 0 : reward_main_item_array[8],
						STAGE_DROP_ITEM_ID10: ( reward_main_item_array[9] == undefined ) ? 0 : reward_main_item_array[9],
					})
					.then(function (p_ret_darkdungeon_update) {
						SendPacket(p_user, p_recv, p_ack_cmd, p_ack_packet, p_ret_darkdungeon_update);
					})
					.catch(function (p_error) {
						console.log('p_error', p_error);
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonCreate - 3');
					});
				}
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonCreate - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDarkDungeonCreate - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;