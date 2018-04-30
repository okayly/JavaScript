/********************************************************************
Title : mkDB
Date : 2015.09.24
Desc : Data base controller(Manager)
writer: dongsu
********************************************************************/
// global
sequelize_module = require('sequelize');

var gt_mgr = require('./GTMgr.js');
var bt_mgr = require('./BTMgr.js');

var GTResetContent = require('./GTResetContent.js');

(function(exports) {

	// private 변수
	var sequelize;
	var connected_db = false;

	// 외부에 공개할 public 객체
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	inst.InitMkDB = function (db_config) {
		// console.log('db_config:', db_config);
		sequelize = new sequelize_module(
			db_config.DBName,
			db_config.DBAcc,
			db_config.DBPw,
			{
				host : db_config.DBIP,
				port : db_config.DBPort,
				logging : false,
				dialect : 'mysql',
				pool : {
					max: 5,
					min: 0,
					idle: 10000
				}
				// , dialectOptions: { multipleStatements: true }
				// or
				// pool:{ maxConnections:5, maxIdleTime:30 }
			});

		connected_db = true;
		logger.debug('DB Name : ' + db_config.DBName);
		logger.debug('DB Acc : ' + db_config.DBAcc);
		logger.debug('DB PW : ' + db_config.DBPw);
		logger.debug('DB connect complete!!! connected state is ' + connected_db);
		// console.log('sequelize -', sequelize);

		/* init 의 경우 리턴 값을 받아서 초기화 실패시 크래쉬가 나도록 하자. */

		// 00. db table define
		gt_mgr.inst.DefineGameDataTable(sequelize); 
		gt_mgr.inst.AsyncGameDataTable(sequelize);
		
		bt_mgr.inst.Initialize(sequelize);

		// bt_mgr init 이후 호출! - TODO : 순서에 주의. 프로미스를 걸면 좋겠다. 
		GTResetContent.inst.InitWeeklyContent();
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetSequelize = function () {
		return sequelize;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;