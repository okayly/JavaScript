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

	inst.BT_HERO_SKILL = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_HERO_SKILL', {
			SKILL_ID: { type: sequelize_module.INTEGER, allowNull: false },
			NAME: { type: sequelize_module.INTEGER, allowNull: false },
			DESCRIPTION: { type: sequelize_module.INTEGER, allowNull: false },
			ICON_ID: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			WEAK_TARGET: { type: sequelize_module.FLOAT, allowNull: false },
			NEED_MP: { type: sequelize_module.INTEGER, allowNull: false },
			USE_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			COOL_TIME: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_EFFECT_ID: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_EFFECT_START_TIMING: { type: sequelize_module.INTEGER, allowNull: false },
			ACTION_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			MOVE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			MOVE_POS: { type: sequelize_module.FLOAT, allowNull: false },
			DIRECTING: { type: sequelize_module.INTEGER, allowNull: false },
			SKIP_DIRECTING_FRAME: { type: sequelize_module.INTEGER, allowNull: false },
			ENTRANCE_DIRECTING: { type: sequelize_module.INTEGER, allowNull: false },
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
						},
						{
							SKILL_ID: read.Rows[i].SkillID,
							NAME: read.Rows[i].Name,
							DESCRIPTION: read.Rows[i].Description,
							ICON_ID: read.Rows[i].IconID,
							SKILL_TYPE: read.Rows[i].SkillType,
							WEAK_TARGET: read.Rows[i].WeakTarget,
							NEED_MP: read.Rows[i].NeedMp,
							USE_COUNT: read.Rows[i].UseCount,
							COOL_TIME: read.Rows[i].CoolTime,
							SKILL_EFFECT_ID: read.Rows[i].SkillEffectID,
							SKILL_EFFECT_START_TIMING: read.Rows[i].SkillEffectStartTiming,
							ACTION_TYPE: read.Rows[i].ActionType,
							MOVE_ID: read.Rows[i].MoveID,
							MOVE_POS: read.Rows[i].MovePos,
							DIRECTING: read.Rows[i].Directing,
							SKIP_DIRECTING_FRAME: read.Rows[i].SkipDirectingFrame,
							ENTRANCE_DIRECTING: read.Rows[i].EntranceDirecting,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_HERO_SKILL');
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