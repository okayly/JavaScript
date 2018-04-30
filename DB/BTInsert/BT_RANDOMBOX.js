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

	inst.BT_RANDOMBOX = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_RANDOMBOX', {
			RANDOMBOX_ID: { type: sequelize_module.INTEGER, allowNull: false },
			RANDOMBOX_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
			RATE: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT_ID: { type: sequelize_module.INTEGER, allowNull: false },
			MIN_VALUE: { type: sequelize_module.INTEGER, allowNull: false },
			MAX_VALUE: { type: sequelize_module.INTEGER, allowNull: false },
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
							RANDOMBOX_ID: read.Rows[i].RandomboxID,
						},
						{
							RANDOMBOX_ID: read.Rows[i].RandomboxID,
							RANDOMBOX_GROUP_ID: read.Rows[i].RandomboxGroupID,
							RATE: read.Rows[i].Rate,
							REWARD_TYPE: read.Rows[i].RewardType,
							ITEM_ID: read.Rows[i].ItemID,
							EFFECT_ID: read.Rows[i].EffectID,
							MIN_VALUE: read.Rows[i].MinValue,
							MAX_VALUE: read.Rows[i].MaxValue,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_RANDOMBOX');
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