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

	inst.BT_HERO_EVOLUTION = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_HERO_EVOLUTION', {
			STEP: { type: sequelize_module.INTEGER, allowNull: false },
			NEED_GOLD: { type: sequelize_module.INTEGER, allowNull: false },
			HERO_STONE_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			HERO_STONE_EXCHANGE: { type: sequelize_module.INTEGER, allowNull: false },
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
							STEP: read.Rows[i].Step,
						},
						{
							STEP: read.Rows[i].Step,
							NEED_GOLD: read.Rows[i].NeedGold,
							HERO_STONE_COUNT: read.Rows[i].HeroStoneCount,
							HERO_STONE_EXCHANGE: read.Rows[i].HeroStoneExchange,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_HERO_EVOLUTION');
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