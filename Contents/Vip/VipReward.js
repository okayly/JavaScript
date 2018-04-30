/********************************************************************
Title : VipReward
Date : 2016.04.27
Update : 2016.07.19
Desc : 유저 VIP 정보
writer: jongwook
********************************************************************/
var GTMgr		= require('../../DB/GTMgr.js');
var RewardMgr	= require('../RewardMgr.js');

var BaseVipRe	= require('../../Data/Base/BaseVipRe.js');
var Sender		= require('../../App/Sender.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqVipReward = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqVipReward -', p_user.uuid, p_recv);

		var target_step = parseInt(p_recv.step);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			// VIP step를 shift 연산
			var shift_step = 1 << target_step;

			// 1. 수령 확인. 
			if ( user_data.VIP_STEP_REWARD_LIST & shift_step ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyRewardPayment());
				return;
			}

			// 2. 보상 확인.
			var vip_base = BaseVipRe.inst.GetVip(target_step);
			if (typeof vip_base === 'undefined') {
				Sender.inst.toPeer(user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Base Vip Info');
				return;
			}

			var reward_list = vip_base.GetRewardItemList();
			if (typeof reward_list === 'undefined') {
				Sender.inst.toPeer(user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Base Vip Reward Info');
				return;
			}

			// 정보 저장은 Bit Shift를 이용해서 한다.
			var ret_reward = user_data.VIP_STEP_REWARD_LIST | shift_step;

			// GT_USER update
			p_ret_user.updateAttributes({
				VIP_STEP_REWARD_LIST : ret_reward
			})
			.then(function (p_ret_user_update) {
				p_ack_packet.step = target_step;
				
				RewardMgr.inst.RewardBox(p_user, p_ack_cmd, p_ack_packet, reward_list);
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqVipReward - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqVipReward - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;

