/********************************************************************
Title : LoadGTPVP
Date : 2017.03.02
Update : -
Writer : dongsu
Desc : 
********************************************************************/
var GTMgr = require('../GTMgr.js');
var mkDB = require('../mkDB.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.GetPVP = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_HERO select
			GTMgr.inst.GetGTPVP().find({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret => { 
				if ( p_ret == null ) { throw ([ PacketRet.inst.retFail(), 'Not Find PVP']); }
				resolve(p_ret); 
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetPVPByLeague = function(p_league_id) {
		return new Promise(function (resolve, reject) {

			return  mkDB.inst.GetSequelize().query('select B.UUID, B.NICK, B.ICON, B.USER_LEVEL, A.PVP_ELO, E.BATTLE_POWER, \
									ifnull(D.GUILD_NAME, \'\') as GUILD_NAME from \
									(select * from GT_PVPs where LEAGUE_ID = ? order by PVP_ELO desc limit 50) as A \
									left join GT_USERs as B on A.UUID = B.UUID \
									left join GT_TEAMs as E on A.UUID = E.UUID and E.TEAM_ID = 7 \
									left join GT_GUILD_MEMBERs as C on A.UUID = C.UUID \
									left join GT_GUILDs as D on D.GUILD_ID = C.GUILD_ID;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_league_id ]
			).then(p_ret => {

				// if ( p_ret == null ) { 
				// 	throw ([ PacketRet.inst.retFail(), 'Not Find PVP League Rank']); 
				// }
				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'GetPVPByLeague']) })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetPVPByGroup = function(p_league_id, p_group_id, p_page_num) {
		return new Promise(function (resolve, reject) {

			let limit_min = p_page_num * 20;
			return  mkDB.inst.GetSequelize().query('select B.UUID, B.NICK, B.ICON, B.USER_LEVEL, A.PVP_ELO,  E.BATTLE_POWER, \
									ifnull(D.GUILD_NAME, \'\') as GUILD_NAME from  \
									(select * from GT_PVPs where LEAGUE_ID = ? and GROUP_ID = ? order by PVP_ELO desc limit ?, 20) as A \
									left join GT_USERs as B on A.UUID = B.UUID \
									left join GT_TEAMs as E on A.UUID = E.UUID and E.TEAM_ID = 7 \
									left join GT_GUILD_MEMBERs as C on A.UUID = C.UUID \
									left join GT_GUILDs as D on D.GUILD_ID = C.GUILD_ID;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_league_id, p_group_id, limit_min ]
			).then(p_ret => {

				// if ( p_ret == null ) { throw ([ PacketRet.inst.retFail(), 'Not Find PVP Group Rank']); }
				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'GetPVPByGroup']) })
		});
	}

	inst.GetJoinGroup = function(p_league_id) {
		return new Promise(function (resolve, reject) {

			return  mkDB.inst.GetSequelize().query('select A.* from \
									(select GROUP_ID, count(*) as CNT from GT_PVPs \
									where LEAGUE_ID = ? group by GROUP_ID order by CNT asc) as A \
									where A.CNT < 100 limit 1;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_league_id ]
			).then(p_ret => {

				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'GetJoinGroup']) })
		});
	}

	inst.GetGroupMaxIndex = function(p_league_id) {
		return new Promise((resolve, reject) => {
			GTMgr.inst.GetGTPVP().max( 'GROUP_ID',
				{ where : { LEAGUE_ID : p_league_id, EXIST_YN : true }
			})
			.then(function (p_ret){
				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'GetGroupMaxIndex']) })
		});
	}

	inst.GetTargetDefaultInfo = function(p_uuid) {
		return new Promise((resolve, reject) => {
			return  mkDB.inst.GetSequelize().query('select A.NICK, A.ICON, A.USER_LEVEL, B.SLOT1, B.SLOT2, B.SLOT3, B.SLOT4 \
									from GT_USERs as A \
									left join GT_TEAMs as B on A.UUID = B.UUID and B.TEAM_ID = 7 \
									where A.UUID = ?;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_uuid ]
			).then(p_ret => {

				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'GetTargetDefaultInfo']) })
		});
	}

	inst.GetRecord = function(p_uuid) {
		return new Promise((resolve, reject) => {
			GTMgr.inst.GetGTPVPRecord().findAll({
				where: { UUID: p_uuid }, limit:10, order: 'REG_DATE desc' 
			})
			.then( p_ret => {
				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'GetRecord']) })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;