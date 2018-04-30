/********************************************************************
Title : BT_Shop
Date : 2016.01.18
Update : 2016.07.22
Desc : BT 로드 - 샵 아이템 목록
writer: jong wook
********************************************************************/
var DefineValues = require('../../Common/DefineValues.js');

var BaseShopRe = require('../../Data/Base/BaseShopRe.js');
var BaseItemRe = require('../../Data/Base/BaseItemRe.js');

var util = require('util');

(function(exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadShop = function(p_bt_normal, p_bt_guild, p_bt_pvp, p_bt_random, p_bt_challenge, p_bt_time, p_bt_hero_exp, p_bt_reset_cost) {
		logger.debug('*** Start LoadShop ***');

		LoadShopTable(p_bt_normal, DefineValues.inst.NormalShop);
		LoadShopTable(p_bt_pvp, DefineValues.inst.PvpShop);
		LoadShopTable(p_bt_guild, DefineValues.inst.GuildShop);
		LoadShopTable(p_bt_random, DefineValues.inst.RandomShop);
		LoadShopTable(p_bt_challenge, DefineValues.inst.ChallengeShop);

		LoadShopTimeTable(p_bt_time);
		LoadShopHeroExpTable(p_bt_hero_exp);
		LoadShopResetCost(p_bt_reset_cost);
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadShopTable = function(p_bt, p_shop_type) {
		// BT_SHOP_NORMAL, BT_SHOP_GUILD, BT_SHOP_PVP, BT_SHOP_RANDOM, BT_SHOP_CHALLENGE
		p_bt.findAll({
			order: 'SHOP_ID'
		}).then( function (p_ret_shop) {
			for ( var cnt in p_ret_shop ) {
				(function (cnt) {
					// console.log('p_ret_shop[cnt] -', p_ret_shop[cnt].dataValues);
					var data = p_ret_shop[cnt].dataValues;

					var shop		= new BaseShopRe.inst.Shop();
					shop.shop_id	= data.SHOP_ID;
					shop.level_min	= data.USER_LEVEL_MIN;
					shop.level_max	= data.USER_LEVEL_MAX;

					for ( var cnt = 0; cnt < DefineValues.inst.MaxShopItemCount; ++cnt ) {
						var item_id			= data[util.format('ITEM%d_ID', cnt + 1)];
						var buy_cost_type	= data[util.format('ITEM%d_BUY_COST_TYPE', cnt + 1)];
						var item_count		= data[util.format('ITEM%d_COUNT', cnt + 1)];
						
						shop.AddShopItem(item_id, buy_cost_type, item_count);
					}

					BaseShopRe.inst.AddShop(p_shop_type, data.SHOP_ID, shop);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('error LoadShopTable!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadShopTimeTable = function(p_bt_shop_time) {
		// BT_SHOP_TIME select
		p_bt_shop_time.findAll({
			order: 'RESET_TIME'
		}).then(function (p_ret_time) {
			for ( var cnt in p_ret_time ) {
				(function(cnt) {
					// console.log('p_ret_time[cnt] -', p_ret_time[cnt].dataValues);
					var data = p_ret_time[cnt].dataValues;

					var shop_time		= new BaseShopRe.inst.ShopTime();
					shop_time.time_id	= data.TIME_ID;
					shop_time.reset_time= data.RESET_TIME;

					BaseShopRe.inst.AddShopTime(data.TIME_ID, shop_time);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('error LoadShopTimeTable!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadShopHeroExpTable = function(p_bt_hero_exp) {
		// BT_SHOP_HERO_EXP select - 이 함수는 BaseItem 이 먼저 로드 된 후에 처리 되어야 한다.
		p_bt_hero_exp.findAll({
			order: 'ITEM_ID'
		}).then(function (p_hero_exp) {
			for ( var cnt in p_hero_exp ) {
				(function(cnt) {
					// console.log('p_hero_exp[cnt] -', p_hero_exp[cnt].dataValues);
					var data = p_hero_exp[cnt].dataValues;

					var shop_hero_exp = new BaseShopRe.inst.ShopHeroExp();
					var item_base = BaseItemRe.inst.GetItem(data.ITEM_ID);
					if ( typeof item_base != 'undefined' ) {
						shop_hero_exp.item_id		= data.ITEM_ID;
						shop_hero_exp.need_cash		= item_base.buy_cost_cash;
						shop_hero_exp.limit_level	= data.LIMIT_USER_LEVEL;

						BaseShopRe.inst.AddShopHeroExp(parseInt(data.ITEM_ID), shop_hero_exp);
					} else {
						logger.error('error Hero exp item', data.ITEM_ID);
					}
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('error LoadShopHeroExpTable!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var LoadShopResetCost = function(p_bt_reset_cost) {
		// BT_SHOP_RESET_COST select
		p_bt_reset_cost.findAll({
			order: 'RESET_COUNT'
		}).then(function (p_reset_cost) {
			for ( var cnt in p_reset_cost ) {
				(function(cnt) {
					// console.log('p_reset_cost[cnt] -', p_reset_cost[cnt].dataValues);
					var data = p_reset_cost[cnt].dataValues;

					var reset_cost			= new BaseShopRe.inst.ShopResetCost();
					reset_cost.reset_count	= data.RESET_COUNT;					
					reset_cost.need_cash	= data.NEED_CASH;

					BaseShopRe.inst.AddShopResetCost(data.RESET_COUNT, reset_cost);					
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('error LoadShopResetCost!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
