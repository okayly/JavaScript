/********************************************************************
Title : TowerUserInfo
Date : 2016.04.08
Update : 2017.04.03
Desc : 무한탑 - 유저 정보
writer: jongwook
********************************************************************/
var LoadGTTower = require('../../DB/GTLoad/LoadGTTower.js');
var GTMgr = require('../../DB/GTMgr.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var InsertTowerUser = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_INFINITY_TOWER_USER insert
			GTMgr.inst.GetGTInfinityTowerUser().create({
				UUID		: p_uuid,
				UPDATE_DATE	: Timer.inst.GetNowByStrDate(),
				REG_DATE	: Timer.inst.GetNowByStrDate()
			})
			.then(p_ret_tower_user_create => { resolve(p_ret_tower_user_create); })
			.catch(p_error => { reject(p_error); });
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	inst.ReqTowerUserInfo = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerUserInfo', p_user.uuid, p_recv);

		LoadGTTower.inst.SelectTowerUser(p_user.uuid)
		.then(value => {
			return new Promise(function (resolve) {
				let ret_tower_user = value;

				if ( ret_tower_user == null ) {
					InsertTowerUser(p_user.uuid)
					.then(value => { resolve(value); })
					.catch(p_error => { reject(p_error); });
				} else {
					resolve(ret_tower_user);
				}
			});
		})
		.then(value => {
			let ret_tower_user = value;

			p_ack_packet.floor			= ret_tower_user.dataValues.TODAY_FLOOR;
			p_ack_packet.ticket			= ret_tower_user.dataValues.TODAY_TICKET;
			p_ack_packet.daily_score	= ret_tower_user.dataValues.TODAY_SCORE;
			p_ack_packet.accum_score	= ret_tower_user.dataValues.ACCUM_SCORE;
			p_ack_packet.past_floor		= ret_tower_user.dataValues.LAST_FLOOR;
			p_ack_packet.past_rank		= ret_tower_user.dataValues.LAST_RANK;
			p_ack_packet.past_score		= ret_tower_user.dataValues.LAST_RANK_SCORE;
			p_ack_packet.max_skip_floor	= ret_tower_user.dataValues.SKIP_POINT;

			if ( ret_tower_user.dataValues.SCORE_REWARD_ID_LIST == null ) {
				p_ack_packet.accum_score_reward_id_list = null;
			} else {
				var reward_id_list = ret_tower_user.dataValues.SCORE_REWARD_ID_LIST.split(',');
				for ( var cnt_id in reward_id_list ) {
					p_ack_packet.accum_score_reward_id_list.push(parseInt(reward_id_list[cnt_id]));
				}
			}

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