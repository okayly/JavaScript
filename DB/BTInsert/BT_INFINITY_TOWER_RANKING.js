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

	inst.BT_INFINITY_TOWER_RANKING = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_INFINITY_TOWER_RANKING', {
			REWARD_ID: { type: sequelize_module.INTEGER, allowNull: false },
			RANK_MIN: { type: sequelize_module.INTEGER, allowNull: false },
			RANK_MAX: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD1_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD1_ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD1_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD2_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD2_ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD2_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD3_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD3_ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
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
							REWARD_ID: read.Rows[i].RewardID,
						},
						{
							REWARD_ID: read.Rows[i].RewardID,
							RANK_MIN: read.Rows[i].RankMin,
							RANK_MAX: read.Rows[i].RankMax,
							REWARD1_TYPE: read.Rows[i].Reward1_Type,
							REWARD1_ITEM_ID: read.Rows[i].Reward1_Item_ID,
							REWARD1_COUNT: read.Rows[i].Reward1_Count,
							REWARD2_TYPE: read.Rows[i].Reward2_Type,
							REWARD2_ITEM_ID: read.Rows[i].Reward2_Item_ID,
							REWARD2_COUNT: read.Rows[i].Reward2_Count,
							REWARD3_TYPE: read.Rows[i].Reward3_Type,
							REWARD3_ITEM_ID: read.Rows[i].Reward3_Item_ID,
							REWARD3_COUNT: read.Rows[i].Reward3_Count,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_INFINITY_TOWER_RANKING');
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