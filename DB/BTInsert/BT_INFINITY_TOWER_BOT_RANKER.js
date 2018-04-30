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

	inst.BT_INFINITY_TOWER_BOT_RANKER = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_INFINITY_TOWER_BOT_RANKER', {
			RANK_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ACOUNT_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
			GUILD: { type: sequelize_module.STRING, allowNull: false },
			CLEAR_SCORE: { type: sequelize_module.INTEGER, allowNull: false },
			CLEAR_FLOOR: { type: sequelize_module.INTEGER, allowNull: false },
			HERO1_ID: { type: sequelize_module.INTEGER, allowNull: false },
			HERO1_EVOLUTION: { type: sequelize_module.INTEGER, allowNull: false },
			HERO1_REINFORCE: { type: sequelize_module.INTEGER, allowNull: false },
			HERO1_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
			HERO2_ID: { type: sequelize_module.INTEGER, allowNull: false },
			HERO2_EVOLUTION: { type: sequelize_module.INTEGER, allowNull: false },
			HERO2_REINFORCE: { type: sequelize_module.INTEGER, allowNull: false },
			HERO2_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
			HERO3_ID: { type: sequelize_module.INTEGER, allowNull: false },
			HERO3_EVOLUTION: { type: sequelize_module.INTEGER, allowNull: false },
			HERO3_REINFORCE: { type: sequelize_module.INTEGER, allowNull: false },
			HERO3_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
			HERO4_ID: { type: sequelize_module.INTEGER, allowNull: false },
			HERO4_EVOLUTION: { type: sequelize_module.INTEGER, allowNull: false },
			HERO4_REINFORCE: { type: sequelize_module.INTEGER, allowNull: false },
			HERO4_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
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
							RANK_ID: read.Rows[i].RankID,
						},
						{
							RANK_ID: read.Rows[i].RankID,
							ACOUNT_LEVEL: read.Rows[i].AcountLevel,
							GUILD: read.Rows[i].Guild,
							CLEAR_SCORE: read.Rows[i].ClearScore,
							CLEAR_FLOOR: read.Rows[i].ClearFloor,
							HERO1_ID: read.Rows[i].Hero1_ID,
							HERO1_EVOLUTION: read.Rows[i].Hero1_Evolution,
							HERO1_REINFORCE: read.Rows[i].Hero1_Reinforce,
							HERO1_LEVEL: read.Rows[i].Hero1_Level,
							HERO2_ID: read.Rows[i].Hero2_ID,
							HERO2_EVOLUTION: read.Rows[i].Hero2_Evolution,
							HERO2_REINFORCE: read.Rows[i].Hero2_Reinforce,
							HERO2_LEVEL: read.Rows[i].Hero2_Level,
							HERO3_ID: read.Rows[i].Hero3_ID,
							HERO3_EVOLUTION: read.Rows[i].Hero3_Evolution,
							HERO3_REINFORCE: read.Rows[i].Hero3_Reinforce,
							HERO3_LEVEL: read.Rows[i].Hero3_Level,
							HERO4_ID: read.Rows[i].Hero4_ID,
							HERO4_EVOLUTION: read.Rows[i].Hero4_Evolution,
							HERO4_REINFORCE: read.Rows[i].Hero4_Reinforce,
							HERO4_LEVEL: read.Rows[i].Hero4_Level,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_INFINITY_TOWER_BOT_RANKER');
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