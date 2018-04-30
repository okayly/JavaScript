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

	inst.BT_ITEM_EVOLUTION_STATUS = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_ITEM_EVOLUTION_STATUS', {
			EVOLUTION_STATUS_ID: { type: sequelize_module.INTEGER, allowNull: false },
			STEP: { type: sequelize_module.INTEGER, allowNull: false },
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
							EVOLUTION_STATUS_ID: read.Rows[i].EvolutionStatusID,
							STEP: read.Rows[i].Step,
						},
						{
							EVOLUTION_STATUS_ID: read.Rows[i].EvolutionStatusID,
							STEP: read.Rows[i].Step,
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
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_ITEM_EVOLUTION_STATUS');
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