/********************************************************************
Title : BT_Buy
Date : 2016.01.13
Update : 2016.07.18
Desc : BT 로드 - Buy(구매)
writer: jong wook
********************************************************************/
var BaseBuyGoldRe = require('../../Data/Base/BaseBuyGoldRe.js');
var BaseBuyCashRe = require('../../Data/Base/BaseBuyCashRe.js');
var BaseBuyStaminaRe = require('../../Data/Base/BaseBuyStaminaRe.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadBuyGold = function (p_bt_buy_gold) {
		logger.debug('*** Start LoadBuyGold ***');

		// BT_BUY_GOLD select
		p_bt_buy_gold.findAll()
		.then( function (p_ret_gold) {
			for (var cnt in p_ret_gold) {
				(function (cnt) {
					// console.log('p_ret_gold[cnt] -', p_ret_gold[cnt].dataValues);
					var data = p_ret_gold[cnt].dataValues;

					var buy_gold		= new BaseBuyGoldRe.inst.BuyGold();
					buy_gold.count		= data.COUNT;
					buy_gold.need_cash	= data.NEED_CASH;
					buy_gold.gain_gold	= data.GAIN_GOLD;
					buy_gold.AddGambleRate(data.GAIN_GOLD_X1_RATE);
					buy_gold.AddGambleRate(data.GAIN_GOLD_X2_RATE);
					buy_gold.AddGambleRate(data.GAIN_GOLD_X5_RATE);
					buy_gold.AddGambleRate(data.GAIN_GOLD_X10_RATE);

					BaseBuyGoldRe.inst.AddBuyGold(data.COUNT, buy_gold);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadBuyGold!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadBuyStamina = function (p_bt_buy_stamina) {
		logger.debug('*** Start LoadBuyStamina ***');

		// BT_BUY_STAMINA select
		p_bt_buy_stamina.findAll()
		.then(function (p_ret_stamina) {
			for (var cnt in p_ret_stamina) {
				(function (cnt) {
					// console.log('p_ret_stamina[cnt] -', p_ret_stamina[cnt].dataValues);
					var data = p_ret_stamina[cnt].dataValues;

					var buy_stamina			= new BaseBuyStaminaRe.inst.BuyStamina();
					buy_stamina.count		= data.COUNT;
					buy_stamina.need_cash	= data.NEED_CASH;
					buy_stamina.gain_stamina= data.GAIN_STAMINA;

					BaseBuyStaminaRe.inst.AddBuyStamina(data.COUNT, buy_stamina);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadBuyStamina!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadBuyCash = function (p_bt_buy_cash) {
		logger.debug('*** Start LoadBuyCash ***');

		// BT_BUY_CASH select
		p_bt_buy_cash.findAll()
		.then(function (p_ret_cash) {
			for (var cnt in p_ret_cash) {
				(function (cnt) {
					// console.log('p_ret_cash[cnt] -', p_ret_cash[cnt].dataValues);
					var data = p_ret_cash[cnt].dataValues;

					var buy_cash			= new BaseBuyCashRe.inst.BuyCash();
					buy_cash.cash_id		= data.CASH_ID;
					buy_cash.gain_cash		= data.GAIN_CASH;
					buy_cash.daily_value	= data.DAILY_VALUE;
					buy_cash.daily_period	= data.DAILY_PERIOD;

					BaseBuyCashRe.inst.AddBuyCash(data.CASH_ID, buy_cash);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadBuyCash!!!!', p_error);
		});	
	}

	exports.inst = inst;

})(exports || global);
(exports || global).inst;
