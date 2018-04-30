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

	inst.BT_GACHA_INFO = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_GACHA_INFO', {
			GACHA_ID: { type: sequelize_module.INTEGER, allowNull: false },
			GACHA_REFERENCE: { type: sequelize_module.STRING, allowNull: false },
			VIP_GACHA: { type: sequelize_module.INTEGER, allowNull: false },
			GACHA_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			GACHA_VALUE: { type: sequelize_module.INTEGER, allowNull: false },
			GACHA_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			GACHA_FREE: { type: sequelize_module.INTEGER, allowNull: false },
			GACHA_COOLTIME: { type: sequelize_module.INTEGER, allowNull: false },
			CHANCE_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			CHANCE_VALUE: { type: sequelize_module.INTEGER, allowNull: false },
			CHANCE_ITEM: { type: sequelize_module.INTEGER, allowNull: false },
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
							GACHA_ID: read.Rows[i].GachaID,
						},
						{
							GACHA_ID: read.Rows[i].GachaID,
							GACHA_REFERENCE: read.Rows[i].GachaReference,
							VIP_GACHA: read.Rows[i].VipGacha,
							GACHA_TYPE: read.Rows[i].GachaType,
							GACHA_VALUE: read.Rows[i].GachaValue,
							GACHA_COUNT: read.Rows[i].GachaCount,
							GACHA_FREE: read.Rows[i].GachaFree,
							GACHA_COOLTIME: read.Rows[i].GachaCooltime,
							CHANCE_COUNT: read.Rows[i].ChanceCount,
							CHANCE_VALUE: read.Rows[i].ChanceValue,
							CHANCE_ITEM: read.Rows[i].ChanceItem,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_GACHA_INFO');
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