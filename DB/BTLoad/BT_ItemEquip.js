/********************************************************************
Title : BT_ItemEquip
Date : 2017.02.07
Update : 2017.02.07
Desc : BT 로드 - 장착 아이템 정보
writer: jong wook
********************************************************************/
var BaseEquipItem = require('../../Data/Base/BaseEquipItem.js');
var BaseItemEvolutionRe = require('../../Data/Base/BaseItemEvolutionRe.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadItemEquipStatus = function (p_bt_item_equip_status) {
		logger.debug('*** Start LoadItemEquipStatus ***');

		var getEquipStatus = function() {
			return new Promise(function (resolve, reject) {
				// BT_ITEM_EQUIP_STATUS select
				p_bt_item_equip_status.findAll()
				.then(p_status_list => { resolve(p_status_list); })
				.catch(p_error => { reject(p_error); });
			});
		}

		// Promise GO!
		getEquipStatus()
		.then(p_status_list => {
			for ( let cnt in p_status_list ) {
				(function (cnt) {
					// console.log('p_status_list[cnt] -', p_status_list[cnt].dataValues.STATUS_ID);
					let data_status = p_status_list[cnt].dataValues;

					let base_equip_status = new BaseEquipItem.inst.BaseEquipStatus();

					base_equip_status.status_id			= data_status.STATUS_ID;
					base_equip_status.evolution_step	= data_status.EVOLUTION_STEP;
					base_equip_status.option_count_min	= data_status.OPTION_COUNT_MIN;
					base_equip_status.option_count_max	= data_status.OPTION_COUNT_MAX;
					base_equip_status.option_group		= data_status.OPTION_GROUP;
					base_equip_status.lv_up_gold		= data_status.LV_UP_GOLD;
					base_equip_status.lv_up_gold_lv		= data_status.LV_UP_GOLD_LV;

					BaseEquipItem.inst.AddEquipItemStatus(data_status.STATUS_ID, base_equip_status);
				})(cnt);
			}
		})
		.catch(p_error => {
			console.log('Error Promise', p_error);
		})
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadItemEquipOption = function (p_bt_item_equip_option) {
		logger.debug('*** Start LoadItemEquipOption ***');

		var getEquipOption = function() {
			return new Promise(function (resolve, reject) {
				// BT_ITEM_EQUIP_OPTION select
				p_bt_item_equip_option.findAll()
				.then(p_option_list => { resolve(p_option_list); })
				.catch(p_error => { reject(p_error); });
			});
		}

		// Promise GO!
		getEquipOption()
		.then(p_option_list => {
			for (let cnt in p_option_list) {
				(function (cnt) {
					let data = p_option_list[cnt].dataValues;
					// console.log('data -', data);

					BaseEquipItem.inst.AddEquipItemOptionGroup(data.EQUIP_OPTION_ID, data.GROUP_ID, data.OPTION_RATE);
				})(cnt);
			}
		})
		.catch(p_error => {
			console.log('Error Promise', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
