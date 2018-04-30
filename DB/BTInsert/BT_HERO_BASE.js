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

	inst.BT_HERO_BASE = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_HERO_BASE', {
			HERO_ID: { type: sequelize_module.INTEGER, allowNull: false },
			ELEMENT_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			HERO_STONE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			EVOLUTION_STEP: { type: sequelize_module.INTEGER, allowNull: false },
			LVRATING_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REINFORCE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			EVOLUTION_STATUS_ID: { type: sequelize_module.INTEGER, allowNull: false },
			MOVING_IDLE_RATIO: { type: sequelize_module.FLOAT, allowNull: false },
			HP: { type: sequelize_module.INTEGER, allowNull: false },
			PATTACK: { type: sequelize_module.INTEGER, allowNull: false },
			PDEFENSE: { type: sequelize_module.INTEGER, allowNull: false },
			CRITICAL_CHANCE: { type: sequelize_module.FLOAT, allowNull: false },
			CRITICAL_RATE: { type: sequelize_module.FLOAT, allowNull: false },
			HIT_CHANCE: { type: sequelize_module.FLOAT, allowNull: false },
			DODGE_CHANCE: { type: sequelize_module.FLOAT, allowNull: false },
			FEVER_GAUGE_INCREASE_HIT: { type: sequelize_module.INTEGER, allowNull: false },
			FEVER_GAUGE_INCREASE_CRITICAL_HIT: { type: sequelize_module.INTEGER, allowNull: false },
			FEVER_GAUGE_INCREASE_HURT: { type: sequelize_module.INTEGER, allowNull: false },
			FEVER_GAUGE_INCREASE_KILL: { type: sequelize_module.INTEGER, allowNull: false },
			FEVER_GAUGE_INCREASE_CLEAR: { type: sequelize_module.INTEGER, allowNull: false },
			AGILITY: { type: sequelize_module.INTEGER, allowNull: false },
			NATTACK_ID1: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID1: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID2: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID3: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL3_UNLOCK_EVO: { type: sequelize_module.INTEGER, allowNull: false },
			SUB_SKILL1: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL1_REINFORCE: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL2_REINFORCE: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL3_REINFORCE: { type: sequelize_module.INTEGER, allowNull: false },
			CARD_ACTIVE_SKILL_ID: { type: sequelize_module.INTEGER, allowNull: false },
			CARD_PASSIVE_ID1: { type: sequelize_module.INTEGER, allowNull: false },
			CARD_PASSIVE_UNLOCK_EVO1: { type: sequelize_module.INTEGER, allowNull: false },
			CARD_PASSIVE_ID2: { type: sequelize_module.INTEGER, allowNull: false },
			CARD_PASSIVE_UNLOCK_EVO2: { type: sequelize_module.INTEGER, allowNull: false },
			PASSIVE_ID1: { type: sequelize_module.INTEGER, allowNull: false },
			PASSIVE_UNLOCK_EVO1: { type: sequelize_module.INTEGER, allowNull: false },
			PASSIVE_ID2: { type: sequelize_module.INTEGER, allowNull: false },
			PASSIVE_UNLOCK_EVO2: { type: sequelize_module.INTEGER, allowNull: false },
			PASSIVE_ID3: { type: sequelize_module.INTEGER, allowNull: false },
			PASSIVE_UNLOCK_EVO3: { type: sequelize_module.INTEGER, allowNull: false },
			PASSIVE_ID4: { type: sequelize_module.INTEGER, allowNull: false },
			PASSIVE_ID5: { type: sequelize_module.INTEGER, allowNull: false },
			PASSIVE_ID6: { type: sequelize_module.INTEGER, allowNull: false },
			ARMY_ID: { type: sequelize_module.INTEGER, allowNull: false },
			WIN_SOUND_ID: { type: sequelize_module.INTEGER, allowNull: false },
			DAMAGE_SOUND_ID: { type: sequelize_module.INTEGER, allowNull: false },
			DAMAGE_REPLY_SOUND_ID: { type: sequelize_module.INTEGER, allowNull: false },
			KILL_SOUND_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REPLY_SOUND_ID: { type: sequelize_module.INTEGER, allowNull: false },
			IDENTIFICATION: { type: sequelize_module.INTEGER, allowNull: false },
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
							HERO_ID: read.Rows[i].HeroID,
						},
						{
							HERO_ID: read.Rows[i].HeroID,
							ELEMENT_TYPE: read.Rows[i].ElementType,
							HERO_STONE_ID: read.Rows[i].HeroStoneID,
							EVOLUTION_STEP: read.Rows[i].EvolutionStep,
							LVRATING_ID: read.Rows[i].LVRatingID,
							REINFORCE_ID: read.Rows[i].ReinforceID,
							EVOLUTION_STATUS_ID: read.Rows[i].EvolutionStatusID,
							MOVING_IDLE_RATIO: read.Rows[i].MovingIdleRatio,
							HP: read.Rows[i].HP,
							PATTACK: read.Rows[i].PAttack,
							PDEFENSE: read.Rows[i].PDefense,
							CRITICAL_CHANCE: read.Rows[i].CriticalChance,
							CRITICAL_RATE: read.Rows[i].CriticalRate,
							HIT_CHANCE: read.Rows[i].HitChance,
							DODGE_CHANCE: read.Rows[i].DodgeChance,
							FEVER_GAUGE_INCREASE_HIT: read.Rows[i].FeverGaugeIncrease_Hit,
							FEVER_GAUGE_INCREASE_CRITICAL_HIT: read.Rows[i].FeverGaugeIncrease_CriticalHit,
							FEVER_GAUGE_INCREASE_HURT: read.Rows[i].FeverGaugeIncrease_Hurt,
							FEVER_GAUGE_INCREASE_KILL: read.Rows[i].FeverGaugeIncrease_Kill,
							FEVER_GAUGE_INCREASE_CLEAR: read.Rows[i].FeverGaugeIncrease_Clear,
							AGILITY: read.Rows[i].Agility,
							NATTACK_ID1: read.Rows[i].NAttackID1,
							SKILL_ID1: read.Rows[i].SkillID1,
							SKILL_ID2: read.Rows[i].SkillID2,
							SKILL_ID3: read.Rows[i].SkillID3,
							SKILL3_UNLOCK_EVO: read.Rows[i].Skill3UnlockEvo,
							SUB_SKILL1: read.Rows[i].SubSkill1,
							SKILL1_REINFORCE: read.Rows[i].Skill1Reinforce,
							SKILL2_REINFORCE: read.Rows[i].Skill2Reinforce,
							SKILL3_REINFORCE: read.Rows[i].Skill3Reinforce,
							CARD_ACTIVE_SKILL_ID: read.Rows[i].CardActiveSkillID,
							CARD_PASSIVE_ID1: read.Rows[i].CardPassiveID1,
							CARD_PASSIVE_UNLOCK_EVO1: read.Rows[i].CardPassiveUnlockEvo1,
							CARD_PASSIVE_ID2: read.Rows[i].CardPassiveID2,
							CARD_PASSIVE_UNLOCK_EVO2: read.Rows[i].CardPassiveUnlockEvo2,
							PASSIVE_ID1: read.Rows[i].PassiveID1,
							PASSIVE_UNLOCK_EVO1: read.Rows[i].PassiveUnlockEvo1,
							PASSIVE_ID2: read.Rows[i].PassiveID2,
							PASSIVE_UNLOCK_EVO2: read.Rows[i].PassiveUnlockEvo2,
							PASSIVE_ID3: read.Rows[i].PassiveID3,
							PASSIVE_UNLOCK_EVO3: read.Rows[i].PassiveUnlockEvo3,
							PASSIVE_ID4: read.Rows[i].PassiveID4,
							PASSIVE_ID5: read.Rows[i].PassiveID5,
							PASSIVE_ID6: read.Rows[i].PassiveID6,
							ARMY_ID: read.Rows[i].ArmyID,
							WIN_SOUND_ID: read.Rows[i].WinSoundID,
							DAMAGE_SOUND_ID: read.Rows[i].DamageSoundID,
							DAMAGE_REPLY_SOUND_ID: read.Rows[i].DamageReplySoundID,
							KILL_SOUND_ID: read.Rows[i].KillSoundID,
							REPLY_SOUND_ID: read.Rows[i].ReplySoundID,
							IDENTIFICATION: read.Rows[i].Identification,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_HERO_BASE');
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