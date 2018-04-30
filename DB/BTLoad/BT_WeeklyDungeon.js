/********************************************************************
Title : BT_WEEKLY_DUNGEON
Date : 2015.11.06
Update : 2016.08.08
Desc : BT 로더 - Challenge
writer: jong wook
********************************************************************/
var BaseWeeklyDungeon= require('../../Data/Base/BaseWeeklyDungeon.js');

(function (exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadWeeklyDungeon = function(p_bt_weekly_dungeon) {
		logger.debug('*** Start LoadBTWeeklyDungeon ***');
		
		// BT_CHALLENGE_STAGE select
		p_bt_weekly_dungeon.findAll({
			order : 'STAGE_ID asc'
		})
		.then(function (p_ret_stage) {
			for ( var cnt in p_ret_stage ) {
				var stage_data = p_ret_stage[cnt].dataValues;

				var weekly_dungeon	= new BaseWeeklyDungeon.inst.BaseWeeklyDungeon();
				var stage_id		= stage_data.STAGE_ID;

				
				weekly_dungeon.open_week 				= stage_data.OPEN_WEEK;
				weekly_dungeon.account_limit_open_level	= stage_data.OPEN_LV;
				weekly_dungeon.need_stamina 			= stage_data.STAMINA;
				weekly_dungeon.reward_account_exp 		= stage_data.REWARD_ACCOUNT_EXP;
				weekly_dungeon.reward_hero_exp 			= stage_data.REWARD_HERO_EXP;
				weekly_dungeon.reward_gold 				= stage_data.REWARD_GOLD;

				weekly_dungeon.AddRewardItem(stage_data.REWARD_ITEM1, stage_data.REWARD_ITEM1_COUNT);
				weekly_dungeon.AddRewardItem(stage_data.REWARD_ITEM2, stage_data.REWARD_ITEM2_COUNT);
				weekly_dungeon.AddRewardItem(stage_data.REWARD_ITEM3, stage_data.REWARD_ITEM3_COUNT);

				BaseWeeklyDungeon.inst.AddBaseWeeklyDungeon(stage_id, weekly_dungeon);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadBTWeeklyDungeon!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
