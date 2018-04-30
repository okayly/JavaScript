/********************************************************************
Title : DailyContentsMgr
Date : 2016.04.26
update : 2017.04.07
Desc : 일일 컨텐츠 메니저
	   랭킹전, 무한탑 일일 보상
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');
var MailMgr = require('../Mail/MailMgr.js');

var DailyTower = require('./DailyTower.js');

var DefineValues = require('../../Common/DefineValues.js');

var BasePVP = require('../../Data/Base/BasePVP.js');
var BaseLevelUnlock	= require('../../Data/Base/BaseLevelUnlock.js');

var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 가챠 얻기
	var GetGachaList = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_GACHA select
			GTMgr.inst.GetGTGacha().findAll({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret_gacha_list => { resolve(p_ret_gacha_list); })
			.catch(p_error => { reject(p_error); });
		});
	}

	// 예언의 샘 얻기
	var GetStageList = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_STAGE select
			GTMgr.inst.GetGTStage().findAll({
				where : { UUID : p_uuid, CHAPTER_TYPE : DefineValues.inst.ScenarioHard }	// 조건
			})
			.then(p_ret_stage_list => { resolve(p_ret_stage_list); })
			.catch(p_error => { reject(p_error); });
		});
	}

	// 일일 컨텐츠 얻기
	var GetDailyContents = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_DAILY_CONTENTS select
			GTMgr.inst.GetGTDailyContents().find({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret_daily_contents => { resolve(p_ret_daily_contents); })
			.catch(p_error => { reject(p_error); });
		});
	}

	var SetGacha = function(p_ret_gacha_list, p_t) {
		return new Promise(function (resolve, reject) {
			// Promise.all GO!
			Promise.all(p_ret_gacha_list.map(row => {
				return row.updateAttributes({ DAILY_GACHA_COUNT: 0 }, { transaction : p_t });
			}))
			.then(values => {
				console.log('SetGacha length', values.length);
				resolve(values);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	var SetStage = function(p_ret_stage_list, p_t) {
		return new Promise(function (resolve, reject) {
			// Promise.all GO!
			Promise.all(p_ret_stage_list.map(row => {
				row.updateAttributes({ ABLE_COUNT: 3 }, { transaction : p_t });
			}))
			.then(values => {
				console.log('SetStage length', values.length);
				resolve(values);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	var SetDailyContents = function(p_ret_daily_contents, p_t) {
		return new Promise(function (resolve, reject) {
			p_ret_daily_contents.updateAttributes({
				BUY_STAMINA_COUNT					: 0,
				BUY_GOLD_COUNT						: 0,
				BUY_ADD_ATTEND_COUNT				: 0,
				SHOP_RESET_COUNT					: 0,	// 상점 리셋 수
				GUILD_POINT_DONATION_COUNT			: DefineValues.inst.GuilddonateCount,	// 길드 포인트 기부
				GUILD_RAID_BATTLE_COUNT				: DefineValues.inst.GuildRaidPlayCount,		// 길드 레이드 참여 수
				FRIEND_REQUEST_COUNT				: DefineValues.inst.FriendOneDayRequestCount,	// 친구 요청 수
				FRIEND_DELETE_COUNT					: DefineValues.inst.Friend_DeleteMax,	// 친구 삭제 수
				EXEC_WEEKLY_DUNGEON_PLAY_COUNT		: 0,		// 요일 던전 플레이 수
				PVP_GAIN_HONOR_POINT 				: 0,
				PVP_PLAY_COUNT 						: 0
			}, { transaction : p_t })
			.then(value => {
				console.log('SetDailyContents uuid', value.dataValues.UUID);
				resolve(value);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	var SetTransactionNewDay = function(p_values) {
		return new Promise(function (resolve, reject) {
			let ret_gacha_list = p_values[0];
			let ret_stage_list = p_values[1];
			let ret_daily_contents = p_values[2];

			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetGacha(ret_gacha_list, t),
					SetStage(ret_stage_list, t),
					SetDailyContents(ret_daily_contents, t)
				])
				.then(values => {
					t.commit();

					resolve(values);
				})
				.catch(p_error => {
					if (t)
						t.rollback();

					reject(p_error);
				});
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 05:00 날자 변경
	inst.NewDay = function(p_ret_user) {
		logger.info('Start NewDay !!');

		var user_data = p_ret_user.dataValues;
		
		// Promise.all GO!
		Promise.all([
			GetGachaList(user_data.UUID),
			GetStageList(user_data.UUID),
			GetDailyContents(user_data.UUID)
		])
		.then(values => {
			return SetTransactionNewDay(values);
		})
		.then(values => {
			// PVP
			NewDayPVPReward(user_data.UUID);

			let base_unlock = BaseLevelUnlock.inst.GetLevelUnlock(user_data.USER_LEVEL);
				
			if ( typeof base_unlock === 'undefined' ) {
				logger.error('Not Exist LevelUnlock In Base level', user_data.USER_LEVEL);
				return;
			}

			// 무한탑
			if ( base_unlock.open_accountbuff == true ) {
				DailyTower.inst.NewDayInfinityTower(user_data.UUID, user_data.VIP_STEP);
			}

			logger.info('Finish NewDay !!');
		})
		.catch(p_error => {
			logger.error('Error NewDay - Gacha', p_error);
		});
	}

	// TODO : promise 적용으로 LoadPVP로 이동 해야 한다. 
	//------------------------------------------------------------------------------------------------------------------
	var NewDayPVPReward = function(p_uuid) {
		// mkDB.inst.GetSequelize().query('select A.*, 
		// 					(select count(*) + 1 from GT_PVPs where PVP_ELO > A.PVP_ELO and GROUP_ID = 
		// 					(select GROUP_ID from GT_PVPs where UUID = 26)) as RANK 
		// 				    from GT_PVPs as A where UUID = 26 order by PVP_ELO desc;


		// 		select A.*, 
		// 					(select count(*) + 1 from GT_PVPs 
		// 						where PVP_ELO > A.PVP_ELO ) as RANK 
		// 					from GT_PVPs as A where  group by  order by PVP_ELO desc;',
		// 		null,
		// 		{ raw : true, type : 'SELECT' },
		// 		[ p_group_id, p_page_num ]
		// ).then(p_ret => {

		// 	if ( p_ret == null ) { throw ([ PacketRet.inst.retFail(), 'Not Find PVP Group Rank']); }
		// 	resolve(p_ret);
		// })
		// .catch(p_error => { reject([p_error, 'GetPVPByGroup']) })

		// GTMgr.inst.GetGTPVP().find({
		// 	where : { UUID : p_uuid, EXIST_YN : true }
		// })
		// .then(p_ret => {
		// 	if ( p_ret == null ) { 
		// 		logger.error('Error NewDay - Not Find PVP Info', p_error);
		// 	}

		// 	let pvp_data = p_ret.dataValues;
		// 	if ( pvp_data.PVP_PLAY_COUNT != 0 ) {
		// 		let base_reward = BasePVP.inst.GetPvPDailyReward(pvp_data.league_id, pvp_data.)
		// 	}
		// })
		// .catch( p_error => {
		// 	logger.error('Error NewDay - NewDayPVPReward', p_error);
		// })
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;