/********************************************************************
Title : TowerScoreReward
Date : 2016.04.08
Update : 2017.04.03
Desc : 무한탑 누적 점수 보상
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var RewardMgr = require('../RewardMgr.js');

var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseTower = require('../../Data/Base/BaseTower.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var UpdateTowerUserScoreReward = function(p_t, p_ret_tower_user, p_str_id) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_USER update
			p_ret_tower_user.updateAttributes({ SCORE_REWARD_ID_LIST : p_str_id }, { transaction : p_t })
			.then(p_ret_tower_user_update => {
				console.log('UpdateTowerUserScoreReward', p_ret_tower_user_update.dataValues.UUID);
				resolve(p_ret_tower_user_update);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_value, p_str_id) {
		let ret_tower_user = p_value;

		return new Promise(function (resolve, reject) {
			// transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				UpdateTowerUserScoreReward(t, ret_tower_user, p_str_id)
				.then(value => {
					t.commit();

					resolve(value);
				})
				.catch(p_error => {
					if (t)
						t.rollback();

					reject(p_error);
				});
			});
		});
	}

	// 무한탑 누적 점수 보상
	inst.ReqTowerScoreReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerScoreReward', p_user.uuid, p_recv);

		let recv_reward_id = parseInt(p_recv.reward_id);

		if ( recv_reward_id == 0 || isNaN(recv_reward_id) || typeof recv_reward_id === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'recv_reward_id', recv_reward_id);
			return;
		}

		LoadGTTower.inst.SelectTowerUser(p_user.uuid)
		.then(value => {
			let ret_tower_user = value;

			if ( ret_tower_user == null )
				throw ([ PacketRet.inst.retFail(), 'Not Find Tower User In GT_INFINITY_TOWER_USER' ]);

			let temp_id_list = [];
			if ( ret_tower_user.dataValues.SCORE_REWARD_ID_LIST != null ) {
				let id_list = ret_tower_user.dataValues.SCORE_REWARD_ID_LIST.split(',');
				for ( let cnt in id_list )
					temp_id_list.push(parseInt(id_list[cnt]));
			}

			if ( temp_id_list.indexOf(recv_reward_id) != -1 ) {
				throw([ PacketRet.inst.retAlreadyTowerAccumScoreReward(), 'Reward ID', recv_reward_id ]);
			}
			
			temp_id_list.push(recv_reward_id);

			// 보상 받은 ID를 '1,2,3' 이런 식으로 문자열로 만들어 저장 - dongsu가 무척 싫어 하는 방법이다.
			let str_id = null;
			for ( let cnt in temp_id_list ) {
				str_id = ( cnt == 0 ) ? temp_id_list[cnt] : str_id + ',' + temp_id_list[cnt];
			}

			return ProcessTransaction(ret_tower_user, str_id);
		})
		.then(value => {
			p_ack_packet.reward_id = recv_reward_id;

			// 보상
			let base_reward = BaseTower.inst.GetAccumScoreReward(recv_reward_id);
			if ( typeof base_reward === 'undefined' ) {
				throw ([ PacketRet.inst.retFail(), 'Not Find Reward Info In Base Reward ID', recv_reward_id ]);
			}

			console.log('base_reward', base_reward);
			RewardMgr.inst.RewardBox(p_user, p_ack_cmd, p_ack_packet, base_reward.reward_list);
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