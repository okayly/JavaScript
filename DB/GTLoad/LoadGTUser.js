/********************************************************************
Title : LoadGTUser
Date : 2017.02.17
Update : 2017.04.11
Writer : dongsu -> jongwook
Desc : Promise 로드 - 유저
********************************************************************/
var GTMgr = require('../GTMgr.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectUser = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_USER select
			GTMgr.inst.GetGTUser().find({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret_user => { resolve(p_ret_user); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectUserByNick = function(p_nick) {
		return new Promise(function (resolve, reject) {
			// GT_USER select
			GTMgr.inst.GetGTUser().find({
				where : { NICK : p_nick, EXIST_YN : true }
			})
			.then(p_ret_user => { resolve(p_ret_user); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.SelectDaily = function(p_uuid) {
		return new Promise((resolve, reject) => {
			// GT_DAILY_CONTENTS select
			GTMgr.inst.GetGTDailyContents().find({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret => {
				if ( p_ret == null )
					throw([ PacketRet.inst.retFail(), 'Not Find User In Daily']);

				resolve(p_ret);
			})
			.catch(p_error => { reject(p_error); })
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;