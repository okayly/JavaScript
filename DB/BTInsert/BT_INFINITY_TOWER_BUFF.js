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

    inst.BT_INFINITY_TOWER_BUFF = function (sequelize, path, callback) {
        base_table = sequelize.define('BT_INFINITY_TOWER_BUFF', {
            BUFF_ID: { type: sequelize_module.INTEGER, allowNull: false },
            BUFF_TYPE: { type: sequelize_module.INTEGER, allowNull: false },
            BUFF_GROUP_ID: { type: sequelize_module.INTEGER, allowNull: false },
            NEED_TICKET: { type: sequelize_module.INTEGER, allowNull: false },
            BUFF_NAME: { type: sequelize_module.INTEGER, allowNull: false },
            BUFF_SKILL_ID: { type: sequelize_module.INTEGER, allowNull: false },
            APPLY_STATE: { type: sequelize_module.STRING, allowNull: false },
            APPLY_COUNT: { type: sequelize_module.INTEGER, allowNull: false },
            ICON_FILE_NAME: { type: sequelize_module.INTEGER, allowNull: false },
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
                            BUFF_ID: read.Rows[i].BuffID,
                        },
                        {
                            BUFF_ID: read.Rows[i].BuffID,
                            BUFF_TYPE: read.Rows[i].BuffType,
                            BUFF_GROUP_ID: read.Rows[i].BuffGroupID,
                            NEED_TICKET: read.Rows[i].NeedTicket,
                            BUFF_NAME: read.Rows[i].BuffName,
                            BUFF_SKILL_ID: read.Rows[i].BuffSkillID,
                            APPLY_STATE: read.Rows[i].ApplyState,
                            APPLY_COUNT: read.Rows[i].ApplyCount,
                            ICON_FILE_NAME: read.Rows[i].IconFileName,
                        })
                        .success(function (anotherTask) {
                            // console.log('anotherTask - ', anotherTask);
                            if (read.Rows.length - 1 == i && typeof callback == 'function') callback('BT_INFINITY_TOWER_BUFF');
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