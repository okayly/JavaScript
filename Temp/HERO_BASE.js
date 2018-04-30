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
			CLASS: { type: sequelize_module.INTEGER, allowNull: false },
			HERO_STONE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			EVOLUTION_STEP: { type: sequelize_module.INTEGER, allowNull: false },
			LVRATING_ID: { type: sequelize_module.INTEGER, allowNull: false },
			REINFORCE_ID: { type: sequelize_module.INTEGER, allowNull: false },
			EVOLUTION_STATUS_ID: { type: sequelize_module.INTEGER, allowNull: false },
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
			SKILL_GAUGE_INCREASE_HIT: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_GAUGE_INCREASE_HURT: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_GAUGE_INCREASE_KILL: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_GAUGE_INCREASE_CLEAR: { type: sequelize_module.INTEGER, allowNull: false },
			ASSIS_ATTACK_DMG_RATE: { type: sequelize_module.FLOAT, allowNull: false },
			ACTION_GAUGE_INCREASE_ATTACK: { type: sequelize_module.INTEGER, allowNull: false },
			TAG_ATTACK_DMG_RATE: { type: sequelize_module.FLOAT, allowNull: false },
			TAG_GAUGE_INCREASE_ATTACK: { type: sequelize_module.INTEGER, allowNull: false },
			AGILITY: { type: sequelize_module.INTEGER, allowNull: false },
			EQUIP_SLOT_ID1: { type: sequelize_module.INTEGER, allowNull: false },
			EQUIP_SLOT_ID2: { type: sequelize_module.INTEGER, allowNull: false },
			EQUIP_SLOT_ID3: { type: sequelize_module.INTEGER, allowNull: false },
			EQUIP_SLOT_ID4: { type: sequelize_module.INTEGER, allowNull: false },
			EQUIP_SLOT_ID5: { type: sequelize_module.INTEGER, allowNull: false },
			EQUIP_SLOT_ID6: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_UI_POSITION1: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_UI_POSITION2: { type: sequelize_module.INTEGER, allowNull: false },
			NATTACK_ID1: { type: sequelize_module.INTEGER, allowNull: false },
			NATTACK_ID2: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID1: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID2: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID3: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID4: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID5: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID6: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID7: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID8: { type: sequelize_module.INTEGER, allowNull: false },
			SKILL_ID9: { type: sequelize_module.INTEGER, allowNull: false },
			OFFENCE_RUNE_SLOT_MAX: { type: sequelize_module.INTEGER, allowNull: false },
			DEFENCE_RUNE_SLOT_MAX: { type: sequelize_module.INTEGER, allowNull: false },
			SUPPORT_RUNE_SLOT_MAX: { type: sequelize_module.INTEGER, allowNull: false },
			COMMON_RUNE_SLOT_MAX: { type: sequelize_module.INTEGER, allowNull: false },
			IDENTIFICATION: { type: sequelize_module.INTEGER, allowNull: false },
		}, { timestamps: false });

		base_table.sync({ force: false })
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
							CLASS: read.Rows[i].Class,
							HERO_STONE_ID: read.Rows[i].HeroStoneID,
							EVOLUTION_STEP: read.Rows[i].EvolutionStep,
							LVRATING_ID: read.Rows[i].LVRatingID,
							REINFORCE_ID: read.Rows[i].PromotionID,
							EVOLUTION_STATUS_ID: read.Rows[i].EvolutionStatusID,
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
							SKILL_GAUGE_INCREASE_HIT: read.Rows[i].SkillGaugeIncrease_Hit,
							SKILL_GAUGE_INCREASE_HURT: read.Rows[i].SkillGaugeIncrease_Hurt,
							SKILL_GAUGE_INCREASE_KILL: read.Rows[i].SkillGaugeIncrease_Kill,
							SKILL_GAUGE_INCREASE_CLEAR: read.Rows[i].SkillGaugeIncrease_Clear,
							ASSIS_ATTACK_DMG_RATE: read.Rows[i].AssisAttack_DmgRate,
							ACTION_GAUGE_INCREASE_ATTACK: read.Rows[i].ActionGaugeIncrease_Attack,
							TAG_ATTACK_DMG_RATE: read.Rows[i].TagAttack_DmgRate,
							TAG_GAUGE_INCREASE_ATTACK: read.Rows[i].TagGaugeIncrease_Attack,
							AGILITY: read.Rows[i].Agility,
							EQUIP_SLOT_ID1: read.Rows[i].EquipSlotID1,
							EQUIP_SLOT_ID2: read.Rows[i].EquipSlotID2,
							EQUIP_SLOT_ID3: read.Rows[i].EquipSlotID3,
							EQUIP_SLOT_ID4: read.Rows[i].EquipSlotID4,
							EQUIP_SLOT_ID5: read.Rows[i].EquipSlotID5,
							EQUIP_SLOT_ID6: read.Rows[i].EquipSlotID6,
							SKILL_UI_POSITION1: read.Rows[i].Skill_UI_Position1,
							SKILL_UI_POSITION2: read.Rows[i].Skill_UI_Position2,
							NATTACK_ID1: read.Rows[i].NAttackID1,
							NATTACK_ID2: read.Rows[i].NAttackID2,
							SKILL_ID1: read.Rows[i].SkillID1,
							SKILL_ID2: read.Rows[i].SkillID2,
							SKILL_ID3: read.Rows[i].SkillID3,
							SKILL_ID4: read.Rows[i].SkillID4,
							SKILL_ID5: read.Rows[i].SkillID5,
							SKILL_ID6: read.Rows[i].SkillID6,
							SKILL_ID7: read.Rows[i].SkillID7,
							SKILL_ID8: read.Rows[i].SkillID8,
							SKILL_ID9: read.Rows[i].SkillID9,
							OFFENCE_RUNE_SLOT_MAX: read.Rows[i].Offence_RuneSlot_Max,
							DEFENCE_RUNE_SLOT_MAX: read.Rows[i].Defence_RuneSlot_Max,
							SUPPORT_RUNE_SLOT_MAX: read.Rows[i].Support_RuneSlot_Max,
							COMMON_RUNE_SLOT_MAX: read.Rows[i].Common_RuneSlot_Max,
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