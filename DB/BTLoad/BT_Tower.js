/********************************************************************
Title : BT_Tower
Date : 2016.04.05
Update : 2017.04.07
Desc : BT 로드 - 무한탑
writer : jong wook
********************************************************************/
var GTMgr = require('../GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseTower = require('../../Data/Base/BaseTower.js');

var Timer = require('../../Utils/Timer.js');

(function(exports) {
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadTower = function(p_bt_tower) {
		logger.debug('*** Start LoadTower ***');

		// BT_INFINITY_TOWER_BASE select
		p_bt_tower.findAll()
		.then(function (p_ret_tower) {
			for ( var cnt in p_ret_tower ) {
				(function (cnt) {
					// console.log('p_ret_tower[cnt] -', p_ret_tower[cnt].dataValues);
					var tower_data = p_ret_tower[cnt].dataValues;

					var tower = new BaseTower.inst.Tower();
					tower.tower_id	= tower_data.INFINITY_TOWER_ID;
					tower.floor		= tower_data.TOWER_FLOOR;
					tower.floor_type= tower_data.FLOOR_TYPE;

					// BattleReward - ticket, awake
					tower.AddBattleReward(DefineValues.inst.InfinityTowerBattleLow,		tower_data.LOW_REWARD_TICKET,		tower_data.LOW_REWARD_SCORE);
					tower.AddBattleReward(DefineValues.inst.InfinityTowerBattleMiddle,	tower_data.MIDDLE_REWARD_TICKET,	tower_data.MIDDLE_REWARD_SCORE);
					tower.AddBattleReward(DefineValues.inst.InfinityTowerBattleHigh,		tower_data.HIGH_REWARD_TICKET,		tower_data.HIGH_REWARD_SCORE);
					tower.AddBattleReward(DefineValues.inst.InfinityTowerBattleAwake,		tower_data.AWAKE_REWARD_TICKET,		tower_data.AWAKE_REWARD_SCORE);

					// AwakeBattleReward - challenge point
					tower.awake_reward_challenge_point = tower_data.AWAKE_REWARD_CHALLENGE_POINT;

					// RewardBox
					if (tower_data.BOX1_REWARD_TYPE != DefineValues.inst.NotReward) { 
						tower.AddRewardBox(tower_data.BOX1_REWARD_TYPE, tower_data.BOX1_REWARD_ITEM_ID, tower_data.BOX1_REWARD_COUNT);
					}

					if (tower_data.BOX2_REWARD_TYPE != DefineValues.inst.NotReward) { 
						tower.AddRewardBox(tower_data.BOX2_REWARD_TYPE, tower_data.BOX2_REWARD_ITEM_ID, tower_data.BOX2_REWARD_COUNT);
					}

					if (tower_data.BOX3_REWARD_TYPE != DefineValues.inst.NotReward) { 
						tower.AddRewardBox(tower_data.BOX3_REWARD_TYPE, tower_data.BOX3_REWARD_ITEM_ID, tower_data.BOX3_REWARD_COUNT);
					}

					// BuffShop buff group id
					if (tower_data.BUFF_SHOP1_GROUP_ID != 0) {
						tower.buff_group_id_list.push(tower_data.BUFF_SHOP1_GROUP_ID);
					}

					if (tower_data.BUFF_SHOP2_GROUP_ID != 0) {
						tower.buff_group_id_list.push(tower_data.BUFF_SHOP2_GROUP_ID);
					}

					if (tower_data.BUFF_SHOP3_GROUP_ID != 0) {
						tower.buff_group_id_list.push(tower_data.BUFF_SHOP3_GROUP_ID);
					}

					// SecretMaze buff id
					if (tower_data.SECRET_MAZE1_BUFF_ID != 0) {
						tower.secret_maze_buff_id_list.push(tower_data.SECRET_MAZE1_BUFF_ID);
					}

					if (tower_data.SECRET_MAZE2_BUFF_ID != 0) {
						tower.secret_maze_buff_id_list.push(tower_data.SECRET_MAZE2_BUFF_ID);
					}

					if (tower_data.SECRET_MAZE3_BUFF_ID != 0) {
						tower.secret_maze_buff_id_list.push(tower_data.SECRET_MAZE3_BUFF_ID);
					}


					BaseTower.inst.AddTowerFloor(tower_data.TOWER_FLOOR, tower);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadTower!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadTowerBuffList = function(p_bt_tower_buff_list) {
		logger.debug('*** Start LoadTowerBuffList ***');

		// BT_INFINITY_TOWER_BUFF select
		p_bt_tower_buff_list.findAll()
		.then(function (p_ret_buff) {
			for ( var cnt in p_ret_buff ) {
				(function (cnt) {
					// console.log('p_ret_buff[cnt] -', p_ret_buff[cnt].dataValues);
					var buff_data = p_ret_buff[cnt].dataValues;

					var buff_list			= new BaseTower.inst.BuffList();
					buff_list.buff_id		= buff_data.BUFF_ID;
					buff_list.need_ticket	= buff_data.NEED_TICKET;

					BaseTower.inst.AddBuffList(buff_data.BUFF_ID, buff_list);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadTowerBuffList!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadTowerCashRewardBox = function(p_bt_tower_cash_reward_box) {
		logger.debug('*** Start LoadTowerCashRewardBox ***');

		// BT_INFINITY_TOWER_CASH select
		p_bt_tower_cash_reward_box.findAll()
		.then(function (p_ret_cash_reward_box) {
			for ( var cnt in p_ret_cash_reward_box ) {
				(function (cnt) {
					// console.log('p_ret_cash_reward_box[cnt] -', p_ret_cash_reward_box[cnt].dataValues);
					var cash_data = p_ret_cash_reward_box[cnt].dataValues;

					var cash_reward_box					= new BaseTower.inst.CashRewardBox();
					cash_reward_box.buy_count			= cash_data.BUY_COUNT;
					cash_reward_box.need_cash			= cash_data.NEED_CASH;
					cash_reward_box.randombox_item_id	= cash_data.RANDOMBOX_ITEM_ID;

					BaseTower.inst.AddCashRewardBox(cash_data.BUY_COUNT, cash_reward_box);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadTowerCashRewardBox!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadTowerBattleSkip = function(p_bt_tower_battle_skip) {
		logger.debug('*** Start LoadTowerBattleSkip ***');

		// BT_INFINITY_TOWER_SKIP select
		p_bt_tower_battle_skip.findAll()
		.then(function (p_ret_battle_skip) {
			for ( var cnt in p_ret_battle_skip ) {
				(function (cnt) {
					// console.log('p_ret_battle_skip[cnt] -', p_ret_battle_skip[cnt].dataValues);
					var skip_data = p_ret_battle_skip[cnt].dataValues;

					BaseTower.inst.AddBattleSkipMaxFloor(skip_data.BATTLE_SKIP_COUNT, skip_data.MAX_BATTLE_SKIP_FLOOR);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadTowerBattleSkip!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadTowerAccumScoreReward = function(p_bt_accum_score_reward) {
		logger.debug('*** Start LoadTowerAccumScoreReward ***');

		// BT_INFINITY_TOWER_ACCUM_SCORE_REWARD select
		p_bt_accum_score_reward.findAll()
		.then(function (p_ret_reward) {
			for ( var cnt in p_ret_reward ) {
				(function (cnt) {
					// console.log('p_ret_reward[cnt] -', p_ret_reward[cnt].dataValues);
					var reward_data = p_ret_reward[cnt].dataValues;

					var accum_score_reward				= new BaseTower.inst.AccumScoreReward();
					accum_score_reward.score_reward_id	= reward_data.SCORE_REWARD_ID;
					accum_score_reward.accum_score		= reward_data.SCORE;

					// RewardBox
					if (reward_data.REWARD1_TYPE != DefineValues.inst.NotReward) { 
						accum_score_reward.AddReward(reward_data.REWARD1_TYPE, reward_data.REWARD1_ITEM_ID, reward_data.REWARD1_COUNT);
					}

					if (reward_data.REWARD2_TYPE != DefineValues.inst.NotReward) { 
						accum_score_reward.AddReward(reward_data.REWARD2_TYPE, reward_data.REWARD2_ITEM_ID, reward_data.REWARD2_COUNT);
					}

					if (reward_data.REWARD3_TYPE != DefineValues.inst.NotReward) { 
						accum_score_reward.AddReward(reward_data.REWARD3_TYPE, reward_data.REWARD3_ITEM_ID, reward_data.REWARD3_COUNT);
					}

					if (reward_data.REWARD4_TYPE != DefineValues.inst.NotReward) { 
						accum_score_reward.AddReward(reward_data.REWARD4_TYPE, reward_data.REWARD4_ITEM_ID, reward_data.REWARD4_COUNT);
					}					

					BaseTower.inst.AddAccumScoreReward(reward_data.SCORE_REWARD_ID, reward_data.SCORE, accum_score_reward);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadTowerAccumScoreReward!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadTowerRankReward = function(p_bt_reward_tower) {
		logger.debug('*** Start LoadTowerRankReward ***');

		// BT_REWARD_INFINITY_TOWER select
		p_bt_reward_tower.findAll()
		.then(function (p_ret_reward) {
			for ( var cnt in p_ret_reward ) {
				(function (cnt) {
					// console.log('p_ret_reward[cnt] -', p_ret_reward[cnt].dataValues);
					var data = p_ret_reward[cnt].dataValues;

					var rank_reward				= new BaseTower.inst.RankReward();
					rank_reward.reward_id		= data.REWARD_GROUP_ID;
					rank_reward.mail_string_id	= data.MAIL_STRING_ID;
					rank_reward.rank_min		= data.RANK_MIN;
					rank_reward.rank_max		= data.RANK_MAX;
					
					// RewardBox
					if (data.REWARD1_TYPE != DefineValues.inst.NotReward) rank_reward.AddReward(data.REWARD1_TYPE, data.REWARD1_ITEM_ID, data.REWARD1_COUNT);
					if (data.REWARD2_TYPE != DefineValues.inst.NotReward) rank_reward.AddReward(data.REWARD2_TYPE, data.REWARD2_ITEM_ID, data.REWARD2_COUNT);
					if (data.REWARD3_TYPE != DefineValues.inst.NotReward) rank_reward.AddReward(data.REWARD3_TYPE, data.REWARD3_ITEM_ID, data.REWARD3_COUNT);

					// console.log('rank_reward', rank_reward);
					
					BaseTower.inst.AddRankReward(data.REWARD_GROUP_ID, rank_reward);
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadTowerRankReward!!!!', p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadTowerBotRanker = function(p_bt_bot_ranker) {
		logger.debug('*** Start LoadTowerBotRanker ***');

		// BT_INFINITY_TOWER_BOT_RANKER select - 랭크를 구하기 위해서 BT의 BOT 정보를 GT에 insert 또는 update
		p_bt_bot_ranker.findAll({
			order : 'RANK_ID'
		})
		.then(function (p_ret_ranker_list) {
			var str_now = Timer.inst.GetNowByStrDate();

			for ( var cnt in p_ret_ranker_list ) {
				(function (cnt) {
					var ranker_data = p_ret_ranker_list[cnt].dataValues;
					// console.log('data', data);
					GTMgr.inst.GetGTInfinityTowerUser().find({
						where: { BOT_RANK_ID : ranker_data.RANK_ID }
					})
					.then(function (p_ret_tower_user) {
						if ( p_ret_tower_user == null ) {
							// GT_INFINITY_TOWER_USER insert
							GTMgr.inst.GetGTInfinityTowerUser().create({
								UUID			: 0,
								RECORD_TYPE		: 'PAST',
								BOT_RANK_ID		: ranker_data.RANK_ID,
								LAST_FLOOR		: ranker_data.CLEAR_FLOOR,
								LAST_RANK_SCORE	: ranker_data.CLEAR_SCORE,
								LAST_DATE		: str_now,
								REG_DATE		: str_now
							})
							.then(function (p_ret_tower_user_create) {
								// logger.info('Tower rankder create');
							})
							.catch(function (p_error){
								logger.error('error GTMgr.inst.GetGTInfinityTowerUser().create', p_error);
							});
						} else {
							// GT_INFINITY_TOWER_USER update
							p_ret_tower_user.updateAttributes({
								BOT_RANK_ID		: ranker_data.RANK_ID,
								LAST_FLOOR		: ranker_data.CLEAR_FLOOR,
								LAST_RANK_SCORE	: ranker_data.CLEAR_SCORE
							})
							.then(function (p_ret_tower_user_update) {
								// logger.info('Tower rankder update');
							})
							.catch(function (p_error) {
								logger.error('error p_ret_tower_user.updateAttributes', p_error);
							});
						}
					})
					.catch(function (p_error) {
						logger.error('error GTMgr.inst.GetGTInfinityTowerUser().find', p_error);
					});
				})(cnt);
			}
		})
		.catch(function (p_error) {
			logger.error('Error LoadTowerBotRanker!!!!', p_error);
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
