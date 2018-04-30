/********************************************************************
Title : LoadGTHero
Date : 2017.02.17
Update : 2017.04.17
Writer : jongwwok
Desc : Promise 로드 - 영웅
********************************************************************/
var GTMgr = require('../GTMgr.js');
var mkDB  = require('../mkDB.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectHero = function(p_uuid, p_hero_id) {
		return new Promise(function (resolve, reject) {
			// GT_HERO select
			GTMgr.inst.GetGTHero().find({
				where : { UUID : p_uuid, HERO_ID : p_hero_id, EXIST_YN : true }
			})
			.then(p_ret_hero => { resolve(p_ret_hero); })
			.catch(p_error =>  { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectHeroList = function(p_uuid, p_hero_id_list) {
		return new Promise(function (resolve, reject) {
			// GT_HERO select
			GTMgr.inst.GetGTHero().findAll({
				where : { UUID : p_uuid, HERO_ID : p_hero_id_list, EXIST_YN : true }
			})
			.then(p_ret_hero_list => { resolve(p_ret_hero_list); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectTeam = function(p_uuid, p_team_id) {
		return new Promise((resolve, reject) => {
			console.log('확인용 uuid : %d, team_id : %d', p_uuid, p_team_id);
			GTMgr.inst.GetGTTeam().find({
				where : { UUID : p_uuid, TEAM_ID : p_team_id }
			})
			.then(p_ret => { 
				// if ( p_ret == null ) { throw ([ PacketRet.inst.retFail(), 'Not Find Team']); } // null 일 수도 있다. 
				resolve(p_ret); 
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetHeroInTeam = function(p_uuid, p_team_id) {
		return new Promise((resolve, reject) => {

			return  mkDB.inst.GetSequelize().query('select B.HERO_ID, B.HERO_LEVEL, B.REINFORCE_STEP, B.EVOLUTION_STEP \
									from GT_TEAMs as A \
									left join GT_HEROes as B on B.UUID = A.UUID and B.HERO_ID in (A.SLOT1, A.SLOT2, A.SLOT3, A.SLOT4) \
									where A.UUID = ? and A.TEAM_ID = ?;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_uuid, p_team_id ]
			).then(p_ret => {

				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'GetHeroInTeam']) })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetSkillByTeamHero = function(p_uuid, p_slot_list) {
		return new Promise((resolve, reject) => {
			// GT_HERO_SKILL select
			GTMgr.inst.GetGTHeroSkill().findAll({
				where : { UUID : p_uuid, HERO_ID : { in : p_slot_list } }
			})
			.then(p_ret => {
				resolve(p_ret); 
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetEquipMentByTeamHero = function(p_uuid, p_slot_list) {
		return new Promise((resolve, reject) => {

			return  mkDB.inst.GetSequelize().query('select A.HERO_ID, B.* from \
									(select * from GT_EQUIPMENT_ITEMs  \
										where UUID = ? and HERO_ID in (?,?,?,?)) as A \
									left join GT_INVENTORies as B on B.UUID = A.UUID  \
										and B.IUID in (A.IUID_1, A.IUID_2, A.IUID_3, A.IUID_4);',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_uuid, ...p_slot_list ]
			).then(p_ret => {

				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'GetEquipMentByTeamHero']) })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;