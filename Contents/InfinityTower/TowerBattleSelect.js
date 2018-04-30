/********************************************************************
Title : TowerBattleSelect
Date : 2016.04.22
Update : 2017.04.03
Desc : 무한탑 배틀 층 - 난이도 선택
writer: jongwook
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var LoadGTUser = require('../../DB/GTLoad/LoadGTUser.js');
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
	var InsertOrUpdateTowerBattleSelect = function(p_t, p_uuid, p_ret_tower, p_floor, p_floor_type, p_battle_type, p_ticket, p_score, p_challenge_point) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_tower == null ) {
				// GT_INFINITY_TOWER_FLOOR insert
				GTMgr.inst.GetGTInfinityTowerFloor().create({
					UUID			: p_uuid,
					FLOOR			: p_floor,
					FLOOR_TYPE		: p_floor_type,
					BATTLE_TYPE		: p_battle_type,
					REWARD_TICKET	: p_ticket,
					REWARD_SCORE	: p_score,
					CHALLENGE_POINT	: p_challenge_point,
					LAST_DATE		: Timer.inst.GetNowByStrDate(),
					REG_DATE		: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_tower_insert => {
					console.log('SetTowerBattleEntrance insert', p_uuid);
					resolve(p_ret_tower_insert);
				})
				.catch(p_error => { reject(p_error); });
			} else {
				// GT_INFINITY_TOWER_FLOOR update
				p_ret_tower.updateAttributes({
					BATTLE_TYPE		: p_battle_type,
					REWARD_TICKET	: p_ticket,
					REWARD_SCORE	: p_score,
					CHALLENGE_POINT	: p_challenge_point,
					LAST_DATE		: Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_tower_update => {
					console.log('SetTowerBattleEntrance update', p_uuid);
					resolve(p_ret_tower_update);
				})
				.catch(p_error => { reject(p_error); });
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_values, p_uuid, p_floor, p_floor_type, p_battle_type, p_ticket, p_socre, p_challenge_point, p_battle_bot_hero_list) {
		// console.log('values', values);
		let ret_tower_user = p_values[0]
		let ret_tower_floor = p_values[1];
		let ret_tower_bot_hero = p_values[2];

		return new Promise(function (resolve, reject) {
			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				Promise.all([
					SetGTTower.inst.InsertOrUpdateTowerUser(t, p_uuid, ret_tower_user, p_floor),
					InsertOrUpdateTowerBattleSelect(t, p_uuid, ret_tower_floor, p_floor, p_floor_type, p_battle_type, p_ticket, p_socre, p_challenge_point),
					SetGTTower.inst.InsertOrUpdateTowerBattleBotHero(t, ret_tower_bot_hero, p_uuid, p_battle_bot_hero_list)
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
	// 무한탑 배틀 : 난이도 선택
	inst.ReqTowerBattleSelect = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerBattleSelect', p_user.uuid, p_recv);

		var recv_floor		= parseInt(p_recv.floor);
		var recv_battle_type= parseInt(p_recv.battle_type);

		// battle_type 0:선택 안함, 1:하급, 2:중급, 3:상급, 4:강적
		// 강적은 보상이 추가로 있다.
		var base_tower = BaseTower.inst.GetTowerFloor(recv_floor);
		if ( typeof base_tower === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', recv_floor);
			return;
		}

		if ( base_tower.floor_type != DefineValues.inst.InfinityTowerBattleFloor && base_tower.floor_type != DefineValues.inst.InfinityTowerSecretMazeFloor ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotMatchTowerFloorType(), 'Floor', recv_floor, 'Floor Type', base_tower.floor_type);
			return;
		}

		let battle_reward = base_tower.GetBattleReward(recv_battle_type);
		if ( typeof battle_reward === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'No find battle_type in Base floor', recv_floor, recv_battle_type);
			return;
		}

		console.log('Reward Ticket: %d, Score: %d Awake Battle Challenge Point: %d', battle_reward.ticket, battle_reward.score, base_tower.awake_reward_challenge_point);

		// Promise.all GO!
		Promise.all([
			LoadGTTower.inst.SelectTowerUser(p_user.uuid),
			LoadGTTower.inst.SelectTowerFloor(p_user.uuid, recv_floor),
			LoadGTTower.inst.SelectBattleBotHeroList(p_user.uuid)	// 배틀 상대 정보
		])
		.then(values => {
			return ProcessTransaction(values, p_user.uuid, recv_floor, base_tower.floor_type, recv_battle_type, battle_reward.ticket, battle_reward.score, base_tower.awake_reward_challenge_point, p_recv.battle_bot_hero_list);
		})
		.then(values => {
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