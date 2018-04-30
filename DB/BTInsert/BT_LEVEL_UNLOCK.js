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

    inst.BT_LEVEL_UNLOCK = function (sequelize, path, callback) {
        base_table = sequelize.define('BT_LEVEL_UNLOCK', {
            TARGET_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
            MAX_STAMINA: { type: sequelize_module.INTEGER, allowNull: false },
            RECOVERY_STAMINA: { type: sequelize_module.INTEGER, allowNull: false },
            CASTLE_STEP: { type: sequelize_module.INTEGER, allowNull: false },
            OPEN_SHOP: { type: sequelize_module.BOOLEAN, allowNull: false },
            OPEN_EVENTDUNGEON_GOLD: { type: sequelize_module.BOOLEAN, allowNull: false },
            OPEN_EVENTDUNGEON_EXP: { type: sequelize_module.BOOLEAN, allowNull: false },
            OPEN_EVENTDUNGEON_DAILY1: { type: sequelize_module.BOOLEAN, allowNull: false },
            OPEN_EVENTDUNGEON_DAILY2: { type: sequelize_module.BOOLEAN, allowNull: false },
            OPEN_EVENTDUNGEON_DAILY3: { type: sequelize_module.BOOLEAN, allowNull: false },
            OPEN_IMPRINTING: { type: sequelize_module.BOOLEAN, allowNull: false },
            OPEN_ACCOUNTBUFF: { type: sequelize_module.BOOLEAN, allowNull: false },
            OPEN_INFINITY: { type: sequelize_module.BOOLEAN, allowNull: false },
            OPEN_PVP: { type: sequelize_module.BOOLEAN, allowNull: false },
            OPEN_GUILD: { type: sequelize_module.BOOLEAN, allowNull: false },
            OPEN_CHAT: { type: sequelize_module.BOOLEAN, allowNull: false },
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
                            TARGET_LEVEL: read.Rows[i].TargetLevel,
                            MAX_STAMINA: read.Rows[i].MaxStamina,
                            RECOVERY_STAMINA: read.Rows[i].RecoveryStamina,
                            CASTLE_STEP: read.Rows[i].CastleStep,
                            OPEN_SHOP: read.Rows[i].OpenShop,
                            OPEN_EVENTDUNGEON_GOLD: read.Rows[i].OpenEventdungeonGold,
                            OPEN_EVENTDUNGEON_EXP: read.Rows[i].OpenEventdungeonExp,
                            OPEN_EVENTDUNGEON_DAILY1: read.Rows[i].OpenEventdungeonDaily1,
                            OPEN_EVENTDUNGEON_DAILY2: read.Rows[i].OpenEventdungeonDaily2,
                            OPEN_EVENTDUNGEON_DAILY3: read.Rows[i].OpenEventdungeonDaily3,
                            OPEN_IMPRINTING: read.Rows[i].OpenImprinting,
                            OPEN_ACCOUNTBUFF: read.Rows[i].OpenAccountbuff,
                            OPEN_INFINITY: read.Rows[i].OpenInfinity,
                            OPEN_PVP: read.Rows[i].OpenPvp,
                            OPEN_GUILD: read.Rows[i].OpenGuild,
                            OPEN_CHAT: read.Rows[i].OpenChat,
                        })
                        .success(function (anotherTask) {
                            // console.log('anotherTask - ', anotherTask);
                            if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_LEVEL_UNLOCK');
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