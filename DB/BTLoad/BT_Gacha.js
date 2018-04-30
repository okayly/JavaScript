/********************************************************************
Title : BT_GACHA
Date : 2016.07.04
Update : 2017.04.13
Desc : BT 로드 - 가챠정보
writer: dongsu -> jongwook
********************************************************************/
var BaseGachaRe = require('../../Data/Base/BaseGachaRe.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadGacha = function (p_bt_gacha, p_bt_normal, p_bt_premium, p_bt_preminu_first, p_bt_vip) {
		logger.debug('*** Start LoadGacha ***');

		// BT_GACHA select
		p_bt_gacha.findAll({
			order : 'GACHA_ID'
		}).then(ret => {
			for ( let i in ret ) {
				(function (i) {
					// BaseGachaRe
					let base_gacha = new BaseGachaRe.inst.BaseGacha();
					base_gacha.gacha_id						= ret[i].GACHA_ID;
					base_gacha.vip_gacha					= ret[i].VIP_GACHA;
					base_gacha.price_type					= ret[i].GACHA_TYPE;
					base_gacha.price						= ret[i].GACHA_VALUE;
					base_gacha.exec_count					= ret[i].GACHA_COUNT;
					base_gacha.daily_free_exec_count		= ret[i].GACHA_FREE;
					base_gacha.free_exec_delay_time_for_sec	= ret[i].GACHA_COOLTIME;
					base_gacha.chance_count					= ret[i].CHANCE_COUNT;		// 확정 가차가 발동 하는 번째.
					base_gacha.chance_value					= ret[i].CHANCE_VALUE;		// 확정 가차시 주는 보상 수.
					base_gacha.chance_item_type				= ret[i].CHANCE_ITEM;	// 확정 가차시 주는 아이템 타입.

					BaseGachaRe.inst.AddBaseGacha(ret[i].GACHA_ID, base_gacha);

					let bt_obj = undefined;
					switch(ret[i].GACHA_REFERENCE) {
						case 'BT_GACHA_NORMAL' :		bt_obj = p_bt_normal; break;
						case 'BT_GACHA_PREMIUM' :		bt_obj = p_bt_premium; break;
						case 'BT_GACHA_PREMIUM_FIRST' :	bt_obj = p_bt_preminu_first; break;
						case 'BT_GACHA_VIP' :			bt_obj = p_bt_vip; break;
						default :
							logger.error('LoadGacha - unKnow reference table -', ret[i].GACHA_REFERENCE);
							break;
					}

					if ( typeof bt_obj !=='undefined' ) {
						bt_obj.findAll({
							order: 'ITEM_TYPE, ITEM_ID'
						})
						.then(p_item => {
							for ( let cnt in p_item ) {
								(function (cnt) {
									let gacha_item = new BaseGachaRe.inst.GachaItem();
									gacha_item.item_id			= p_item[cnt].ITEM_ID;
									gacha_item.item_type		= p_item[cnt].ITEM_TYPE;
									gacha_item.count_range_min	= p_item[cnt].VALUE_MIN; // 지급 최소 수.
									gacha_item.count_range_max	= p_item[cnt].VALUE_MAX; // 지급 최대 수.
									gacha_item.percent			= p_item[cnt].PERCENT;

									base_gacha.AddNormalGachaItemGroup(p_item[cnt].ITEM_ID, gacha_item);
									base_gacha.AddChanceGachaItemGroup(p_item[cnt].ITEM_TYPE, p_item[cnt].ITEM_ID, gacha_item);
								})(cnt);
							}
						})
						.catch(p_error => {
							logger.error('Load GachaItem %s -', ret[i].GACHA_REFERENCE, p_error);
						});
					}
				})(i);
			}
		})
		.catch(p_error => {
			logger.error('Error LoadGacha!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
