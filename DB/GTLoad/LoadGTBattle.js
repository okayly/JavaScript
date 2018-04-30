/********************************************************************
Title : LoadGTBattle
Date : 2017.02.17
Update : 2017.04.03
Writer : jongwook
Desc : Promise 로드 - 배틀
********************************************************************/
var GTMgr = require('../GTMgr.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectTeam = function(p_uuid, p_team_id) {
		return new Promise(function (resolve, reject) {
			// GT_TEAM select
			GTMgr.inst.GetGTTeam().find({
				where: { UUID : p_uuid, TEAM_ID : p_team_id, EXIST_YN : true }
			})
			.then(p_ret_team => { resolve(p_ret_team); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectChapter = function(p_uuid, p_chapter_id) {
		return new Promise(function (resolve, reject) {
			// GT_CHAPTER select
			GTMgr.inst.GetGTChapter().find({
				where : { UUID : p_uuid, CHAPTER_ID : p_chapter_id, EXIST_YN : true }
			})
			.then(p_ret_chapter => { resolve(p_ret_chapter); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectStage = function(p_uuid, p_chapter_id, p_stage_id) {
		return new Promise(function (resolve, reject) {
			// GT_STAGE select
			GTMgr.inst.GetGTStage().find({
				where : { UUID : p_uuid, CHAPTER_ID : p_chapter_id, STAGE_ID : p_stage_id, EXIST_YN : true }
			})
			.then(p_ret_stage => { resolve(p_ret_stage); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectDarkDungeon = function(p_uuid, p_chapter_id, p_curr_stage_id) {
		return new Promise(function (resolve, reject) {
			// GT_DARK_DUNGEON select
			GTMgr.inst.GetGTDarkDungeon().find({
				where : { UUID : p_uuid, CHAPTER_ID : p_chapter_id, CURR_STAGE_ID : p_curr_stage_id, EXIST_YN : true }
			})
			.then(p_ret_stage => { resolve(p_ret_stage); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;