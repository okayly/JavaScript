/********************************************************************
Title : TowerAllSkip
Date : 2016.04.08
Update : 2017.04.07
Desc : 무한탑 - 전체 스킵
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseTower = require('../../Data/Base/BaseTower.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 전체 스킵
	inst.ReqTowerAllSkip = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerAllSkip', p_user.uuid, p_recv);

		var start_floor = parseInt(p_recv.start_floor);

		// GT_INFINITY_TOWER_USER select
		GTMgr.inst.GetGTInfinityTowerUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_tower_user) {
			if ( p_ret_tower_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower User In GT_INFINITY_TOWER_USER');
				return;
			}
			var tower_user_data = p_ret_tower_user.dataValues;

			if ( tower_user_data.SKIP_POINT <= 0 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughTowerSkipPoint(), 'Skip Point', tower_user_data.SKIP_POINT);
				return;
			}

			var sum_ticket	= 0;
			var sum_score	= 0;
			var sum_gold	= 0;
			var sum_point_challenge = 0;

			var max_skip_floor = start_floor + tower_user_data.SKIP_POINT;
			console.log('All Skip Star Floor: %d, Max Skip Floor: %d', start_floor, max_skip_floor);

			for ( var floor = start_floor; floor <= max_skip_floor; ++floor ) {
				var tower_base = BaseTower.inst.GetTowerFloor(floor);
				if ( typeof tower_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', floor);
					return;
				}

				// 배틀 층
				if ( tower_base.floor_type == DefineValues.inst.InfinityTowerBattleFloor ) {
					var battle_reward = tower_base.GetBattleReward(DefineValues.inst.InfinityTowerBattleHigh);
					if ( typeof battle_reward === 'undefined' ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower Reward In Base Floor', floor, 'Battle Type', DefineValues.inst.InfinityTowerBattleHigh);
						return;
					}

					sum_ticket	= sum_ticket + battle_reward.ticket;
					sum_score	= sum_score + battle_reward.score;

					logger.info('Battle Floor', start_floor, 'Ticket', battle_reward.ticket, 'Score', battle_reward.score);
				}

				// 보물상자 층, 비밀미로 층 - 보물상자
				if ( (tower_base.floor_type == DefineValues.inst.InfinityTowerRewardBoxFloor) || 
					(tower_base.floor_type == DefineValues.inst.InfinityTowerSecretMazeFloor) ) {
					// console.log('reward_box_list', tower_base.reward_box_list);

					if ( (tower_base.reward_box_list != undefined) && (tower_base.reward_box_list.length > 0) ) {
						for ( var cnt = 0; cnt < tower_base.reward_box_list.length; ++cnt ) {
							if ( tower_base.reward_box_list[cnt].reward_type == DefineValues.inst.GoldReward ) {
								sum_gold = sum_gold + tower_base.reward_box_list[cnt].reward_count;								
								logger.info('Reward Floor or SecretMaze Floor', start_floor, 'Reward Gold', tower_base.reward_box_list[cnt].reward_count);
							}

							if ( tower_base.reward_box_list[cnt].reward_type == DefineValues.inst.ChallengePointReward ) {
								sum_point_challenge = sum_point_challenge + tower_base.reward_box_list[cnt].reward_count;
								
								logger.info('Reward Floor or SecretMaze Floor', start_floor, 'Reward Challenge Point', tower_base.reward_box_list[cnt].reward_count);
							}
						}
					}
				}
			}

			// GT_INFINITY_TOWER_USER update 스킵 횟수, 티켓, 스코어 적용
			p_ret_tower_user.updateAttributes({
				TODAY_TICKET: sum_ticket,
				TODAY_SCORE	: sum_score,
				ACCUM_SCORE	: p_ret_tower_user.ACCUM_SCORE + sum_score,
				TODAY_FLOOR	: max_skip_floor,
				UPDATE_DATE	: Timer.inst.GetNowByStrDate()
			})
			.then(function (p_ret_user_update) {
				// ticket, score
				p_ack_packet.max_all_skip_floor	= p_ret_user_update.dataValues.SKIP_POINT;
				p_ack_packet.total_skip_ticket	= p_ret_user_update.dataValues.TODAY_TICKET;
				p_ack_packet.total_skip_score	= p_ret_user_update.dataValues.TODAY_SCORE;
				p_ack_packet.accum_score		= p_ret_user_update.dataValues.ACCUM_SCORE;

				// call ad-hoc query - 보상 받기
				mkDB.inst.GetSequelize().query('call sp_insert_infinity_tower_all_skip_reward(?, ?, ?, ?, ?);',
					null,
					{ raw : true, type : 'SELECT' },
					[	p_user.uuid,
						start_floor,
						max_skip_floor,
						sum_gold,
						sum_point_challenge
					]
				)
				.then(function (p_ret_reward) {
					// console.log('p_ret_reward:', p_ret_reward);
					p_ack_packet.wallet = new PacketCommonData.Wallet();
					p_ack_packet.wallet.gold			= p_ret_reward[0][0].GOLD;
					p_ack_packet.wallet.cash			= p_ret_reward[0][0].CASH;
					p_ack_packet.wallet.point_honor		= p_ret_reward[0][0].POINT_HONOR;
					p_ack_packet.wallet.point_challenge	= p_ret_reward[0][0].POINT_CHALLENGE;
					p_ack_packet.wallet.point_alliance	= p_ret_reward[0][0].POINT_ALLIANCE;

					if ( Object.keys(p_ret_reward[1]).length > 0 ) {
						for (var cnt in p_ret_reward[1]) {
							var result_item = new PacketCommonData.Item();
							result_item.iuid		= p_ret_reward[1][cnt].IUID;
							result_item.item_id		= p_ret_reward[1][cnt].ITEM_ID;
							result_item.item_count	= p_ret_reward[1][cnt].ITEM_COUNT;

							p_ack_packet.reward_item_list.push(result_item);
						}
					} else {
						p_ack_packet.reward_item_list = null;
					}

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerAllSkip - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerAllSkip - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerAllSkip - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;