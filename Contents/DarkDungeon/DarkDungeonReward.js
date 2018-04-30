/********************************************************************
Title : DarkDungeonReward
Date : 2016.12.19
Update : 2017.02.22
Desc : 어둠의 던전 - 전 챕터 정보
writer: jongwook
********************************************************************/
var mkDB		= require('../../DB/mkDB.js');
var GTMgr		= require('../../DB/GTMgr.js');
var RewardMgr	= require('../RewardMgr.js');

var SetGTInventory	= require('../../DB/GTSet/SetGTInventory.js');

var BaseDarkDungeon	= require('../../Data/Base/BaseDarkDungeon.js');
var BaseItemRe		= require('../../Data/Base/BaseItemRe.js');
var BaseEquipItem	= require('../../Data/Base/BaseEquipItem.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');
var PacketDarkDungeonData = require('../../Packets/PacketDarkDungeon/PacketDarkDungeonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private
	// public
	var inst = {};

	var GetDarkDungeon = function(p_uuid, p_chapter_id) {
		return new Promise(function (resolve, reject) {
			// GT_DARK_DUNGEON select
			GTMgr.inst.GetGTDarkDungeon().find({
				where : { UUID : p_uuid, CHAPTER_ID : p_chapter_id, EXIST_YN : true }
			})
			.then(p_ret_chapter => { resolve(p_ret_chapter); })
			.catch(p_error => { reject(p_error); });
		});
	}

	var SetDarkDungeon = function(p_ret_chapter, p_t) {
		return new Promise(function (resolve, reject) {
			console.log('SetDarkDungeon');

			// GT_DARK_DUNGEON update STATE : FINISH			
			return p_ret_chapter.updateAttributes({ STATE : DefineValues.inst.DarkDungoneComplete }, { transaction : p_t})
			.then(p_ret_chapter_update => {
				resolve(p_ret_chapter_update);
			})
			.catch(p_error => {
				reject(p_error);
			});
		});
	}

	var GetItem = function(p_uuid, p_item_id, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_INVENTORY select
			GTMgr.inst.GetGTInventory().find({
				where : { UUID : p_uuid, ITEM_ID : p_item_id, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_item => { resolve(p_ret_item); })
			.catch(p_error => { reject(p_error); });
		});
	}

	var InsertItem = function(p_uuid, p_item_id, p_item_count, p_t) {
		return new Promise(function (resolve, reject) {
			console.log('InsertItem', p_item_id, p_item_count);

			// GT_INVENTORY insert
			GTMgr.inst.GetGTInventory().create({
				UUID : p_uuid, ITEM_ID : p_item_id, ITEM_COUNT : p_item_count, REG_DATE : Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_item => { resolve(p_ret_item); })
			.catch(p_error => { reject(p_error); });
		});
	}

	var SetItem = function(p_uuid, p_item_id, p_item_count, p_item_category1, p_equip_status_id, p_t) {
		// item, equip_item
		return new Promise(function (resolve, reject) {
			// console.log('item.item_category1', item.item_category1);
			if ( p_item_category1 == DefineValues.inst.FirstCategoryEquipment ) {
				SetGTInventory.inst.InsertEquipment(p_t, p_uuid, p_item_category1, p_item_id, p_equip_status_id)
				.then(p_ret_item => { resolve(p_ret_item); })
				.catch(p_error => { reject(p_error); });
			} else {
				return GetItem(p_uuid, p_item_id, p_t)
				.then(p_ret_item => {
					if ( p_ret_item == null ) {
						InsertItem(p_uuid, p_item_id, 1, p_t)
						.then(p_ret_item => { resolve(p_ret_item); })
						.catch(p_error => { reject(p_error); });
					} else {
						let old_count = p_ret_item.dataValues.ITEM_COUNT;
						// GT_INVENTORY update
						console.log('updateItem', p_item_id, old_count + p_item_count, old_count);

						p_ret_item.updateAttributes({ ITEM_COUNT : old_count + p_item_count }, { transaction : p_t })
						.then(p_ret_item => { resolve(p_ret_item); })
						.catch(p_error => { reject(p_error); });
					}
				});
			}
		});		
	}

	var SetTransaction = function(p_uuid, p_ret_chapter, p_base_chapter) {
		let find_index = p_base_chapter.stage_array.indexOf(p_ret_chapter.dataValues.CURR_STAGE_ID);

		if ( find_index == -1 )
			throw ([ PacketRet.inst.retFail(), 'Not Find Stage Index Chapter ID', recv_chapter_id, 'Stage ID', p_ret_chapter.dataValues.CURR_STAGE_ID ]);
		// console.log('p_base_chapter.stage_array', p_base_chapter.stage_array, 'find_index', find_index);
		let item_id		= p_ret_chapter.dataValues['STAGE_DROP_ITEM_ID' + ( find_index + 1 )];
		let item_count	= 1;

		let base_item = BaseItemRe.inst.GetItem(item_id);
		if ( typeof base_item === 'undefined' )
			throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', item_id ]);

		return new Promise(function (resolve, reject) {
			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				console.log('setTransaction');

				let t = transaction;

				return Promise.all([ SetDarkDungeon(p_ret_chapter, t), SetItem(p_uuid, item_id, item_count, base_item.category1, base_item.equip_status_id, t) ])
				.then(values => {
					console.log('Commit');
					t.commit();

					resolve(values);
				})
				.catch(p_error => {
					console.log('Rollback');
					if (t)
						t.rollback();

					reject(p_error);
				})
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqDarkDungeonReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('recv - ReqDarkDungeonReward', p_recv);

		var recv_chapter_id = parseInt(p_recv.chapter_id);

		// 챕터 확인
		var base_chapter = BaseDarkDungeon.inst.GetDarkDungeonChapter(recv_chapter_id);
		if ( typeof base_chapter === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Chapter in Base DarkDungeon Chapter ID', recv_chapter_id);
			return;
		}

		// Promise GO!
		GetDarkDungeon(p_user.uuid, recv_chapter_id)
		.then(p_ret_chapter => {
			if ( p_ret_chapter == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Chapter in GT_DARK_DUNGEON Chapter ID', recv_chapter_id);
				return;
			}

			return SetTransaction(p_user.uuid, p_ret_chapter, base_chapter);
		})
		.then(values => {
			console.log('Promise.all Done', values.length);

			let chapter_data= values[0].dataValues;
			let item_data = values[1].dataValues;

			p_ack_packet.chapter_id		= chapter_data.CHAPTER_ID;
			p_ack_packet.stage_id		= chapter_data.CURR_STAGE_ID;
			p_ack_packet.chapter_state	= chapter_data.STATE;

			let base_item = BaseItemRe.inst.GetItem(item_data.ITEM_ID);
			if ( typeof base_item === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', item_data.ITEM_ID ]);

			if ( base_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
				p_ack_packet.result_equipment	= new PacketCommonData.Equipment();

				p_ack_packet.result_equipment.iuid			= item_data.IUID;
				p_ack_packet.result_equipment.item_id		= item_data.ITEM_ID;

				p_ack_packet.result_equipment.sub_option_id_list.push(item_data.SUB_OPTION_ID_1);
				p_ack_packet.result_equipment.sub_option_id_list.push(item_data.SUB_OPTION_ID_2);
				p_ack_packet.result_equipment.sub_option_id_list.push(item_data.SUB_OPTION_ID_3);
				p_ack_packet.result_equipment.sub_option_id_list.push(item_data.SUB_OPTION_ID_4);
				p_ack_packet.result_equipment.sub_option_id_list.push(item_data.SUB_OPTION_ID_5);
				p_ack_packet.result_equipment.sub_option_id_list.push(item_data.SUB_OPTION_ID_6);
			} else {
				p_ack_packet.result_item			= new PacketCommonData.Item();
				p_ack_packet.result_item.iuid		= item_data.IUID;
				p_ack_packet.result_item.item_id	= item_data.ITEM_ID;
				p_ack_packet.result_item.item_count	= item_data.ITEM_COUNT;
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;