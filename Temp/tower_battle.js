/********************************************************************
Title : TowerBattleFloor
Date : 2016.04.22
Update : 2017.03.15
Desc : 무한탑 배틀 층 - 입장, 난이도 선택, 종료
writer: jongwook
********************************************************************/
var GTMgr	= require('../../DB/GTMgr.js');
var TowerMgr= require('./TowerMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseTower = require('../../Data/Base/BaseTower.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 배틀 층 입장
	inst.ReqTowerBattleEntrance = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerBattleEntrance', p_user.uuid, p_recv);

		var floor		= parseInt(p_recv.floor);
		var battle_type	= parseInt(p_recv.battle_type);

		// battle_type 0:선택 안함, 1:하급, 2:중급, 3:상급, 4:강적
		// 강적은 보상이 추가로 있다.
		var tower_base = BaseTower.inst.GetTowerFloor(floor);
		if ( typeof tower_base === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', floor);
			return;
		}

		if ( tower_base.floor_type != DefineValues.inst.InfinityTowerBattleFloor ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotMatchTowerFloorType(), 'Floor', floor, 'Floor Type', tower_base.floor_type);
			return;
		}

		// GT_INFINITY_TOWER_FLOOR select
		GTMgr.inst.GetGTInfinityTowerFloor().find({
			where : { UUID : p_user.uuid, FLOOR : floor, EXIST_YN : true }
		})
		.then(function (p_ret_floor) {
			var str_now = Timer.inst.GetNowByStrDate();

			// console.log('p_ret_floor:', p_ret_floor);
			if ( p_ret_floor == null ) {
				// GT_INFINITY_TOWER_FLOOR insert
				GTMgr.inst.GetGTInfinityTowerFloor().create({
					UUID		: p_user.uuid,
					FLOOR		: floor,
					FLOOR_TYPE	: tower_base.floor_type,
					BATTLE_TYPE	: battle_type,
					UPDATE_DATE	: str_now,
					REG_DATE	: str_now
				})
				.then(function (p_ret_floor_create) {
					console.log('UUID : %d, Create Tower Floor', p_user.uuid, p_ret_floor_create.dataValues.FLOOR);

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleEntrance - 3');
				});
			} else {
				// GT_INFINITY_TOWER_FLOOR update
				p_ret_floor.updateAttributes({
					UUID		: p_user.uuid,
					FLOOR		: floor,
					FLOOR_TYPE	: tower_base.floor_type,
					BATTLE_TYPE	: battle_type,
					UPDATE_DATE	: str_now
				})
				.then(function (p_ret_floor_update) {
					console.log('UUID : %d, Update Tower Floor', p_user.uuid, p_ret_floor_update.dataValues.FLOOR);

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleEntrance - 2');
				});
			}

			// 시간 갱신
			TowerMgr.inst.UpdateTowerUser(p_user, floor);

			// BattleBot
			TowerMgr.inst.SaveTowerBattleBot(p_user, p_recv.battle_bot_list);
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleEntrance - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 배틀 : 난이도 선택
	inst.ReqTowerBattleSelect = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerBattleSelect', p_user.uuid, p_recv);

		var floor		= parseInt(p_recv.floor);
		var battle_type	= parseInt(p_recv.battle_type);

		// battle_type 0:선택 안함, 1:하급, 2:중급, 3:상급, 4:강적
		// 강적은 보상이 추가로 있다.
		var tower_base = BaseTower.inst.GetTowerFloor(floor);
		if ( typeof tower_base === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', floor);
			return;
		}

		if ( tower_base.floor_type != DefineValues.inst.InfinityTowerBattleFloor ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotMatchTowerFloorType(), 'Floor', floor, 'Floor Type', tower_base.floor_type);
			return;
		}
			
		// GT_INFINITY_TOWER_FLOOR select
		GTMgr.inst.GetGTInfinityTowerFloor().find({
			where :{ UUID : p_user.uuid, FLOOR : floor, EXIST_YN : true }
		})
		.then(function (p_ret_floor) {
			// console.log('p_ret_floor:', p_ret_floor.dataValues);
			var str_now = Timer.inst.GetNowByStrDate();
			var ticket	= 0;
			var score	= 0;

			var battle_reward = tower_base.GetBattleReward(battle_type);
			if ( typeof battle_reward !== 'undefined' ) {
				ticket	= battle_reward.ticket;
				score	= battle_reward.score;
			}
			console.log('Reward Ticket: %d, Score: %d Awake Battle Challenge Point: %d', ticket, score, tower_base.awake_reward_challenge_point);

			if ( p_ret_floor == null ) {
				// GT_INFINITY_TOWER_FLOOR insert
				GTMgr.inst.GetGTInfinityTowerFloor().create({
					UUID			: p_user.uuid,
					FLOOR			: floor,
					FLOOR_TYPE		: tower_base.floor_type,
					BATTLE_TYPE		: battle_type,
					REWARD_TICKET	: ticket,
					REWARD_SCORE	: score,
					CHALLENGE_POINT	: tower_base.awake_reward_challenge_point,
					UPDATE_DATE		: str_now,
					REG_DATE		: str_now
				})
				.then(function (p_ret_floor_create) {
					console.log('UUID : %d, Create Battle Floor', p_user.uuid, p_ret_floor_create.dataValues.FLOOR);

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

					// 시간 갱신
					TowerMgr.inst.UpdateTowerUser(p_user, floor);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleSelect - 3');
				});
			} else {
				// GT_INFINITY_TOWER_FLOOR update
				p_ret_floor.updateAttributes({
					BATTLE_TYPE		: battle_type,
					REWARD_TICKET	: ticket,
					REWARD_SCORE	: score,
					CHALLENGE_POINT	: tower_base.awake_reward_challenge_point,
					UPDATE_DATE		: str_now
				})
				.then(function (p_ret_floor_update) {
					console.log('UUID : %d, Update Battle Floor', p_user.uuid, p_ret_floor_update.dataValues.FLOOR);

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

					// 시간 갱신
					TowerMgr.inst.UpdateTowerUser(p_user, floor);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleSelect - 2');
				});
			}

			// console.log('recv.battle_bot_tag_hero_list', p_recv.battle_bot_tag_hero_list);
			TowerMgr.inst.SaveTowerBattleBotHero(p_user, p_recv.battle_bot_hero_list, p_recv.battle_bot_tag_hero_list);
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleSelect - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 배틀 : 종료
	inst.ReqTowerBattleFinish = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerBattleFinish', p_user.uuid, p_recv);

		var floor		= parseInt(p_recv.floor);
		var battle_type	= parseInt(p_recv.battle_type);
		var clear_grade	= parseInt(p_recv.clear_grade);

		// 배틀 보상 - 강적은 도전 포인트 추가 보상이 있다.
		// GT_INFINITY_TOWER_FLOOR select
		GTMgr.inst.GetGTInfinityTowerFloor().find({
			where : { UUID : p_user.uuid, FLOOR : floor, EXIST_YN : true }
		})
		.then(function (p_ret_floor) {			
			// console.log('p_ret_floor:', p_ret_floor);
			if ( p_ret_floor == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Floor In GT_INFINITY_TOWER_FLOOR Floor', floor);
				return;
			}
			var floor_data = p_ret_floor.dataValues;
			var str_now = Timer.inst.GetNowByStrDate();

			// GT_INFINITY_TOWER_FLOOR update
			p_ret_floor.updateAttributes({
				BATTLE_CLEAR_GRADE : clear_grade,
				UPDATE_DATE : str_now
			})
			.then(function (p_ret_floor_update) {
				logger.info('UUID : %d, Update Floor', p_user.uuid, p_ret_floor_update.dataValues.FLOOR, p_ret_floor_update.dataValues.UPDATE_DATE);
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleFinish - 5');
			});
			
			// 배틀 층 : 배틀 타입 검사, 비밀미로 층 : 배틀 타입 무시
			if ( floor_data.FLOOR_TYPE == DefineValues.inst.InfinityTowerBattleFloor && floor_data.BATTLE_TYPE != battle_type ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotMatchTowerFloorType(), 'Floor', floor_data.FLOOR, 'Floor Type', floor_data.FLOOR_TYPE);
				return;
			}

			// 3성으로 클리어 하면 추가 점수
			var reward_score = floor_data.REWARD_SCORE;
			if ( clear_grade == 3 ) {
				if ( floor_data.BATTLE_TYPE == DefineValues.inst.InfinityTowerBattleHigh ) {
					reward_score = reward_score * DefineValues.inst.InfinityTowerHighBouns;
				} else if ( floor_data.BATTLE_TYPE == DefineValues.inst.InfinityTowerBattleMiddle ) {
					reward_score = reward_score * DefineValues.inst.InfinityTowerMiddleBouns;
				}
			}

			// GT_INFINITY_TOWER_USER select 무한탑 유저 정보
			GTMgr.inst.GetGTInfinityTowerUser().find({
				where : { UUID : p_user.uuid, EXIST_YN : true }
			})
			.then(function (p_ret_tower_user) {
				if ( p_ret_tower_user == null ) {
					var rank_score = reward_score + (reward_score * DefineValues.inst.InfinityTowerRankScorePlusPercent);
					// GT_INFINITY_TOWER_USER insert
					GTMgr.inst.GetGTInfinityTowerUser().create({
						UUID			: p_user.uuid,
						TODAY_TICKET	: floor_data.REWARD_TICKET,
						TODAY_SCORE		: reward_score,
						ACCUM_SCORE		: reward_score,
						TODAY_RANK_SCORE: rank_score,
						UPDATE_DATE		: str_now,
						REG_DATE		: str_now
					})
					.then(function (p_ret_user_create) {
						// console.log('p_ret_user_create.dataValues', p_ret_user_create.dataValues);
						p_ack_packet.ticket			= p_ret_user_create.dataValues.TODAY_TICKET;
						p_ack_packet.daily_score	= p_ret_user_create.dataValues.TODAY_SCORE;
						p_ack_packet.accum_score	= p_ret_user_create.dataValues.ACCUM_SCORE;
						p_ack_packet.rank_score		= p_ret_user_create.dataValues.TODAY_RANK_SCORE;
						p_ack_packet.challenge_point= floor_data.CHALLENGE_POINT;

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

						// 무한탑 팀 정보 저장 - TODO : 이걸 매번 해야 하나?
						TowerMgr.inst.SaveTeam(p_user.uuid);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleFinish - 4');
					});
				} else {
					var rank_score = (p_ret_tower_user.dataValues.TODAY_SCORE + reward_score) + ((p_ret_tower_user.dataValues.ACCUM_SCORE + reward_score) * DefineValues.inst.InfinityTowerRankScorePlusPercent);
					// GT_INFINITY_TOWER_RECROD update
					p_ret_tower_user.updateAttributes({
						TODAY_TICKET		: p_ret_tower_user.dataValues.TODAY_TICKET + floor_data.REWARD_TICKET,
						TODAY_SCORE			: p_ret_tower_user.dataValues.TODAY_SCORE + reward_score,
						ACCUM_SCORE			: p_ret_tower_user.dataValues.ACCUM_SCORE + reward_score,
						TODAY_RANK_SCORE	: rank_score,
						UPDATE_DATE			: str_now
					})
					.then(function (p_ret_tower_user) {
						// console.log('p_ret_tower_user.dataValues', p_ret_tower_user.dataValues);
						p_ack_packet.ticket			= p_ret_tower_user.dataValues.TODAY_TICKET;
						p_ack_packet.daily_score	= p_ret_tower_user.dataValues.TODAY_SCORE;
						p_ack_packet.accum_score	= p_ret_tower_user.dataValues.ACCUM_SCORE;
						p_ack_packet.rank_score		= p_ret_tower_user.dataValues.TODAY_RANK_SCORE;
						p_ack_packet.challenge_point= floor_data.CHALLENGE_POINT;

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

						// 무한탑 팀 정보 저장 - 이걸 매번 해야 할까??
						TowerMgr.inst.SaveTeam(p_user.uuid);
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleFinish - 3');
					});
				}
				
				TowerMgr.inst.SaveTowerHero(p_user.uuid, p_recv.hero_list);
				TowerMgr.inst.SaveTowerBattleBotHero(p_user, p_recv.battle_bot_hero_list, p_recv.battle_bot_tag_hero_list);
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleFinish - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBattleFinish - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;