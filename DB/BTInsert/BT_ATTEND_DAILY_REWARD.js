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

	inst.BT_ATTEND_DAILY_REWARD = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_ATTEND_DAILY_REWARD', {
			REWARD_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ATTEND_MONTH: { type: sequelize_module.INTEGER, allowNull: false },
			ATTEND_DATE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			VIP_STEP_MIN: { type: sequelize_module.INTEGER, allowNull: false },
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
							ATTEND_MONTH: read.Rows[i].AttendMonth,
							ATTEND_DATE: read.Rows[i].AttendDate,
							REWARD_TYPE: read.Rows[i].RewardType,
							REWARD_ITEM_ID: read.Rows[i].RewardItemID,
							REWARD_COUNT: read.Rows[i].RewardCount,
							VIP_STEP_MIN: read.Rows[i].VipStep_Min,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_ATTEND_DAILY_REWARD');
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