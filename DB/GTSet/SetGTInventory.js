/********************************************************************
Title : SetGTInventory
Date : 2017.02.17
Update : 2017.04.19
Writer : jongwook
Desc : Promise Set - 가방
********************************************************************/
var GTMgr = require('../GTMgr.js');

var BaseItemRe		= require('../../Data/Base/BaseItemRe.js');
var BaseEquipItem	= require('../../Data/Base/BaseEquipItem.js');

var DefineValues= require('../../Common/DefineValues.js');

var Timer = require('../../Utils/Timer.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectItem = function(p_t, p_uuid, p_item_id) {
		return new Promise(function (resolve, reject) {
			// GT_INVENTORY select
			GTMgr.inst.GetGTInventory().find({
				where : { UUID : p_uuid, ITEM_ID : p_item_id, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_item => { resolve(p_ret_item); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.InsertEquipment = function(p_t, p_uuid, p_item_category1, p_item_id, p_equip_status_id) {
		return new Promise(function (resolve, reject) {
			// console.log('InsertEquipment item_id : %d, equip_status_id : %d', p_item_id, p_equip_status_id);
			let random_option_list;

			let base_equip_status = BaseEquipItem.inst.GetEquipItemStatus(p_equip_status_id);
			// console.log('base_equip_status', base_equip_status);
			if ( typeof base_equip_status !== 'undefined' ) {
				let rand_count = Rand.inst.RandomRange(base_equip_status.option_count_min, base_equip_status.option_count_max);
				random_option_list = BaseEquipItem.inst.GetEquipItemRandomOptionList(base_equip_status.option_group, rand_count);
			} else {
				logger.error('Error InsertEquipment base equip status is undefined. item_id is', p_item_id);
			}
			// console.log('random_option_list', random_option_list);

			// GT_INVENTORY insert
			GTMgr.inst.GetGTInventory().create({
				UUID			: p_uuid,
				ITEM_ID			: p_item_id,
				ITEM_COUNT		: 1,
				CATEGORY1		: p_item_category1,
				SUB_OPTION_ID_1 : ( typeof random_option_list === 'undefined' || typeof random_option_list[0] === 'undefined' ) ? 0 : random_option_list[0],
				SUB_OPTION_ID_2 : ( typeof random_option_list === 'undefined' || typeof random_option_list[1] === 'undefined' ) ? 0 : random_option_list[1],
				SUB_OPTION_ID_3 : ( typeof random_option_list === 'undefined' || typeof random_option_list[2] === 'undefined' ) ? 0 : random_option_list[2],
				SUB_OPTION_ID_4 : ( typeof random_option_list === 'undefined' || typeof random_option_list[3] === 'undefined' ) ? 0 : random_option_list[3],
				SUB_OPTION_ID_5 : ( typeof random_option_list === 'undefined' || typeof random_option_list[4] === 'undefined' ) ? 0 : random_option_list[4],
				SUB_OPTION_ID_6 : ( typeof random_option_list === 'undefined' || typeof random_option_list[5] === 'undefined' ) ? 0 : random_option_list[5],
				REG_DATE : Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_item => {
				// console.log('InsertEquipment p_ret_item', p_ret_item);
				resolve(p_ret_item);
			})
			.catch(p_error => {
				reject(p_error);
			});
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	inst.InsertItem = function(p_t, p_uuid, p_item_category1, p_item_id, p_item_count) {
		return new Promise(function (resolve, reject) {
			// console.log('InsertItem item_id : %d, item_count : %d', p_item_id, p_item_count);
			// GT_INVENTORY insert
			GTMgr.inst.GetGTInventory().create({
				UUID		: p_uuid,
				ITEM_ID		: p_item_id,
				ITEM_COUNT	: p_item_count,
				CATEGORY1	: p_item_category1,
				REG_DATE	: Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_item => { resolve(p_ret_item); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SetRewardItemList = function(p_uuid, p_reward_item_list, p_t) {
		// 장비 아이템 : 갯수 만큼 개별로 새로 만들고
		// 장비 아닌 아이템 : DB에 있으면 update 없으면 insert
		return new Promise(function (resolve, reject) {
			return Promise.all(p_reward_item_list.map(item => {
				// console.log('item.item_category1', item.equip_status_id);
				if ( item.item_category1 == DefineValues.inst.FirstCategoryEquipment ) {
					return inst.InsertEquipment(p_t, p_uuid, item.item_category1, item.item_id, item.equip_status_id);
				} else {
					return inst.SelectItem(p_t, p_uuid, item.item_id)
					.then(p_ret_item => {
						if ( p_ret_item == null ) {
							// console.log('Insert Item', item.item_id, item.item_count);
							return inst.InsertItem(p_t, p_uuid, item.item_category1, item.item_id, item.item_count);
						} else {
							let item_count = p_ret_item.dataValues.ITEM_COUNT;

							// console.log('Update Item', item.item_id, item_count + item.item_count, item_count);
							// GT_INVENTORY update
							return p_ret_item.updateAttributes({ ITEM_COUNT : item_count + item.item_count }, { transaction : p_t });
						}
					});
				}
			}))
			.then(values => { resolve(values); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.UpdateItemCount = function(p_t, p_ret_inventory, p_item_count) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_inventory.dataValues.ITEM_COUNT == p_item_count ) {
				resolve(p_ret_inventory);
			} else {
				p_ret_inventory['ITEM_COUNT'] = p_item_count;

				if ( p_item_count <= 0 )
					p_ret_inventory['EXIST_YN'] = false;

				// GT_INVENTORY update
				p_ret_inventory.save({ transaction : p_t })
				.then(p_ret_inventory_update => {
					console.log('UpdateItemCount item_id : %d, item_count : %d', p_ret_inventory_update.dataValues.ITEM_ID, p_ret_inventory_update.dataValues.ITEM_COUNT);
					resolve(p_ret_inventory_update);
				})
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;