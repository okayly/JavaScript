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

	inst.BT_HERO_REINFORCE = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_HERO_REINFORCE', {
			REINFORCE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			STEP: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE1_ID: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE1_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE2_ID: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE2_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE3_ID: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE3_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE4_ID: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE4_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE5_ID: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE5_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE6_ID: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_RESOURCE6_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			HP: { type: sequelize_module.INTEGER, allowNull: false },
			PATTACK: { type: sequelize_module.INTEGER, allowNull: false },
			MATTACK: { type: sequelize_module.INTEGER, allowNull: false },
			PDEFENSE: { type: sequelize_module.INTEGER, allowNull: false },
			MDEFENSE: { type: sequelize_module.INTEGER, allowNull: false },
			CRITICAL_CHANCE: { type: sequelize_module.FLOAT, allowNull: false },
			CRITICAL_RATE: { type: sequelize_module.FLOAT, allowNull: false },
			BLOCK_CHANCE: { type: sequelize_module.FLOAT, allowNull: false },
			BLOCK_RATE: { type: sequelize_module.FLOAT, allowNull: false },
			BAD_EFFECT_RESIST: { type: sequelize_module.FLOAT, allowNull: false },
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
							REINFORCE_ID: read.Rows[i].ReinforceID,
							STEP: read.Rows[i].Step,
						},
						{
							REINFORCE_ID: read.Rows[i].ReinforceID,
							STEP: read.Rows[i].Step,
							NEED_GOLD: read.Rows[i].NeedGold,
							NEED_RESOURCE1_ID: read.Rows[i].NeedResource1_ID,
							NEED_RESOURCE1_COUNT: read.Rows[i].NeedResource1_Count,
							NEED_RESOURCE2_ID: read.Rows[i].NeedResource2_ID,
							NEED_RESOURCE2_COUNT: read.Rows[i].NeedResource2_Count,
							NEED_RESOURCE3_ID: read.Rows[i].NeedResource3_ID,
							NEED_RESOURCE3_COUNT: read.Rows[i].NeedResource3_Count,
							NEED_RESOURCE4_ID: read.Rows[i].NeedResource4_ID,
							NEED_RESOURCE4_COUNT: read.Rows[i].NeedResource4_Count,
							NEED_RESOURCE5_ID: read.Rows[i].NeedResource5_ID,
							NEED_RESOURCE5_COUNT: read.Rows[i].NeedResource5_Count,
							NEED_RESOURCE6_ID: read.Rows[i].NeedResource6_ID,
							NEED_RESOURCE6_COUNT: read.Rows[i].NeedResource6_Count,
							HP: read.Rows[i].HP,
							PATTACK: read.Rows[i].PAttack,
							MATTACK: read.Rows[i].MAttack,
							PDEFENSE: read.Rows[i].PDefense,
							MDEFENSE: read.Rows[i].MDefense,
							CRITICAL_CHANCE: read.Rows[i].CriticalChance,
							CRITICAL_RATE: read.Rows[i].CriticalRate,
							BLOCK_CHANCE: read.Rows[i].BlockChance,
							BLOCK_RATE: read.Rows[i].BlockRate,
							BAD_EFFECT_RESIST: read.Rows[i].BadEffectResist,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_HERO_REINFORCE');
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