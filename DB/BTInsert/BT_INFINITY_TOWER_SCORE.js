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

	inst.BT_INFINITY_TOWER_SCORE = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_INFINITY_TOWER_SCORE', {
			SCORE_REWARD_ID: { type: sequelize_module.INTEGER, allowNull: false },
			SCORE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD1_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD1_ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD1_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD2_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD2_ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD2_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD3_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD3_ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD3_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD4_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD4_ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD4_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
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
							SCORE_REWARD_ID: read.Rows[i].ScoreRewardID,
							SCORE: read.Rows[i].Score,
						},
						{
							SCORE_REWARD_ID: read.Rows[i].ScoreRewardID,
							SCORE: read.Rows[i].Score,
							REWARD1_TYPE: read.Rows[i].Reward1_Type,
							REWARD1_ITEM_ID: read.Rows[i].Reward1_ItemID,
							REWARD1_COUNT: read.Rows[i].Reward1_Count,
							REWARD2_TYPE: read.Rows[i].Reward2_Type,
							REWARD2_ITEM_ID: read.Rows[i].Reward2_ItemID,
							REWARD2_COUNT: read.Rows[i].Reward2_Count,
							REWARD3_TYPE: read.Rows[i].Reward3_Type,
							REWARD3_ITEM_ID: read.Rows[i].Reward3_ItemID,
							REWARD3_COUNT: read.Rows[i].Reward3_Count,
							REWARD4_TYPE: read.Rows[i].Reward4_Type,
							REWARD4_ITEM_ID: read.Rows[i].Reward4_ItemID,
							REWARD4_COUNT: read.Rows[i].Reward4_Count,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_INFINITY_TOWER_SCORE');
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