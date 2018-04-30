// /********************************************************************
// Title : 
// Date : 
// Desc : 
// writer: dongsu
// ********************************************************************/
var BasePVP = require('../../Data/Base/BasePVP.js');

(function (exports) {
	// public
	var inst = {};

	var LoadPvPReward = function(p_pvp_reward) {
		return new Promise((resolve, reject) => {
			p_pvp_reward.findAll()
			.then(p_rets => {
				p_rets.map(row => {
					let data 		= row.dataValues;
					let info 		= new BasePVP.inst.RewardInfo();
					
					info.league_id 	= data.LEAGUE_ID;
					info.reward_cycle 	= data.REWARD_CYCLE;
					info.min_range 	= data.RANK_MIN;
					info.max_range 	= data.RANK_MAX;
					info.is_per 		= data.IS_PERCENT;
					info.AddReward(1, data.REWARD1_TYPE, data.REWARD1_ID, data.REWARD1_COUNT );
					info.AddReward(2, data.REWARD2_TYPE, data.REWARD2_ID, data.REWARD2_COUNT );
					info.AddReward(3, data.REWARD3_TYPE, data.REWARD3_ID, data.REWARD3_COUNT );

					// console.log('확인용 - ', info);
					BasePVP.inst.AddPvPReward(info);
				})
			})
		});
	}

	var LoadPvPLeague = function(p_pvp_league) {
		return new Promise((resolve, reject) => {
			p_pvp_league.findAll()
			.then(p_rets => {
				p_rets.map(row => {
					var info 		= new BasePVP.inst.LeagueInfo();
					
					info.league_id 			= row.dataValues.LEAGUE_ID;
					info.league_up_point 		= row.dataValues.LEAGUE_UP_POINT;
					info.league_down_point 		= row.dataValues.LEAGUE_DOWN_POINT;
					info.league_down_point_week 	= row.dataValues.LEAGUE_DOWN_POINT_WEEK;
					info.gain_max_point 			= row.dataValues.GAIN_POINT_MAX;
					info.reward_honor_point 		= row.dataValues.REWARD_HONOR_POINT;
					info.daily_max_honor_point 		= row.dataValues.DAILY_MAX_HONOR_POINT;
					info.achievement_cash 		= row.dataValues.ACHIEVEMENT_CASH;
					info.achievement_homor_point 	= row.dataValues.ACHIEVEMENT_HONOR_POINT;
					info.reset_point_1 			= row.dataValues.RESET_RANK_POINT1;
					info.reset_point_2 			= row.dataValues.RESET_RANK_POINT2;
					info.reset_point_3 			= row.dataValues.RESET_RANK_POINT3;

					// console.log('확인용 - ', info);
					BasePVP.inst.AddLeague(info);
				})
			})
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadBTPVP = function (p_pvp_league, p_pvp_reward) {
		logger.debug('*** Start LoadBTPVP ***');
		return new Promise((resolve, reject) => {
			Promise.all([	LoadPvPReward(p_pvp_reward),
					LoadPvPLeague(p_pvp_league)])
			.then( values => {
				resolve();
			})
			.catch(p_error => { reject(p_error); });	
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
