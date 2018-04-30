/********************************************************************
Title : BT_Items
Date : 2015.11.11
Update : 2017.04.07
Desc : BT 로드 - 아이템 정보
writer: jong wook
********************************************************************/
var BaseItemRe = require('../../Data/Base/BaseItemRe.js');
var BaseItemEvolutionRe = require('../../Data/Base/BaseItemEvolutionRe.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadItem = function (p_bt_item) {
		logger.debug('*** Start LoadItem ***');
		return new Promise(function (resolve, reject) {
			// BT_ITEM_BASE select
			return p_bt_item.findAll()
			.then(p_ret_item_list => {
				return Promise.all(p_ret_item_list.map(row => {
					// console.log('row -', row.dataValues.ITEM_ID);
					let data = row.dataValues;

					let base_item = new BaseItemRe.inst.BaseItem();

					base_item.item_id	= data.ITEM_ID;
					base_item.category1	= data.CATEGORY1;
					base_item.category2	= data.CATEGORY2;
					// console.log('data.CATEGORY1: %d, data.CATEGORY2: %d', data.CATEGORY1, data.CATEGORY2);
					base_item.index			= data.INDEX;
					base_item.buy_cost_gold	= data.BUY_COST_GOLD;
					base_item.buy_cost_cash	= data.BUY_COST_CASH;
					base_item.buy_cost_point= data.BUY_COST_POINT;
					base_item.sell_gold		= data.SELL_GOLD;
					base_item.equip_status_id	= data.EQUIP_STATUS_ID;
					// base_item.evolution_status_id= data.EVOLUTION_STATUS_ID;
					base_item.promotion_id	= data.REINFORCE_ID;
					base_item.hero_id		= data.HERO_ID;
					base_item.effect1_id	= data.EFFECT1_ID;
					base_item.effect1_value1= data.EFFECT1_VALUE1;
					base_item.effect1_value2= data.EFFECT1_VALUE2;
					base_item.effect2_id	= data.EFFECT2_ID;
					base_item.effect2_value1= data.EFFECT2_VALUE1;
					base_item.effect2_value2= data.EFFECT2_VALUE2;
					base_item.effect3_id	= data.EFFECT3_ID;
					base_item.effect3_value1= data.EFFECT3_VALUE1;
					base_item.effect3_value2= data.EFFECT3_VALUE2;

					BaseItemRe.inst.AddItem(data.ITEM_ID, base_item);
				}))
				.then(function () {
					logger.debug('=== Finish LoadItem ===');
					resolve();
				})
				.catch(p_error => { reject(p_error); });
			})
			.catch(p_error => {
				logger.error('Error LoadItem!!!!');
				reject(p_error);
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadItemEvolution = function (p_bt_item_evolution) {
		logger.debug('*** Start LoadItemEvolution ***');
		return new Promise(function (resolve, reject) {
			// BT_ITEM_EVOLUTION select
			return p_bt_item_evolution.findAll()
			.then(p_ret_evolution_list => {
				return Promise.all(p_ret_evolution_list.map(row => {
					var data = row.dataValues;
					// console.log('data -', data);

					var evolution = new BaseItemEvolutionRe.inst.BaseItemEvolution();
					evolution.step				= data.STEP;
					evolution.need_gold			= data.NEED_GOLD;
					evolution.need_item_id		= data.NEED_RESOURCE_ID;
					evolution.need_item_count	= data.NEED_RESOURCE_COUNT;
					
					BaseItemEvolutionRe.inst.AddItemEvolution(data.STEP, evolution);
				}))
				.then(function () {
					logger.debug('=== Finish LoadItemEvolution ===');
					resolve();
				})
				.catch(p_error => { reject(p_error); });
			})
			.catch(p_error => {
				logger.error('Error LoadItemEvolution!!!');
				reject(p_error);
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
