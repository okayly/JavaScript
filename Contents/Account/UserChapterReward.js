/********************************************************************
Title : UserChapterReward
Date : 2016.06.10
Update : 2017.04.03
Desc : 챕터 누적 별 보상
writer: dongsu -> jongwook
*******************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');
var RewardMgr = require('../RewardMgr.js');

var LoadGTUser	= require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTBattle= require('../../DB/GTLoad/LoadGTBattle.js');

var SetGTUser		= require('../../DB/GTSet/SetGTUser.js');
var SetGTInventory	= require('../../DB/GTSet/SetGTInventory.js');

var BaseChapter = require('../../Data/Base/BaseChapter.js');
var BaseItemRe = require('../../Data/Base/BaseItemRe.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var GetChapterStar = function(p_uuid, p_chapter_id) {
		return new Promise(function (resolve, reject) {
			let sequelize = mkDB.inst.GetSequelize();
			// GT_STAGE select : 챕터 별 갯수
			GTMgr.inst.GetGTStage().findAll({
				where : { UUID : p_uuid, CHAPTER_ID : p_chapter_id },
				attributes : [ [sequelize.fn('sum', sequelize.col('CLEAR_GRADE')), 'STAR'] ]
			})
			.then(p_ret_star => {
				// console.log('GetTotalStar', p_ret_star);
				resolve(p_ret_star[0].dataValues.STAR);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetChapterBoxID = function(p_ret_chapter, p_box_id, p_t) {
		return new Promise(function (resolve, reject) {
			// GT_CHAPTER update
			p_ret_chapter.updateAttributes({
				TAKE_REWARD_BOX_COUNT : p_box_id
			}, { transaction : p_t })
			.then(p_ret_chapter_update => { resolve(p_ret_chapter_update); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_values, p_box_id, p_base_box) {
		return new Promise(function (resolve, reject) {
			let ret_user = p_values[0];
			let ret_chapter = p_values[1];

			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				// console.log('ProcessTransaction');
				let t = transaction;

				let reward = RewardMgr.inst.GetReward(p_base_box.GetItemList());
				console.log('reward', reward);

				// Promise.all GO!
				Promise.all([
					SetGTUser.inst.SetReward(ret_user, p_base_box.gold, p_base_box.cash, 0, 0, 0, 0, 0, t),
					SetGTInventory.inst.SetRewardItemList(ret_user.dataValues.UUID, reward.item_list, t),
					SetChapterBoxID(ret_chapter, p_box_id, t)
				])
				.then(values => {
					// console.log('values', values);
					t.commit();

					resolve(values);
				})
				.catch(p_error => {
					if (t)
						t.rollback();

					reject(p_error);
				})
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqChapterReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqChapterReward -', p_user.uuid, p_recv);

		let recv_chapter_id = parseInt(p_recv.chapter_id);
		let recv_box_id = parseInt(p_recv.reward_box_id);

		let base_chapter = BaseChapter.inst.GetBaseChapter(recv_chapter_id);
		// console.log('base_chapter', base_chapter);
		if ( typeof base_chapter === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Chapter Info In Base ChapterID', recv_chapter_id);
			return;
		}

		let base_box = base_chapter.GetRewardBox(recv_box_id);
		console.log('base_box', base_box);
		if ( typeof base_box === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Reward Box Info In Base ChapterID', recv_chapter_id, 'Reward Box ID', recv_box_id);
			return;
		}

		// Promise.all GO!
		Promise.all([
			LoadGTUser.inst.SelectUser(p_user.uuid),
			LoadGTBattle.inst.SelectChapter(p_user.uuid, recv_chapter_id),
			GetChapterStar(p_user.uuid, recv_chapter_id)
		])
		.then(values => {
			let ret_user = values[0];
			let ret_chapter = values[1];
			let chapter_star = values[2];

			if ( ret_chapter == null )
				throw ([ PacketRet.inst.retFail(), 'Not Exist Chapter Info In GT_CHAPTER ChapterID', recv_chapter_id ]);

			if ( ret_chapter.dataValues.TAKE_REWARD_BOX_COUNT >= recv_box_id )
				throw([ PacketRet.inst.retAlreadyChapterRewardBox(), 'Reward Box Count', ret_chapter.dataValues.TAKE_REWARD_BOX_COUNT, 'Box ID', recv_box_id ]);

			if ( chapter_star < base_box.need_star )
				throw ([ PacketRet.inst.retNotEnoughStar(), 'Current Star', chapter_star, 'Need Star', base_box.need_star ]);

			return ProcessTransaction(values, recv_box_id, base_box);
		})
		.then(values => {
			let ret_user = values[0];
			let ret_inventory = values[1];

			p_ack_packet.gold = ret_user.dataValues.GOLD;
			p_ack_packet.cash = ret_user.dataValues.CASH;

			ret_inventory.map(item => {
				let item_id = item.dataValues.ITEM_ID;

				let base_item = BaseItemRe.inst.GetItem(item_id);
				if ( typeof base_item === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist Item Info In Base ItemID', item_id ]);

				if ( base_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
					let equipment = new PacketCommonData.Equipment();

					equipment.iuid			= item.dataValues.IUID;
					equipment.item_id		= item.dataValues.ITEM_ID;

					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_1);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_2);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_3);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_4);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_5);
					equipment.sub_option_id_list.push(item.dataValues.SUB_OPTION_ID_6);

					p_ack_packet.equipment_list.push(equipment);
				} else {
					let result_item	= new PacketCommonData.Item();
					result_item.iuid		= item.dataValues.IUID;
					result_item.item_id		= item.dataValues.ITEM_ID;
					result_item.item_count	= item.dataValues.ITEM_COUNT;

					p_ack_packet.item_list.push(result_item);
				}
			});

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1], p_error[2], p_error[3], p_error[4]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;