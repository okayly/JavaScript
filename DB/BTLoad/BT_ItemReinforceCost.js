/********************************************************************
Title : BT_ItemReinforceCost
Date : 2017.02.07
Update : 2017.04.07
Desc : BT 로드 - 장착 아이템 정보
writer: jong wook
********************************************************************/
var BaseItemReinforce = require('../../Data/Base/BaseItemReinforce.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadItemReinforceCost = function (p_bt_item_reinforce_cost) {
		logger.debug('*** Start LoadItemReinforceCost ***');

		var getEnchantCost = function() {
			return new Promise(function (resolve, reject) {
				// BT_ITEM_EQUIP_STATUS select
				p_bt_item_reinforce_cost.findAll()
				.then(p_enchant_cost_list => { resolve(p_enchant_cost_list); })
				.catch(p_error => { reject(p_error); });
			});
		}

		getEnchantCost()
		.then(p_enchant_cost_list => {
			for ( let cnt in p_enchant_cost_list ) {
				(function (cnt) {
					// console.log('p_enchant_cost_list[cnt] -', p_enchant_cost_list[cnt].dataValues.REINFORCE_ID);
					let data_status = p_enchant_cost_list[cnt].dataValues;

					let enchant_cost = new BaseItemReinforce.inst.BaseEnchantCost();

					enchant_cost.enchat_id				= data_status.REINFORCE_ID;
					enchant_cost.need_gold				= data_status.GOLD;
					enchant_cost.need_material_id_1		= data_status.MATERIAL1_IDX;
					enchant_cost.need_material_count_1	= data_status.MATERIAL1_COUNT;
					enchant_cost.rate					= data_status.RATE * 100;

					BaseItemReinforce.inst.AddItemEnchantCost(data_status.REINFORCE_ID, enchant_cost);
				})(cnt);
			}
		})
		.catch(p_error => {
			console.log('Error Promise', p_error);
		})
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
