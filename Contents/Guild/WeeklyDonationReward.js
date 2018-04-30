/********************************************************************
Title : RecommondGuild
Date : 2016.06.14
Update : 2016.08.16
Desc : 추천 길드 리스트 목록
writer: dongsu
********************************************************************/
var GTMgr	= require('../../DB/GTMgr.js');

var BaseGuild	= require('../../Data/Base/BaseGuild.js');

var RewardMgr = require('../RewardMgr.js');

var Sender 	= require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqWeeklyDonationReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqWeeklyDonationReward -', p_user.uuid, p_recv);

		// 1. 길드 가입 여부 확인. (GT_GUILD_MEMBER)
		GTMgr.inst.GetGTGuildMember().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_guild_member) {
			if ( p_ret_guild_member == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotGuildMember());
				return;
			}

			var member_data = p_ret_guild_member.dataValues;

			// 2. 지급 확인. 
			GTMgr.inst.GetGTWeeklyContents().find({
				where : { UUID : p_user.uuid, EXIST_YN : true }
			})
			.then(function (p_ret_weekly){
				if ( p_ret_weekly == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_WEEKLY_CONTENT');
					return;
				}

				if ( p_ret_weekly.dataValues.TAKE_DONATION_REWARD == true ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyRewardPayment());
					return;
				}

				GTMgr.inst.GetGTGuild().find({
					where : { GUILD_ID : member_data.GUILD_ID, EXIST_YN : true }
				})
				.then(function (p_ret_guild) {
					if ( p_ret_guild == null ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find GUILD');
						return;
					}

					// 3. 길드 지난 포인트 확인. 
					var prev_accum_donation_point = p_ret_guild.dataValues.PREV_WEEKLY_ACCUM_GUILD_POINT;
					console.log('도네이션 필요 정보 는  : ', prev_accum_donation_point);
					// 4. 보상 지급. 
					var donation_reward_base = BaseGuild.inst.GetWeeklyDonationReward(prev_accum_donation_point);
					if ( typeof donation_reward_base === 'undefined' ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find GuildDonation Info');
						return;
					}

					p_ret_weekly.updateAttributes({
						TAKE_DONATION_REWARD : true
					})
					.then(function (p_ret_weekly_update) {

						RewardMgr.inst.RewardBox(p_user, p_ack_cmd, p_ack_packet, donation_reward_base.reward_list);	
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqWeeklyDonationReward - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqWeeklyDonationReward - 3');
				})
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqWeeklyDonationReward - 2');
			})
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqWeeklyDonationReward - 1');
		})
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;