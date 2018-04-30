/********************************************************************
Title : TowerBattleSkip
Date : 2016.04.08
Update : 2017.04.03
Desc : 무한탑 - 배틀 스킵
writer: jongwook
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');

var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');

var SetGTTower = require('../../DB/GTSet/SetGTTower.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseTower = require('../../Data/Base/BaseTower.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_values, p_ticket, p_score, p_challenge_point) {
		// console.log('p_values', p_values);
		let ret_tower_user = p_values[0]
		let ret_tower = p_values[1];

		// 배틀 층 : 배틀 타입 검사
		if ( ret_tower.dataValues.FLOOR_TYPE != DefineValues.inst.InfinityTowerBattleFloor ) {
			throw ([ PacketRet.inst.retNotMatchTowerFloorType() ]);
		}

		let today_ticket = ret_tower_user.dataValues.TODAY_TICKET + p_ticket;
		let today_score = ret_tower_user.dataValues.TODAY_SCORE + p_score;
		let accum_score = ret_tower_user.dataValues.ACCUM_SCORE + p_score;
		let rank_score = today_score + ( accum_score * DefineValues.inst.InfinityTowerRankScorePlusPercent );
		let battle_type = DefineValues.inst.InfinityTowerBattleHigh;
		let clear_grade = DefineValues.inst.MaxStageClearGrade;

		return new Promise(function (resolve, reject) {
			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetGTTower.inst.UpdateTowerUserBattleFinish(t, ret_tower_user, today_ticket, today_score, accum_score, rank_score),
					SetGTTower.inst.UpdateTowerBattleFinish(t, ret_tower, battle_type, clear_grade)
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
	// 무한탑 배틀 층 스킵
	inst.ReqTowerBattleSkip = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerBattleSkip', p_user.uuid, p_recv);

		var recv_floor = parseInt(p_recv.floor);

		let base_tower = BaseTower.inst.GetTowerFloor(recv_floor);
		if ( typeof base_tower === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', recv_floor);
			return;
		}

		// 보상 점수와 티켓은 난이도 상의 보상
		let battle_type = DefineValues.inst.InfinityTowerBattleHigh;

		let battle_reward = base_tower.GetBattleReward(battle_type);
		if ( typeof battle_reward === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower Reward In Base Floor', recv_floor, 'Battle Type', battle_type);
			return;
		}

		console.log('Reward Ticket: %d, Score: %d Awake Battle Challenge Point: %d', battle_reward.ticket, battle_reward.score, base_tower.awake_reward_challenge_point);

		// Promise.all GO!
		Promise.all([
			LoadGTTower.inst.SelectTowerUser(p_user.uuid),
			LoadGTTower.inst.SelectTowerFloor(p_user.uuid, recv_floor)
		])
		.then(values => {
			let ret_tower_user = values[0];

			// if ( recv_floor > ret_tower_user.dataValues.SKIP_POINT )
			// 	throw([ PacketRet.inst.retIncorrectTowerSkipPointFloor(), 'Floor', recv_floor, 'Skip Point', ret_tower_user.dataValues.SKIP_POINT ]);

			return ProcessTransaction(values, battle_reward.ticket, battle_reward.score, base_tower.awake_reward_challenge_point);
		})
		.then(values => {
			let ret_tower_user = values[0];
			let ret_tower = values[1];

			p_ack_packet.floor			= ret_tower.dataValues.FLOOR;
			p_ack_packet.ticket			= ret_tower_user.dataValues.TODAY_TICKET;
			p_ack_packet.daily_score	= ret_tower_user.dataValues.TODAY_SCORE;
			p_ack_packet.accum_score	= ret_tower_user.dataValues.ACCUM_SCORE;

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