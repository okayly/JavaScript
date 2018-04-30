/********************************************************************
Title : LoadGTTower
Date : 2017.03.17
Update : 2017.03.17
Writer : jongwook
Desc : Promise 로드 - 무한탑
********************************************************************/
var GTMgr = require('../GTMgr.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 타워 층 정보
	inst.SelectTowerFloor = function(p_uuid, p_floor) {
		return new Promise(function (resolve, reject) {
			// GT_USER select
			GTMgr.inst.GetGTInfinityTowerFloor().find({
				where : { UUID : p_uuid, FLOOR : p_floor, EXIST_YN : true }
			})
			.then(p_ret_tower => { resolve(p_ret_tower); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 타워 유저 정보
	inst.SelectTowerUser = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_USER select
			GTMgr.inst.GetGTInfinityTowerUser().find({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret_user => { resolve(p_ret_user); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 배틀 봇 기본 정보
	inst.SelectBattleBotList = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_USER select
			GTMgr.inst.GetGTInfinityTowerBattleBot().findAll({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret_battle_bot_list => { resolve(p_ret_battle_bot_list); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 배틀 봇 상세 정보
	inst.SelectBattleBotHeroList = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_BATTLE_BOT_HERO select
			GTMgr.inst.GetGTInfinityTowerBattleBotHero().findAll({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret_battle_bot_hero_list => { resolve(p_ret_battle_bot_hero_list); })
			.catch(p_error => { reject(p_error); });
		});
	}	

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;