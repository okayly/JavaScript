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

	inst.BT_GUILD_CONTENTS_REWARD = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_GUILD_CONTENTS_REWARD', {
			GUILD_REWARD_ID: { type: sequelize_module.INTEGER, allowNull: false },
			GUILD_REWARD_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			GUILD_RAID_REWARD_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
			MAIL_STRING_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_RANK_START: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_RANK_END: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD1_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD1_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD1_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD2_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD2_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD2_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD3_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD3_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD3_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD4_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD4_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD4_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD5_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD5_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD5_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
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
							GUILD_REWARD_ID: read.Rows[i].GuildRewardID,
						},
						{
							GUILD_REWARD_ID: read.Rows[i].GuildRewardID,
							GUILD_REWARD_TYPE: read.Rows[i].GuildRewardType,
							GUILD_RAID_REWARD_GROUP_ID: read.Rows[i].GuildRaidRewardGroupID,
							MAIL_STRING_ID: read.Rows[i].MailStringID,
							REWARD_RANK_START: read.Rows[i].RewardRankStart,
							REWARD_RANK_END: read.Rows[i].RewardRankEnd,
							REWARD1_TYPE: read.Rows[i].Reward1Type,
							REWARD1_ID: read.Rows[i].Reward1ID,
							REWARD1_COUNT: read.Rows[i].Reward1Count,
							REWARD2_TYPE: read.Rows[i].Reward2Type,
							REWARD2_ID: read.Rows[i].Reward2ID,
							REWARD2_COUNT: read.Rows[i].Reward2Count,
							REWARD3_TYPE: read.Rows[i].Reward3Type,
							REWARD3_ID: read.Rows[i].Reward3ID,
							REWARD3_COUNT: read.Rows[i].Reward3Count,
							REWARD4_TYPE: read.Rows[i].Reward4Type,
							REWARD4_ID: read.Rows[i].Reward4ID,
							REWARD4_COUNT: read.Rows[i].Reward4Count,
							REWARD5_TYPE: read.Rows[i].Reward5Type,
							REWARD5_ID: read.Rows[i].Reward5ID,
							REWARD5_COUNT: read.Rows[i].Reward5Count,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_GUILD_CONTENTS_REWARD');
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