/********************************************************************
Title : GuildPoint
Date : 2016.05.02
Update : 2016.08.16
Writer : jongwook
Desc : 길드원들이 골드, 캐쉬 기부로 길드 포인트 기부
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseGuild	= require('../../Data/Base/BaseGuild.js');
var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

var Timer	= require('../../Utils/Timer.js');

(function(exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 길드 포인트 기부
	inst.ReqGuildPointDonation = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqGuildPointDonation', p_user.uuid, p_recv);

		var recv_donation_id	= parseInt(p_recv.donation_id);

		// 0. 유저 찾기. 
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}

			var user_data = p_ret_user.dataValues;

			// 0-1. 재화 확인. 
			var donation_base = BaseGuild.inst.GetGuildDonation(recv_donation_id);
			if ( typeof donation_base === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find GuildDonation Info In Base Donation ID', donation_id);
				return;
			}

			// 1. 길드 멤버에서 유저 찾기. 
			GTMgr.inst.GetGTGuildMember().find({
				where : { UUID : p_user.uuid, EXIST_YN : true }
			})
			.then(function (p_ret_guild_member) {
				// 1-1. 길드 멤버 유무 확인. . 
				if ( p_ret_guild_member == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_GUILD_MEMBER');
					return;
				}

				var guild_member_data = p_ret_guild_member.dataValues;

				// 1-2. 유저의 길드 가입 시간 확인.  - 길드 가입 후 24시간 후에 기부 할 수 있다. 
				if ( Timer.inst.GetDeltaTime(guild_member_data.REG_DATE) < 86400 ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retRemainTime());
					return;
				} 

				// 2. 유저의 데일리 컨텐츠 확인. 
				GTMgr.inst.GetGTDailyContents().find({
					where: { UUID : p_user.uuid, EXIST_YN : true }
				})
				.then(function (p_ret_daily_contents) {
					if ( p_ret_daily_contents == null ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_DAILY_CONTENTS');
						return;
					}

					var daily_data = p_ret_daily_contents.dataValues;
					// 2-1. 기부 횟수 확인. 
					if ( daily_data.GUILD_POINT_DONATION_COUNT <= 0 ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughGuildPointDonationCount(), 'Remain Donation Count', daily_data.GUILD_POINT_DONATION_COUNT);
						return;
					}

					// 연산. ##########################################################################
					// 3. 유저 재화 차감. 
					var be_free_donation = true;
					var ret_gold = user_data.GOLD;
					var ret_cash = user_data.CASH;
					if ( donation_base.need_gold != 0 ) {
						if (user_data.GOLD < donation_base.need_gold) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughGold(), 'Need Gold', donation_base.need_gold, 'Current Gold', user_data.GOLD);
							return;
						}

						ret_gold = user_data.GOLD - donation_base.need_gold;
						be_free_donation = false;
					}

					if ( donation_base.need_cash != 0 ) {
						if ( user_data.CASH < donation_base.need_cash ) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'Need Cash', donation_base.need_cash, 'Current Cash', user_data.CASH);
							return;
						}

						ret_cash = user_data.CASH - donation_base.need_cash;
						be_free_donation = false;
					}

					// 2-2. 무료 기부 시간 확인. 
					if ( be_free_donation ==true && Timer.inst.GetDeltaTime(daily_data.LATELY_FREE_DONATION_TIME) < 3600 ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retRemainTime());
						return;
					}

					// 3-1. 길드의 포인트 상승.
					var ret_add_guild_point = donation_base.guild_point;

					// 3-2. 유저의 길드 포인트 상승.
					var ret_alliance_point = user_data.POINT_ALLIANCE + donation_base.alliance_point;

					// 3-3. 기여도 상승.  (guild_point - not allince point) - 20170111_길드_통제실_UI.pptx의 9 page
					var ret_contribution = guild_member_data.CONTRIBUTION + donation_base.guild_point;
					// 연산. ##########################################################################

					mkDB.inst.GetSequelize().query('call sp_update_donation(?, ?, ?, ?, ?, ?, ?, ?);'
						, null
						, { raw: true, type: 'SELECT' }
						, [ p_user.uuid, guild_member_data.GUILD_ID, be_free_donation, ret_gold, ret_cash, ret_add_guild_point, ret_alliance_point, ret_contribution])
					.then(function (p_ret_update) {
						console.log('p_ret_update', p_ret_update);

						p_ack_packet.wallet			= new PacketCommonData.Wallet();
						p_ack_packet.wallet.gold 		= p_ret_update[0][0].GOLD;
						p_ack_packet.wallet.cash 		= p_ret_update[0][0].CASH;
						p_ack_packet.wallet.point_honor 	= p_ret_update[0][0].POINT_HONOR;
						p_ack_packet.wallet.point_alliance 	= p_ret_update[0][0].POINT_ALLIANCE;
						p_ack_packet.wallet.point_challenge = p_ret_update[0][0].POINT_CHALLENGE;

						p_ack_packet.guild_point 					= p_ret_update[0][0].GUILD_POINT;
						p_ack_packet.weekly_guild_accum_donation_point 	= p_ret_update[0][0].WEEKLY_ACCUM_GUILD_POINT;
						p_ack_packet.remain_donation_count 			= p_ret_update[0][0].GUILD_POINT_DONATION_COUNT;
						p_ack_packet.lately_free_donation_time 			= Timer.inst.GetUnixTime(p_ret_update[0][0].LATELY_DATE);

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildPointDonation - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildPointDonation - 3');
				})
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildPointDonation - 2');
			})
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildPointDonation - 1');
		})
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;