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

    inst.BT_TEAM_ENHANCE_BASE = function (sequelize, path, callback) {
        base_table = sequelize.define('BT_TEAM_ENHANCE_BASE', {
            TEAM_ENHANCE_ID: { type: sequelize_module.INTEGER, allowNull: false },
            LEVEL_UP_ID: { type: sequelize_module.INTEGER, allowNull: false },
            MAX_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
            NEED_ACCOUNT_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
            NEED_SKILL_ID: { type: sequelize_module.INTEGER, allowNull: false },
            NEED_SKILL_LEVEL: { type: sequelize_module.INTEGER, allowNull: false },
        }, { timestamps: false });

        sequelize.sync({ force: false })
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
                            TEAM_ENHANCE_ID: read.Rows[i].TeamEnhanceID,
                            LEVEL_UP_ID: read.Rows[i].LevelUpID,
                            MAX_LEVEL: read.Rows[i].MaxLevel,
                            NEED_ACCOUNT_LEVEL: read.Rows[i].NeedAccountLevel,
                            NEED_SKILL_ID: read.Rows[i].NeedSkillID,
                            NEED_SKILL_LEVEL: read.Rows[i].NeedSkillLevel,
                        })
                        .success(function (anotherTask) {
                            // console.log('anotherTask - ', anotherTask);
                            if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_TEAM_ENHANCE_BASE');
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