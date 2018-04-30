/********************************************************************
Title : BT_BuyCount
Date : 2017.02.07
Update : 2017.02.07
Desc : BT 로드 - 구매 횟수 필요 캐쉬
writer: jong wook
********************************************************************/
var BaseBuyCount = require('../../Data/Base/BaseBuyCount.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadBuyCount = function (p_bt_buy_count) {
		logger.debug('*** Start LoadBuyCount ***');

		var getBuyCount = function() {
			return new Promise(function (resolve, reject) {
				// BT_ITEM_EQUIP_STATUS select
				p_bt_buy_count.findAll()
				.then(p_buy_count_list => { resolve(p_buy_count_list); })
				.catch(p_error => { reject(p_error); });
			});
		}

		// Promise GO!
		getBuyCount()
		.then(p_buy_count_list => {
			for ( let cnt in p_buy_count_list ) {
				(function (cnt) {
					// console.log('p_buy_count_list[cnt] -', p_buy_count_list[cnt].dataValues.ITEM_ID);
					let data_status = p_buy_count_list[cnt].dataValues;

					let buy_count = new BaseBuyCount.inst.BaseBuyCount();

					buy_count.count							= data_status.COUNT;
					buy_count.inventory_slot_count			= data_status.INVENTORY_SLOT_CNT;
					buy_count.need_inventory_slot_cash		= data_status.INVENTORY_SLOT_COST;
					buy_count.need_prophcy_spring_join_cash	= data_status.PROPHCY_SPRING_JOIN_COST;

					BaseBuyCount.inst.AddBuyCount(data_status.COUNT, buy_count);
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
