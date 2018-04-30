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

	inst.BT_VIP = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_VIP', {
			VIP_ID: { type: sequelize_module.INTEGER, allowNull: false },
			STEP: { type: sequelize_module.INTEGER, allowNull: false },
			ACCUM_CASH: { type: sequelize_module.INTEGER, allowNull: false },
			DESCRIPTION: { type: sequelize_module.INTEGER, allowNull: false },
			MAX_BUY_STAMINA_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			MAX_BUY_GOLD_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			VIP_GACHA: { type: sequelize_module.BOOLEAN, allowNull: false },
			SKILL_POINT_CHARGE_TIME: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_POINT_CHARGE_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			MAX_BUY_ADD_ATTEND_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			INFINITY_TOWER_ALL_SKIP_CONTINUE1: { type: sequelize_module.INTEGER, allowNull: false },
			INFINITY_TOWER_ALL_SKIP_CONTINUE2: { type: sequelize_module.INTEGER, allowNull: false },
			INFINITY_TOWER_ALL_SKIP_CONTINUE3: { type: sequelize_module.INTEGER, allowNull: false },
			INFINITY_TOWER_ALL_SKIP_CONTINUE4: { type: sequelize_module.INTEGER, allowNull: false },
			INFINITY_TOWER_ALL_SKIP_CONTINUE5: { type: sequelize_module.INTEGER, allowNull: false },
			INFINITY_TOWER_ALL_SKIP_BONUS_REWARD: { type: sequelize_module.FLOAT, allowNull: false },
			INFINITY_SKIP: { type: sequelize_module.BOOLEAN, allowNull: false },
			INFINITY_SKIP_LIMIT: { type: sequelize_module.INTEGER, allowNull: false },
			INFINITY_SKIP_BONUS: { type: sequelize_module.INTEGER, allowNull: false },
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
			REWARD5_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD5_ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
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
							VIP_ID: read.Rows[i].VipID,
							STEP: read.Rows[i].Step,
						},
						{
							VIP_ID: read.Rows[i].VipID,
							STEP: read.Rows[i].Step,
							ACCUM_CASH: read.Rows[i].AccumCash,
							DESCRIPTION: read.Rows[i].Description,
							MAX_BUY_STAMINA_COUNT: read.Rows[i].MaxBuyStaminaCount,
							MAX_BUY_GOLD_COUNT: read.Rows[i].MaxBuyGoldCount,
							VIP_GACHA: read.Rows[i].VIP_Gacha,
							SKILL_POINT_CHARGE_TIME: read.Rows[i].SkillPointChargeTime,
							SKILL_POINT_CHARGE_COUNT: read.Rows[i].SkillPointChargeCount,
							MAX_BUY_ADD_ATTEND_COUNT: read.Rows[i].MaxBuyAddAttendCount,
							INFINITY_TOWER_ALL_SKIP_CONTINUE1: read.Rows[i].InfinityTowerAllSkipContinue1,
							INFINITY_TOWER_ALL_SKIP_CONTINUE2: read.Rows[i].InfinityTowerAllSkipContinue2,
							INFINITY_TOWER_ALL_SKIP_CONTINUE3: read.Rows[i].InfinityTowerAllSkipContinue3,
							INFINITY_TOWER_ALL_SKIP_CONTINUE4: read.Rows[i].InfinityTowerAllSkipContinue4,
							INFINITY_TOWER_ALL_SKIP_CONTINUE5: read.Rows[i].InfinityTowerAllSkipContinue5,
							INFINITY_TOWER_ALL_SKIP_BONUS_REWARD: read.Rows[i].InfinityTowerAllSkipBonusReward,
							INFINITY_SKIP: read.Rows[i].InfinitySkip,
							INFINITY_SKIP_LIMIT: read.Rows[i].InfinitySkipLimit,
							INFINITY_SKIP_BONUS: read.Rows[i].InfinitySkipBonus,
							REWARD1_TYPE: read.Rows[i].Reward1Type,
							REWARD1_ITEM_ID: read.Rows[i].Reward1ItemID,
							REWARD1_COUNT: read.Rows[i].Reward1Count,
							REWARD2_TYPE: read.Rows[i].Reward2Type,
							REWARD2_ITEM_ID: read.Rows[i].Reward2ItemID,
							REWARD2_COUNT: read.Rows[i].Reward2Count,
							REWARD3_TYPE: read.Rows[i].Reward3Type,
							REWARD3_ITEM_ID: read.Rows[i].Reward3ItemID,
							REWARD3_COUNT: read.Rows[i].Reward3Count,
							REWARD4_TYPE: read.Rows[i].Reward4Type,
							REWARD4_ITEM_ID: read.Rows[i].Reward4ItemID,
							REWARD4_COUNT: read.Rows[i].Reward4Count,
							REWARD5_TYPE: read.Rows[i].Reward5Type,
							REWARD5_ITEM_ID: read.Rows[i].Reward5ItemID,
							REWARD5_COUNT: read.Rows[i].Reward5Count,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_VIP');
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