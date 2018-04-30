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

	inst.BT_GUILD_DONATION_REWARD = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_GUILD_DONATION_REWARD', {
			DONATION_REWARD_ID: { type: sequelize_module.INTEGER, allowNull: false },
			DONATION_POINT: { type: sequelize_module.INTEGER, allowNull: false },
			GUILD_POINT_REWARD: { type: sequelize_module.INTEGER, allowNull: false },
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
						},
						{
							DONATION_REWARD_ID: read.Rows[i].DonationRewardID,
							DONATION_POINT: read.Rows[i].DonationPoint,
							GUILD_POINT_REWARD: read.Rows[i].GuildPointReward,
							REWARD1_TYPE: read.Rows[i].Reward1Type,
							REWARD1_ID: read.Rows[i].Reward1ID,
							REWARD1_COUNT: read.Rows[i].Reward1Count,
							REWARD2_TYPE: read.Rows[i].Reward2Type,
							REWARD2_ID: read.Rows[i].Reward2ID,
							REWARD2_COUNT: read.Rows[i].Reward2Count,
							REWARD3_TYPE: read.Rows[i].Reward3Type,
							REWARD3_ID: read.Rows[i].Reward3ID,
							REWARD3_COUNT: read.Rows[i].Reward3Count,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_GUILD_DONATION_REWARD');
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