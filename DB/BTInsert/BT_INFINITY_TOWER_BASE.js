//----------------------------------------------
//    Google2u: Google Doc Unity integration
//         Copyright © 2015 Litteratus
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

    inst.BT_INFINITY_TOWER_BASE = function (sequelize, path, callback) {
        base_table = sequelize.define('BT_INFINITY_TOWER_BASE', {
            INFINITY_TOWER_ID: { type: sequelize_module.INTEGER, allowNull: false },
            TOWER_FLOOR: { type: sequelize_module.INTEGER, allowNull: false },
            FLOOR_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
            BASE_FIGHT: { type: sequelize_module.INTEGER, allowNull: false },
            OVER_ADD_FIGHT: { type: sequelize_module.INTEGER, allowNull: false },
            LOW_FIGHT_MIN: { type: sequelize_module.INTEGER, allowNull: false },
            LOW_FIGHT_MAX: { type: sequelize_module.INTEGER, allowNull: false },
            MIDDLE_FIGHT_MIN: { type: sequelize_module.INTEGER, allowNull: false },
            MIDDLE_FIGHT_MAX: { type: sequelize_module.INTEGER, allowNull: false },
            HIGH_FIGHT_MAX: { type: sequelize_module.INTEGER, allowNull: false },
            HIGH_FIGHT_MIN: { type: sequelize_module.INTEGER, allowNull: false },
            AWAKE_RATE: { type: sequelize_module.INTEGER, allowNull: false },
            AWAKE_FIGHT_MIN: { type: sequelize_module.INTEGER, allowNull: false },
            AWAKE_FIGHT_MAX: { type: sequelize_module.INTEGER, allowNull: false },
            LOW_REWARD_TICKET: { type: sequelize_module.INTEGER, allowNull: false },
            LOW_REWARD_SCORE: { type: sequelize_module.INTEGER, allowNull: false },
            MIDDLE_REWARD_TICKET: { type: sequelize_module.INTEGER, allowNull: false },
            MIDDLE_REWARD_SCORE: { type: sequelize_module.INTEGER, allowNull: false },
            HIGH_REWARD_TICKET: { type: sequelize_module.INTEGER, allowNull: false },
            HIGH_REWARD_SCORE: { type: sequelize_module.INTEGER, allowNull: false },
            AWAKE_REWARD_TICKET: { type: sequelize_module.INTEGER, allowNull: false },
            AWAKE_REWARD_SCORE: { type: sequelize_module.INTEGER, allowNull: false },
            AWAKE_REWARD_CHALLENGE_POINT: { type: sequelize_module.INTEGER, allowNull: false },
            BOX1_REWARD_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
            BOX1_REWARD_ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
            BOX1_REWARD_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
            BOX2_REWARD_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
            BOX2_REWARD_ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
            BOX2_REWARD_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
            BOX3_REWARD_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
            BOX3_REWARD_ITEM_ID: { type: sequelize_module.INTEGER, allowNull: false },
            BOX3_REWARD_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
            BUFF_SHOP1_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
            BUFF_SHOP2_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
            BUFF_SHOP3_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
            SECRET_MAZE1_BUFF_ID: { type: sequelize_module.INTEGER, allowNull: false },
            SECRET_MAZE2_BUFF_ID: { type: sequelize_module.INTEGER, allowNull: false },
            SECRET_MAZE3_BUFF_ID: { type: sequelize_module.INTEGER, allowNull: false },
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
                            INFINITY_TOWER_ID: read.Rows[i].InfinityTowerID,
                            TOWER_FLOOR: read.Rows[i].TowerFloor,
                        },
                        {
                            INFINITY_TOWER_ID: read.Rows[i].InfinityTowerID,
                            TOWER_FLOOR: read.Rows[i].TowerFloor,
                            FLOOR_TYPE: read.Rows[i].FloorType,
                            BASE_FIGHT: read.Rows[i].BaseFight,
                            OVER_ADD_FIGHT: read.Rows[i].OverAddFight,
                            LOW_FIGHT_MIN: read.Rows[i].LowFightMin,
                            LOW_FIGHT_MAX: read.Rows[i].LowFightMax,
                            MIDDLE_FIGHT_MIN: read.Rows[i].MiddleFightMin,
                            MIDDLE_FIGHT_MAX: read.Rows[i].MiddleFightMax,
                            HIGH_FIGHT_MAX: read.Rows[i].HighFightMax,
                            HIGH_FIGHT_MIN: read.Rows[i].HighFightMin,
                            AWAKE_RATE: read.Rows[i].AwakeRate,
                            AWAKE_FIGHT_MIN: read.Rows[i].AwakeFightMin,
                            AWAKE_FIGHT_MAX: read.Rows[i].AwakeFightMax,
                            LOW_REWARD_TICKET: read.Rows[i].LowRewardTicket,
                            LOW_REWARD_SCORE: read.Rows[i].LowRewardScore,
                            MIDDLE_REWARD_TICKET: read.Rows[i].MiddleRewardTicket,
                            MIDDLE_REWARD_SCORE: read.Rows[i].MiddleRewardScore,
                            HIGH_REWARD_TICKET: read.Rows[i].HighRewardTicket,
                            HIGH_REWARD_SCORE: read.Rows[i].HighRewardScore,
                            AWAKE_REWARD_TICKET: read.Rows[i].AwakeRewardTicket,
                            AWAKE_REWARD_SCORE: read.Rows[i].AwakeRewardScore,
                            AWAKE_REWARD_CHALLENGE_POINT: read.Rows[i].AwakeRewardChallengePoint,
                            BOX1_REWARD_TYPE: read.Rows[i].Box1_RewardType,
                            BOX1_REWARD_ITEM_ID: read.Rows[i].Box1_RewardItemID,
                            BOX1_REWARD_COUNT: read.Rows[i].Box1_RewardCount,
                            BOX2_REWARD_TYPE: read.Rows[i].Box2_RewardType,
                            BOX2_REWARD_ITEM_ID: read.Rows[i].Box2_RewardItemID,
                            BOX2_REWARD_COUNT: read.Rows[i].Box2_RewardCount,
                            BOX3_REWARD_TYPE: read.Rows[i].Box3_RewardType,
                            BOX3_REWARD_ITEM_ID: read.Rows[i].Box3_RewardItemID,
                            BOX3_REWARD_COUNT: read.Rows[i].Box3_RewardCount,
                            BUFF_SHOP1_GROUP_ID: read.Rows[i].BuffShop1_GroupID,
                            BUFF_SHOP2_GROUP_ID: read.Rows[i].BuffShop2_GroupID,
                            BUFF_SHOP3_GROUP_ID: read.Rows[i].BuffShop3_GroupID,
                            SECRET_MAZE1_BUFF_ID: read.Rows[i].SecretMaze1_BuffID,
                            SECRET_MAZE2_BUFF_ID: read.Rows[i].SecretMaze2_BuffID,
                            SECRET_MAZE3_BUFF_ID: read.Rows[i].SecretMaze3_BuffID,
                        })
                        .success(function (anotherTask) {
                            // console.log('anotherTask - ', anotherTask);
                            if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_INFINITY_TOWER_BASE');
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