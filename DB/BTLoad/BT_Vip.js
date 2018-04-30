/********************************************************************
Title : BT_Vip
Date : 2016.01.14
update : 2016.08.09
Desc : BT 로더 - VIP
writer: jong wook
********************************************************************/
var BaseVipRe = require('../../Data/Base/BaseVipRe.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadVip = function (p_bt_vip) {
		logger.debug('*** Start LoadVip ***');

		p_bt_vip.findAll( {
			order : 'STEP'
		}).success( function (p_ret_vip) {
			for (var cnt in p_ret_vip) {
				(function (cnt) {
					// console.log('p_ret_vip[cnt] -', p_ret_vip[cnt].dataValues);
					var data = p_ret_vip[cnt].dataValues;

					var vip						= new BaseVipRe.inst.Vip();
					vip.vip_id					= data.VIP_ID;
					vip.vip_step				= data.STEP;
					vip.accum_cash				= data.ACCUM_CASH;
					vip.max_buy_stamina_count	= data.MAX_BUY_STAMINA_COUNT;
					vip.max_buy_gold_count		= data.MAX_BUY_GOLD_COUNT;
					vip.max_buy_add_attend_count= data.MAX_BUY_ADD_ATTEND_COUNT;
					vip.skill_point_charge_time	= data.SKILL_POINT_CHARGE_TIME;
					vip.skill_point_charge_count= data.SKILL_POINT_CHARGE_COUNT;
					vip.vip_gacha				= data.VIP_GACHA;

					vip.infinity_tower_all_skip_bonus_percent	= data.INFINITY_SKIP_LIMIT;
					vip.infinity_tower_skip_limit				= data.INFINITY_SKIP_BONUS;
					vip.infinity_tower_skip_vip_bonus_point		= data.INFINITY_TOWER_ALL_SKIP_BONUS_REWARD;

					for (var cnt_reward = 1; cnt_reward <=5; ++cnt_reward) {
						var reward_item				= new BaseVipRe.inst.RewardItem();
						reward_item.reward_type		= data['REWARD' + cnt_reward + '_TYPE'];
						reward_item.reward_id		= data['REWARD' + cnt_reward + '_ITEM_ID'];
						reward_item.reward_count	= data['REWARD' + cnt_reward + '_COUNT'];

						vip.AddRewardItem(reward_item);
					}

					BaseVipRe.inst.AddVip(data.STEP, vip);
				})(cnt);
			}
		})
		.error ( function (reason) {
			logger.error('Error LoadVip!!!!');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
