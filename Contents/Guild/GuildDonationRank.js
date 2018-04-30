/********************************************************************
Title : RecommondGuild
Date : 2016.06.14
Update : 2016.08.16
Desc : 추천 길드 리스트 목록
writer: dongsu
********************************************************************/
var PacketCommonData = require('../../Packets/PacketCommonData.js');

var mkDB = require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var Sender 	= require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqDonationRank = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqDonationRank -', p_user.uuid, p_recv);

		// 1. 길드 멤버 확인. 
		GTMgr.inst.GetGTGuildMember().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_member) {
			if ( p_ret_member == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotGuildMember());
				return;
			}

			var member_data = p_ret_member.dataValues;

			mkDB.inst.GetSequelize().query('call sp_select_donation_rank(?);',
				null,
				{ raw : true, type : 'SELECT' },
				[ member_data.GUILD_ID ]
			)
			.then(function (p_ret_member_list) {
				console.log('p_ret_member_list : ', p_ret_member_list);

				if (Object.keys(p_ret_member_list[0]).length > 0) {
					for ( var cnt in p_ret_member_list[0] ) {

						console.log('ret_data : ', p_ret_member_list[0][cnt]);

						var donation_user = new PacketCommonData.DonationRankUserInfo();
						donation_user.level 				= p_ret_member_list[0][cnt].USER_LEVEL;
						donation_user.nick 				= p_ret_member_list[0][cnt].NICK;
						donation_user.weekly_accum_guild_point 	= p_ret_member_list[0][cnt].WEEKLY_ACCUM_DONATION_POINT;
						donation_user.total_accum_guild_point 	= p_ret_member_list[0][cnt].TOTAL_ACCUM_DONATION_POINT;

						p_ack_packet.user_list.push(donation_user);
					}					
				}

				// for ( var guild_member_cnt in p_ret_member_list ) {
				// 	var ret_data = p_ret_member_list[0][guild_member_cnt];
				// 	console.log('ret_data : ', ret_data);

				// 	var donation_user = new PacketCommonData.DonationRankUserInfo();
				// 	donation_user.level 				= ret_data.USER_LEVEL;
				// 	donation_user.nick 				= ret_data.NICK;
				// 	donation_user.weekly_accum_guild_point 	= ret_data.WEEKLY_ACCUM_DONATION_POINT;
				// 	donation_user.total_accum_guild_point 	= ret_data.TOTAL_ACCUM_DONATION_POINT;

				// 	p_ack_packet.user_list.push(donation_user);
				// }

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDonationRank - 2');
			});
		})
		.catch(function (p_errror) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqDonationRank - 1');
		})
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;