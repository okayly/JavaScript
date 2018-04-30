/********************************************************************
Title : TowerBattleFinish
Date : 2016.04.22
Update : 2017.04.03
Desc : 무한탑 배틀 층 - 배틀 종료
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');

var SetGTTower = require('../../DB/GTSet/SetGTTower.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseTower = require('../../Data/Base/BaseTower.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};	

	//------------------------------------------------------------------------------------------------------------------
	var SelectTowerTeam = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_RECORD select
			GTMgr.inst.GetGTInfinityTowerTeam().find({
				where : { UUID : p_uuid, EXIST_YN : true }
			})
			.then(p_ret_team => {
				if ( p_ret_team == null ) {
					// GT_INFINITY_TOWER_RECORD insert
					GTMgr.inst.GetGTInfinityTowerTeam().create({
						UUID : p_uuid,
						REG_DATE : Timer.inst.GetNowByStrDate()
					})
					.then(p_ret_team_insert => { resolve(p_ret_team_insert); })
					.catch(p_error => { reject(p_error); });
				} else {
					resolve(p_ret_team);
				}
			})
			.catch(p_error => { reject(p_ret_team); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var UpdateTowerTeam = function(p_t, p_ret_tower_team, p_hero_list) {
		return new Promise(function (resolve, reject) {
			// console.log('UpdateTowerTeam p_hero_list', p_hero_list);
			for ( let cnt = 0; cnt < DefineValues.inst.MaxTeamSlot; ++cnt ) {
				(function (cnt) {
					// console.log('hero_data', p_hero_list[cnt]);
					let column	= cnt + 1;

					p_ret_tower_team['HERO_ID' + column] = (typeof p_hero_list[cnt] === 'undefined') ? 0 : p_hero_list[cnt].hero_id;
				})(cnt);
			}

			// GT_INFINITY_TOWER_TEAM update
			p_ret_tower_team.save({ transaction : p_t })
			.then(p_ret_team => {
				console.log('UpdateTowerTeam update', p_ret_team.dataValues.UUID);
				resolve(p_ret_team);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_values, p_uuid, p_battle_type, p_clear_grade, p_battle_bot_hero_list, p_hero_list) {
		// console.log('p_values', p_values);
		let ret_tower_user = p_values[0]
		let ret_tower = p_values[1];
		let ret_tower_bot_hero_list = p_values[2];
		let ret_tower_team = p_values[3];

		// 배틀 층 : 배틀 타입 검사, 비밀미로 층 : 배틀 타입 무시
		if ( ret_tower.dataValues.FLOOR_TYPE == DefineValues.inst.InfinityTowerBattleFloor &&
			 ret_tower.dataValues.BATTLE_TYPE != p_battle_type ) {
			throw ([ PacketRet.inst.retNotMatchTowerFloorType(), 'Floor', ret_tower.dataValues.FLOOR, 'Floor Type', ret_tower.dataValues.FLOOR_TYPE]);
		}

		// 3성으로 클리어 하면 난이도 별로 추가 점수
		let reward_score = ret_tower.dataValues.REWARD_SCORE;
		if ( p_clear_grade == DefineValues.inst.MaxStageClearGrade ) {
			switch (ret_tower.dataValues.BATTLE_TYPE) {
				case DefineValues.inst.InfinityTowerBattleHigh : 
					reward_score = reward_score * DefineValues.inst.InfinityTowerHighBouns;
					break;

				case DefineValues.inst.InfinityTowerBattleMiddle :
					reward_score = reward_score * DefineValues.inst.InfinityTowerMiddleBouns;
					break;
			}
		}

		let today_ticket = ret_tower_user.dataValues.TODAY_TICKET + ret_tower.dataValues.REWARD_TICKET;
		let today_score = ret_tower_user.dataValues.TODAY_SCORE + reward_score;
		let accum_score = ret_tower_user.dataValues.ACCUM_SCORE + reward_score;
		let rank_score = today_score + (accum_score * DefineValues.inst.InfinityTowerRankScorePlusPercent);

		return new Promise(function (resolve, reject) {
			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetGTTower.inst.UpdateTowerUserBattleFinish(t, ret_tower_user, today_ticket, today_score, accum_score, rank_score),
					SetGTTower.inst.UpdateTowerBattleFinish(t, ret_tower, p_battle_type, p_clear_grade),
					SetGTTower.inst.InsertOrUpdateTowerBattleBotHero(t, ret_tower_bot_hero_list, p_uuid, p_battle_bot_hero_list),
					UpdateTowerTeam(t, ret_tower_team, p_hero_list),
					SetGTTower.inst.SetTowerBattleHero(p_uuid, p_hero_list, t)
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
	// 무한탑 배틀 : 종료
	inst.ReqTowerBattleFinish = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerBattleFinish', p_user.uuid, p_recv);

		let recv_floor		= parseInt(p_recv.floor);
		let recv_battle_type= parseInt(p_recv.battle_type);
		let recv_clear_grade= parseInt(p_recv.clear_grade);

		// 배틀 보상 - 강적은 도전 포인트 추가 보상이 있다.
		// Promise.all GO!
		Promise.all([
			LoadGTTower.inst.SelectTowerUser(p_user.uuid),
			LoadGTTower.inst.SelectTowerFloor(p_user.uuid, recv_floor),
			LoadGTTower.inst.SelectBattleBotHeroList(p_user.uuid),
			SelectTowerTeam(p_user.uuid)
		])
		.then(values => {
			return ProcessTransaction(values, p_user.uuid, recv_battle_type, recv_clear_grade, p_recv.battle_bot_hero_list, p_recv.hero_list);
		})
		.then(values => {
			let ret_tower_user = values[0];
			let ret_tower = values[1];

			p_ack_packet.ticket			= ret_tower_user.dataValues.TODAY_TICKET;
			p_ack_packet.daily_score	= ret_tower_user.dataValues.TODAY_SCORE;
			p_ack_packet.accum_score	= ret_tower_user.dataValues.ACCUM_SCORE;
			p_ack_packet.rank_score		= ret_tower_user.dataValues.TODAY_RANK_SCORE;
			p_ack_packet.challenge_point= ret_tower.dataValues.CHALLENGE_POINT;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error =>{
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;