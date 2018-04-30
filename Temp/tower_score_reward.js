/********************************************************************
Title : TowerScoreReward
Date : 2016.04.08
Update : 2017.03.23
Desc : 무한탑 누적 점수 보상
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseTower = require('../../Data/Base/BaseTower.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

var moment = require('moment');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 누적 점수 보상
	inst.ReqTowerScoreReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerScoreReward', p_user.uuid, p_recv);

		var recv_reward_id = parseInt(p_recv.reward_id);

		// GT_INFINITY_TOWER_USER select
		GTMgr.inst.GetGTInfinityTowerUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_tower_user) {
			// console.log('p_ret_tower_user', p_ret_tower_user);
			if ( p_ret_tower_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower User In GT_INFINITY_TOWER_USER');
				return;
			}

			var reward_id_list = [];
			if ( p_ret_tower_user.SCORE_REWARD_ID_LIST != null ) {
				var id_list = p_ret_tower_user.SCORE_REWARD_ID_LIST.split(',');
				for ( var cnt in id_list )
					reward_id_list.push(parseInt(id_list[cnt]));
			}

			if ( reward_id_list.indexOf(recv_reward_id) != -1 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyTowerAccumScoreReward(), 'Reward ID', recv_reward_id);
				return;
			}

			var base_reward = BaseTower.inst.GetAccumScoreReward(recv_reward_id);
			if ( typeof base_reward === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Reward Info In Base Reward ID', recv_reward_id);
				return;
			}

			// console.log('base_reward', base_reward);
			reward_id_list.push(recv_reward_id);

			var str_make_reward_id = null;
			for ( var cnt in reward_id_list ) {
				str_make_reward_id = ( cnt == 0 ) ? reward_id_list[cnt] : str_make_reward_id + ',' + reward_id_list[cnt];
			}

			// call ad-hoc query 보상 받기
			mkDB.inst.GetSequelize().query('call sp_insert_infinity_tower_accum_score_reward(?, ?, ?,?,?, ?,?,?, ?,?,?, ?,?,?);',
				null,
				{ raw : true, type : 'SELECT' },
				[	p_user.uuid,
					str_make_reward_id,
					(typeof base_reward.reward_list[0] === 'undefined') ? 0 : base_reward.reward_list[0].reward_type,
					(typeof base_reward.reward_list[0] === 'undefined') ? 0 : base_reward.reward_list[0].reward_item_id,
					(typeof base_reward.reward_list[0] === 'undefined') ? 0 : base_reward.reward_list[0].reward_count,
					(typeof base_reward.reward_list[1] === 'undefined') ? 0 : base_reward.reward_list[1].reward_type,
					(typeof base_reward.reward_list[1] === 'undefined') ? 0 : base_reward.reward_list[1].reward_item_id,
					(typeof base_reward.reward_list[1] === 'undefined') ? 0 : base_reward.reward_list[1].reward_count,
					(typeof base_reward.reward_list[2] === 'undefined') ? 0 : base_reward.reward_list[2].reward_type,
					(typeof base_reward.reward_list[2] === 'undefined') ? 0 : base_reward.reward_list[2].reward_item_id,
					(typeof base_reward.reward_list[2] === 'undefined') ? 0 : base_reward.reward_list[2].reward_count,
					(typeof base_reward.reward_list[3] === 'undefined') ? 0 : base_reward.reward_list[3].reward_type,
					(typeof base_reward.reward_list[3] === 'undefined') ? 0 : base_reward.reward_list[3].reward_item_id,
					(typeof base_reward.reward_list[3] === 'undefined') ? 0 : base_reward.reward_list[3].reward_count
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

				if (Object.keys(p_ret_reward[1]).length > 0) {
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

				p_ack_packet.reward_id = reward_id;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerScoreReward - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerScoreReward - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;