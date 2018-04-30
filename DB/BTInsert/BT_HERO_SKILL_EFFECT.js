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

	inst.BT_HERO_SKILL_EFFECT = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_HERO_SKILL_EFFECT', {
			EFFECT_ID: { type: sequelize_module.INTEGER, allowNull: false },
			COST: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT1_TYPE: { type: sequelize_module.STRING, allowNull: false },
			EFFECT1_HIT_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT1_TARGET_HIT_ANIM: { type: sequelize_module.STRING, allowNull: false },
			EFFECT1_TARGET_DIE_ANIM: { type: sequelize_module.STRING, allowNull: false },
			EFFECT1_USE_WEAPON_FX: { type: sequelize_module.BOOLEAN, allowNull: false },
			EFFECT1_TARGET_TYPE: { type: sequelize_module.STRING, allowNull: false },
			EFFECT1_DURATION: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT1_POSITIVITY: { type: sequelize_module.STRING, allowNull: false },
			EFFECT1_VALUE1: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT1_VALUE1_LV: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT1_VALUE2: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT1_VALUE2_LV: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT1_VALUE3: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT1_VALUE3_LV: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT2_TYPE: { type: sequelize_module.STRING, allowNull: false },
			EFFECT2_HIT_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT2_TARGET_HIT_ANIM: { type: sequelize_module.STRING, allowNull: false },
			EFFECT2_TARGET_DIE_ANIM: { type: sequelize_module.STRING, allowNull: false },
			EFFECT2_USE_WEAPON_FX: { type: sequelize_module.BOOLEAN, allowNull: false },
			EFFECT2_TARGET_TYPE: { type: sequelize_module.STRING, allowNull: false },
			EFFECT2_DURATION: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT2_POSITIVITY: { type: sequelize_module.STRING, allowNull: false },
			EFFECT2_VALUE1: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT2_VALUE1_LV: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT2_VALUE2: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT2_VALUE2_LV: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT2_VALUE3: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT2_VALUE3_LV: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT3_TYPE: { type: sequelize_module.STRING, allowNull: false },
			EFFECT3_HIT_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT3_TARGET_HIT_ANIM: { type: sequelize_module.STRING, allowNull: false },
			EFFECT3_TARGET_DIE_ANIM: { type: sequelize_module.STRING, allowNull: false },
			EFFECT3_USE_WEAPON_FX: { type: sequelize_module.BOOLEAN, allowNull: false },
			EFFECT3_TARGET_TYPE: { type: sequelize_module.STRING, allowNull: false },
			EFFECT3_DURATION: { type: sequelize_module.INTEGER, allowNull: false },
			EFFECT3_POSITIVITY: { type: sequelize_module.STRING, allowNull: false },
			EFFECT3_VALUE1: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT3_VALUE1_LV: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT3_VALUE2: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT3_VALUE2_LV: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT3_VALUE3: { type: sequelize_module.FLOAT, allowNull: false },
			EFFECT3_VALUE3_LV: { type: sequelize_module.FLOAT, allowNull: false },
			SHAKING_PERIOD: { type: sequelize_module.FLOAT, allowNull: false },
			SHAKING_DAMP: { type: sequelize_module.FLOAT, allowNull: false },
			SHAKING_PLAY_TIME: { type: sequelize_module.FLOAT, allowNull: false },
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
							EFFECT_ID: read.Rows[i].EffectID,
							COST: read.Rows[i].Cost,
							EFFECT1_TYPE: read.Rows[i].Effect1_Type,
							EFFECT1_HIT_COUNT: read.Rows[i].Effect1_HitCount,
							EFFECT1_TARGET_HIT_ANIM: read.Rows[i].Effect1_TargetHitAnim,
							EFFECT1_TARGET_DIE_ANIM: read.Rows[i].Effect1_TargetDieAnim,
							EFFECT1_USE_WEAPON_FX: read.Rows[i].Effect1_UseWeaponFx,
							EFFECT1_TARGET_TYPE: read.Rows[i].Effect1_Target_Type,
							EFFECT1_DURATION: read.Rows[i].Effect1_Duration,
							EFFECT1_POSITIVITY: read.Rows[i].Effect1_Positivity,
							EFFECT1_VALUE1: read.Rows[i].Effect1_Value1,
							EFFECT1_VALUE1_LV: read.Rows[i].Effect1_Value1_per_LV,
							EFFECT1_VALUE2: read.Rows[i].Effect1_Value2,
							EFFECT1_VALUE2_LV: read.Rows[i].Effect1_Value2_per_LV,
							EFFECT1_VALUE3: read.Rows[i].Effect1_Value3,
							EFFECT1_VALUE3_LV: read.Rows[i].Effect1_Value3_per_LV,
							EFFECT2_TYPE: read.Rows[i].Effect2_Type,
							EFFECT2_HIT_COUNT: read.Rows[i].Effect2_HitCount,
							EFFECT2_TARGET_HIT_ANIM: read.Rows[i].Effect2_TargetHitAnim,
							EFFECT2_TARGET_DIE_ANIM: read.Rows[i].Effect2_TargetDieAnim,
							EFFECT2_USE_WEAPON_FX: read.Rows[i].Effect2_UseWeaponFx,
							EFFECT2_TARGET_TYPE: read.Rows[i].Effect2_Target_Type,
							EFFECT2_DURATION: read.Rows[i].Effect2_Duration,
							EFFECT2_POSITIVITY: read.Rows[i].Effect2_Positivity,
							EFFECT2_VALUE1: read.Rows[i].Effect2_Value1,
							EFFECT2_VALUE1_LV: read.Rows[i].Effect2_Value1_per_LV,
							EFFECT2_VALUE2: read.Rows[i].Effect2_Value2,
							EFFECT2_VALUE2_LV: read.Rows[i].Effect2_Value2_per_LV,
							EFFECT2_VALUE3: read.Rows[i].Effect2_Value3,
							EFFECT2_VALUE3_LV: read.Rows[i].Effect2_Value3_per_LV,
							EFFECT3_TYPE: read.Rows[i].Effect3_Type,
							EFFECT3_HIT_COUNT: read.Rows[i].Effect3_HitCount,
							EFFECT3_TARGET_HIT_ANIM: read.Rows[i].Effect3_TargetHitAnim,
							EFFECT3_TARGET_DIE_ANIM: read.Rows[i].Effect3_TargetDieAnim,
							EFFECT3_USE_WEAPON_FX: read.Rows[i].Effect3_UseWeaponFx,
							EFFECT3_TARGET_TYPE: read.Rows[i].Effect3_Target_Type,
							EFFECT3_DURATION: read.Rows[i].Effect3_Duration,
							EFFECT3_POSITIVITY: read.Rows[i].Effect3_Positivity,
							EFFECT3_VALUE1: read.Rows[i].Effect3_Value1,
							EFFECT3_VALUE1_LV: read.Rows[i].Effect3_Value1_per_LV,
							EFFECT3_VALUE2: read.Rows[i].Effect3_Value2,
							EFFECT3_VALUE2_LV: read.Rows[i].Effect3_Value2_per_LV,
							EFFECT3_VALUE3: read.Rows[i].Effect3_Value3,
							EFFECT3_VALUE3_LV: read.Rows[i].Effect3_Value3_per_LV,
							SHAKING_PERIOD: read.Rows[i].ShakingPeriod,
							SHAKING_DAMP: read.Rows[i].ShakingDamp,
							SHAKING_PLAY_TIME: read.Rows[i].ShakingPlayTime,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_HERO_SKILL_EFFECT');
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