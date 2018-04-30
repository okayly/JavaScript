//----------------------------------------------
//         Excel2Json Unity integration
//         Copyright (C) 2016 Pocatcom
//
//        This file has been auto-generated
//              Do not manually edit
//----------------------------------------------

var fp = require('fs');

(function (exports) {
	// private instance
	var base_table;
	// public instance
	var inst = {};

	inst.BT_REWARD_RANKING = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_REWARD_RANKING', {
			REWARD_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
			LEAGUE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_CYCLE: { type: sequelize_module.INTEGER, allowNull: false },
			RANK_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			IS_PERCENT: { type: sequelize_module.BOOLEAN, allowNull: false },
			RANK_MIN: { type: sequelize_module.INTEGER, allowNull: false },
			RANK_MAX: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD1_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD1_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD1_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD2_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD2_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD2_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD3_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD3_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD3_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
		}, { timestamps: false });

		base_table.sync({ force: true })
		.success(function () {
			fp.readFile(path, 'utf8', function (err, data) {
				if (err) {
					logger.error(err);
					throw err;
				}

				var read = JSON.parse(data);
				for (var i in read.Rows) {
					(function (i) {
						base_table.findOrCreate({
							REWARD_GROUP_ID: read.Rows[i].RewardGroupID,
						},
						{
							REWARD_GROUP_ID: read.Rows[i].RewardGroupID,
							LEAGUE_ID: read.Rows[i].LeagueID,
							REWARD_CYCLE: read.Rows[i].RewardCycle,
							RANK_TYPE: read.Rows[i].RankType,
							IS_PERCENT: read.Rows[i].IsPercent,
							RANK_MIN: read.Rows[i].Rank_MIN,
							RANK_MAX: read.Rows[i].Rank_MAX,
							REWARD1_TYPE: read.Rows[i].Reward1_Type,
							REWARD1_ID: read.Rows[i].Reward1_ID,
							REWARD1_COUNT: read.Rows[i].Reward1_Count,
							REWARD2_TYPE: read.Rows[i].Reward2_Type,
							REWARD2_ID: read.Rows[i].Reward2_ID,
							REWARD2_COUNT: read.Rows[i].Reward2_Count,
							REWARD3_TYPE: read.Rows[i].Reward3_Type,
							REWARD3_ID: read.Rows[i].Reward3_ID,
							REWARD3_COUNT: read.Rows[i].Reward3_Count,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_REWARD_RANKING');
						})
						.error(function (err) {
							console.log(err);
						});
					})(i);
				}
			});
		})
		.error(function (err) {
			console.log(err);
		});
	}

	inst.GetBT = function() { return base_table; }

	exports.inst = inst;
})(exports || global);
(exports || global).inst;