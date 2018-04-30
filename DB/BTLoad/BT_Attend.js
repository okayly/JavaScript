/********************************************************************
Title : BT_Attend
Date : 2016.03.03
Update : 2016.07.25
Desc : BT 로드 - 출석 보상
writer: jong wook
********************************************************************/
var BaseAttendRe = require('../../Data/Base/BaseAttendRe.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadAttendDaily = function (p_bt_daily) {
		logger.debug('*** Start LoadAttendDaily ***');

		// BT_ATTEND_DAILY_REWARD select
		p_bt_daily.findAll({
			order : 'REWARD_ID'
		})
		.then(function (p_ret_daily) {
			for ( var cnt in p_ret_daily ) {
				(function (cnt) {
					// console.log('p_ret_daily[cnt] -', p_ret_daily[cnt].dataValues);
					var data = p_ret_daily[cnt].dataValues;
					
					var reward_index = 1;	// ??? 이게 머에 쓰이는지 모르겠다. 
					var attend_daily = new BaseAttendRe.inst.BaseAttendDaily();
					attend_daily.reward_2x_vip_step	= data.VIP_STEP_MIN;
					attend_daily.AddReward(reward_index, data.REWARD_TYPE, data.REWARD_ITEM_ID, data.REWARD_COUNT);

					BaseAttendRe.inst.AddAttendDailyReward(data.ATTEND_MONTH, data.ATTEND_DATE, attend_daily);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadAttendDaily!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadAddAttendCost = function (p_add_attend) {
		logger.debug('*** Start LoadAddAttendCost ***');

		// BT_ATTEND_ADD_COST
		p_add_attend.findAll()
		.then(function (p_ret_attend_add_cost) {
			for ( var cnt in p_ret_attend_add_cost ) {
				(function (cnt) {
					// console.log('p_ret_attend_add_cost[cnt] -', p_ret_attend_add_cost[cnt].dataValues);
					var data = p_ret_attend_add_cost[cnt].dataValues;
					BaseAttendRe.inst.AddAddAttendNeedCash(data.ATTEND_ADD_COUNT, data.NEED_CASH);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadAddAttendCost!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadAttendAccum = function (p_bt_accum) {
		logger.debug('*** Start LoadAttendAccum ***');

		// BT_ATTEND_ACCUM_REWARD select
		p_bt_accum.findAll({
			order : 'ATTEND_MONTH, ATTEND_ACCUM_DATE'
		})
		.then(function (p_ret_accum) {
			for ( var cnt in p_ret_accum ) {
				(function (cnt) {
					// console.log('p_ret_accum[cnt] -', p_ret_accum[cnt].dataValues);
					var data = p_ret_accum[cnt].dataValues;

					var accum_attend = BaseAttendRe.inst.GetBaseAccumAttendReward(data.ATTEND_MONTH);
					if ( typeof accum_attend === 'undefined' ) {
						accum_attend = new BaseAttendRe.inst.BaseAccumAttendReward();
						BaseAttendRe.inst.AddBaseAccumAttendReward(data.ATTEND_MONTH, accum_attend);
					}
					accum_attend.AddAccumDate(data.ATTEND_ACCUM_DATE, data.REWARD_TYPE, data.REWARD_ITEM_ID, data.REWARD_COUNT);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadAttendAccum!!!!', p_error);
		});
	}

	exports.inst = inst;

})(exports || global);
(exports || global).inst;
