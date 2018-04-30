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

	inst.BT_ITEM_REINFORCE_COST = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_ITEM_REINFORCE_COST', {
			REINFORCE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			EVOLUTION_LV: { type: sequelize_module.INTEGER, allowNull: false },
			EQUIP_CATEGORY: { type: sequelize_module.INTEGER, allowNull: false },
			REINFORCE_LV: { type: sequelize_module.INTEGER, allowNull: false },
			GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			MATERIAL1_IDX: { type: sequelize_module.INTEGER, allowNull: false },
			MATERIAL1_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			RATE: { type: sequelize_module.FLOAT, allowNull: false },
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
						},
						{
							REINFORCE_ID: read.Rows[i].ReinforceID,
							EVOLUTION_LV: read.Rows[i].EvolutionLV,
							EQUIP_CATEGORY: read.Rows[i].EquipCategory,
							REINFORCE_LV: read.Rows[i].ReinforceLv,
							GOLD: read.Rows[i].Gold,
							MATERIAL1_IDX: read.Rows[i].Material1_Idx,
							MATERIAL1_COUNT: read.Rows[i].Material1_Count,
							RATE: read.Rows[i].Rate,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_ITEM_REINFORCE_COST');
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