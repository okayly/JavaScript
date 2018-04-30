/********************************************************************
Title : LoadGTMission
Date : 2017.03.16
Update : 2017.04.03
Writer : jongwook
Desc : Promise 로드 - 미션
********************************************************************/
var GTMgr = require('../GTMgr.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectMission = function(p_uuid, p_mission_id) {
		return new Promise(function (resolve, reject) {
			// GT_USER select
			GTMgr.inst.GetGTMission().find({
				where : { UUID : p_uuid, MISSION_ID : p_mission_id, EXIST_YN : true }
			})
			.then(p_ret_mission => { resolve(p_ret_mission); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;