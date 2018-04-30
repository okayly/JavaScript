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

	inst.BT_ITEM_EQUIP_STATUS = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_ITEM_EQUIP_STATUS', {
			STATUS_ID: { type: sequelize_module.INTEGER, allowNull: false },
			EVOLUTION_STEP: { type: sequelize_module.INTEGER, allowNull: false },
			SECONDARY_OPTION_GROUP: { type: sequelize_module.INTEGER, allowNull: false },
			OPTION_COUNT_MIN: { type: sequelize_module.INTEGER, allowNull: false },
			OPTION_COUNT_MAX: { type: sequelize_module.INTEGER, allowNull: false },
			OPTION_GROUP: { type: sequelize_module.INTEGER, allowNull: false },
			HP: { type: sequelize_module.INTEGER, allowNull: false },
			HP_LV: { type: sequelize_module.INTEGER, allowNull: false },
			PATTACK: { type: sequelize_module.INTEGER, allowNull: false },
			PATTACK_LV: { type: sequelize_module.INTEGER, allowNull: false },
			MATTACK: { type: sequelize_module.INTEGER, allowNull: false },
			PDEFENSE: { type: sequelize_module.INTEGER, allowNull: false },
			PDEFENSE_LV: { type: sequelize_module.INTEGER, allowNull: false },
			MDEFENSE: { type: sequelize_module.INTEGER, allowNull: false },
			CRITICAL_CHANCE: { type: sequelize_module.FLOAT, allowNull: false },
			CRITICAL_CHANCE_LV: { type: sequelize_module.FLOAT, allowNull: false },
			LV_UP_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			LV_UP_GOLD_LV: { type: sequelize_module.INTEGER, allowNull: false },
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
							STATUS_ID: read.Rows[i].StatusID,
						},
						{
							STATUS_ID: read.Rows[i].StatusID,
							EVOLUTION_STEP: read.Rows[i].EvolutionStep,
							SECONDARY_OPTION_GROUP: read.Rows[i].SecondaryOptionGroup,
							OPTION_COUNT_MIN: read.Rows[i].OptionCountMin,
							OPTION_COUNT_MAX: read.Rows[i].OptionCountMax,
							OPTION_GROUP: read.Rows[i].OptionGroup,
							HP: read.Rows[i].HP,
							HP_LV: read.Rows[i].HP_Lv,
							PATTACK: read.Rows[i].PAttack,
							PATTACK_LV: read.Rows[i].PAttack_Lv,
							MATTACK: read.Rows[i].MAttack,
							PDEFENSE: read.Rows[i].PDefense,
							PDEFENSE_LV: read.Rows[i].PDefense_Lv,
							MDEFENSE: read.Rows[i].MDefense,
							CRITICAL_CHANCE: read.Rows[i].CriticalChance,
							CRITICAL_CHANCE_LV: read.Rows[i].CriticalChance_Lv,
							LV_UP_GOLD: read.Rows[i].LvUp_Gold,
							LV_UP_GOLD_LV: read.Rows[i].LvUp_Gold_Lv,
							CRITICAL_RATE: read.Rows[i].CriticalRate,
							BLOCK_CHANCE: read.Rows[i].BlockChance,
							BLOCK_RATE: read.Rows[i].BlockRate,
							BAD_EFFECT_RESIST: read.Rows[i].BadEffectResist,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_ITEM_EQUIP_STATUS');
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