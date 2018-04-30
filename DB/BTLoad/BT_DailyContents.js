/********************************************************************
Title : BT_DailyContents
Date : 2016.04.26
Update : 2017.04.07
Desc : BT 로드 - DailyContents
writer: jong wook
********************************************************************/
var BaseDailyContents = require('../../Data/Base/BaseDailyContents.js');
var DefineValues = require('../../Common/DefineValues.js');

var moment = require('moment');

(function(exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadRewardInfinityTower = function(bt_reward) {
		logger.debug('*** Start LoadRewardInfinityTower ***');

		bt_reward.findAll()
		.then(function (p_ret_reward) {
			for (var cnt in p_ret_reward) {
				(function(cnt) {
					// console.log('p_ret_reward[cnt] -', p_ret_reward[cnt].dataValues);
					var data = p_ret_reward[cnt].dataValues;

					var reward = new BaseDailyContents.inst.RewardInfinityTower();
					reward.reward_id = data.REWARD_GROUP_ID;
					reward.mail_string_id = data.MAIL_STRING_ID;
					reward.rank_min = data.RANK_MIN;
					reward.rank_max = data.RANK_MAX;
					
					// RewardBox
					if (data.REWARD1_TYPE != DefineValues.inst.NotReward) {
						reward.AddReward(data.REWARD1_TYPE, data.REWARD1_ITEM_ID, data.REWARD1_COUNT);
					}

					if (data.REWARD2_TYPE != DefineValues.inst.NotReward) {
						reward.AddReward(data.REWARD2_TYPE, data.REWARD2_ITEM_ID, data.REWARD2_COUNT);
					}

					if (data.REWARD3_TYPE != DefineValues.inst.NotReward) {
						reward.AddReward(data.REWARD3_TYPE, data.REWARD3_ITEM_ID, data.REWARD3_COUNT);
					}

					
					BaseDailyContents.inst.SetRewardInfinityTower(data.REWARD_GROUP_ID, reward);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadRewardInfinityTower!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadRewardRankingMatch = function(bt_reward) {
		logger.debug('*** Start LoadRewardRankingMatch ***');

		bt_reward.findAll()
		.then(function (p_ret_reward) {
			for (var cnt in p_ret_reward) {
				(function(cnt) {
					// console.log('p_ret_reward[cnt] -', p_ret_reward[cnt].dataValues);
					var data = p_ret_reward[cnt].dataValues;

					var reward = new BaseDailyContents.inst.RewardRankingMatch();
					reward.reward_id = data.REWARD_GROUP_ID;
					reward.mail_string_id = data.MAIL_STRING_ID;
					reward.rank_min = data.RANK_MIN;
					reward.rank_max = data.RANK_MAX;
					
					// RewardBox
					if (data.REWARD1_TYPE != DefineValues.inst.NotReward) {
						reward.AddReward(data.REWARD1_TYPE, data.REWARD1_ITEM_ID, data.REWARD1_COUNT);
					}

					if (data.REWARD2_TYPE != DefineValues.inst.NotReward) {
						reward.AddReward(data.REWARD2_TYPE, data.REWARD2_ITEM_ID, data.REWARD2_COUNT);
					}

					if (data.REWARD3_TYPE != DefineValues.inst.NotReward) {
						reward.AddReward(data.REWARD3_TYPE, data.REWARD3_ITEM_ID, data.REWARD3_COUNT);
					}

					
					BaseDailyContents.inst.SetRewardRankingMatch(data.REWARD_GROUP_ID, reward);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadRewardRankingMatch!!!!', p_error);
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
