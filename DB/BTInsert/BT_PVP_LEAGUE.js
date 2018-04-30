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

	inst.BT_PVP_LEAGUE = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_PVP_LEAGUE', {
			LEAGUE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			LEAGUE_UP_POINT: { type: sequelize_module.INTEGER, allowNull: false },
			LEAGUE_DOWN_POINT: { type: sequelize_module.INTEGER, allowNull: false },
			LEAGUE_DOWN_POINT_WEEK: { type: sequelize_module.INTEGER, allowNull: false },
			GAIN_POINT_MAX: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_HONOR_POINT: { type: sequelize_module.INTEGER, allowNull: false },
			DAILY_MAX_HONOR_POINT: { type: sequelize_module.INTEGER, allowNull: false },
			RESET_RANK_POINT1: { type: sequelize_module.INTEGER, allowNull: false },
			RESET_RANK_POINT2: { type: sequelize_module.INTEGER, allowNull: false },
			RESET_RANK_POINT3: { type: sequelize_module.INTEGER, allowNull: false },
			ACHIEVEMENT_CASH: { type: sequelize_module.INTEGER, allowNull: false },
			ACHIEVEMENT_HONOR_POINT: { type: sequelize_module.INTEGER, allowNull: false },
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
							LEAGUE_ID: read.Rows[i].LeagueID,
						},
						{
							LEAGUE_ID: read.Rows[i].LeagueID,
							LEAGUE_UP_POINT: read.Rows[i].LeagueUpPoint,
							LEAGUE_DOWN_POINT: read.Rows[i].LeagueDownPoint,
							LEAGUE_DOWN_POINT_WEEK: read.Rows[i].LeagueDownPointWeek,
							GAIN_POINT_MAX: read.Rows[i].GainPointMax,
							REWARD_HONOR_POINT: read.Rows[i].RewardHonorPoint,
							DAILY_MAX_HONOR_POINT: read.Rows[i].DailyMaxHonorPoint,
							RESET_RANK_POINT1: read.Rows[i].ResetRankPoint1,
							RESET_RANK_POINT2: read.Rows[i].ResetRankPoint2,
							RESET_RANK_POINT3: read.Rows[i].ResetRankPoint3,
							ACHIEVEMENT_CASH: read.Rows[i].AchievementCash,
							ACHIEVEMENT_HONOR_POINT: read.Rows[i].AchievementHonorPoint,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_PVP_LEAGUE');
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