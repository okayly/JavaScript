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

	inst.BT_MISSION = function (sequelize, path, callback) {
		base_table = sequelize.define('BT_MISSION', {
			MISSION_ID: { type: sequelize_module.INTEGER, allowNull: false },
			MISSION_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			CONQUEST_MISSION_ID: { type: sequelize_module.INTEGER, allowNull: false },
			LINK_GROUP: { type: sequelize_module.INTEGER, allowNull: false },
			NEXT_MISSION_ID: { type: sequelize_module.INTEGER, allowNull: false },
			MISSION_GOAL_GROUP: { type: sequelize_module.INTEGER, allowNull: false },
			MISSION_GOAL_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
			MISSION_GOAL_VALUE: { type: sequelize_module.INTEGER, allowNull: false },
			MISSION_OPEN_LV: { type: sequelize_module.INTEGER, allowNull: false },
			PREV_VALUE_INHERITANCE: { type: sequelize_module.BOOLEAN, allowNull: false },
			REWARD_TYPE1: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_ID1: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_VAUE1: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_TYPE2: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_ID2: { type: sequelize_module.INTEGER, allowNull: false },
			REWARD_VAUE2: { type: sequelize_module.INTEGER, allowNull: false },
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
							MISSION_ID: read.Rows[i].MissionID,
						},
						{
							MISSION_ID: read.Rows[i].MissionID,
							MISSION_TYPE: read.Rows[i].MissionType,
							CONQUEST_MISSION_ID: read.Rows[i].ConquestMissionID,
							LINK_GROUP: read.Rows[i].LinkGroup,
							NEXT_MISSION_ID: read.Rows[i].NextMissionID,
							MISSION_GOAL_GROUP: read.Rows[i].MissionGoalGroup,
							MISSION_GOAL_TYPE: read.Rows[i].MissionGoalType,
							MISSION_GOAL_VALUE: read.Rows[i].MissionGoalValue,
							MISSION_OPEN_LV: read.Rows[i].MissionOpenLV,
							PREV_VALUE_INHERITANCE: read.Rows[i].PrevValueInheritance,
							REWARD_TYPE1: read.Rows[i].RewardType1,
							REWARD_ID1: read.Rows[i].RewardID1,
							REWARD_VAUE1: read.Rows[i].RewardVaue1,
							REWARD_TYPE2: read.Rows[i].RewardType2,
							REWARD_ID2: read.Rows[i].RewardID2,
							REWARD_VAUE2: read.Rows[i].RewardVaue2,
						})
						.success(function (anotherTask) {
							// console.log('anotherTask - ', anotherTask);
							if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_MISSION');
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