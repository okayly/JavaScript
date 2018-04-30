/********************************************************************
Title : GuildCreate
Date : 2016.06.30
Update : 2017.02.27
Desc : 길드 생성
writer: dongsu
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var BaseGuild = require('../../Data/Base/BaseGuild.js');
var DefineValues = require('../../Common/DefineValues.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var UpdateUserInfo = function(p_user, p_ack_cmd, p_ack_packet, p_guild_id) {
		// GT_USER select
		GTMgr.inst.GetGTUser().find({ 
			where : { UUID : p_user.uuid, EXIST_YN : true }
		}).then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			var calc_cash = user_data.CASH - DefineValues.inst.GuildCreateCost;

			// GT_USER update
			p_ret_user.updateAttributes({
				CASH : calc_cash
			})
			.then(function (p_ret_update) {
				p_ack_packet.guild_id	= p_guild_id;
				p_ack_packet.result_cash	= p_ret_update.dataValues.CASH;

				var base_guild = BaseGuild.inst.GetGuildInfo(1);
				if ( typeof base_guild === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Guild Info In Base Target Level', target_level);
					return;
				}

				// 1. 오픈 스킬이 있다.
				if ( base_guild.open_guild_skill != 0 ) {
					GTMgr.inst.GetGTGuildSkill().create({
						GUILD_ID : p_guild_id,
						SKILL_ID : base_guild.open_guild_skill,
						REG_DATE : Timer.inst.GetNowByStrDate()
					})
					.then(function (p_ret_skill_create) {

						p_ack_packet.skill_id = base_guild.open_guild_skill;
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());	
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildLevelup - 4');
					})
				}
				else {
					// 2. 오픈 스킬이 없다. 
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				}

				// Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error UpdateUserInfo - 2');
			});
		}).catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error UpdateUserInfo - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var InsertGuild = function(p_user, p_guild_name, p_guild_mark, p_ack_cmd, p_ack_packet) {
		// GT_GUILD insert
		GTMgr.inst.GetGTGuild().create({
			GUILD_NAME : p_guild_name, GUILD_MARK : p_guild_mark, REG_DATE : Timer.inst.GetNowByStrDate()
		})
		.then(function (p_ret_guild_create) {
			// console.log('guild create - ', p_ret_guild_create);
			// 생성 실패
			if ( p_ret_guild_create == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Fail Insert Guild');
				return;
			}

			// 생성 성공
			var ret_guild_id = p_ret_guild_create.dataValues.GUILD_ID;

			// GT_GUILD_MEMBER insert
			GTMgr.inst.GetGTGuildMember().create({
				UUID : p_user.uuid, GUILD_ID : ret_guild_id, GUILD_AUTH : 1, REG_DATE : Timer.inst.GetNowByStrDate()
			})
			.then(function (p_ret_member_create) {
				// TODO : BT_COMMON 으로 옮겨야 함. 멀?
				UpdateUserInfo(p_user, p_ack_cmd, p_ack_packet, ret_guild_id);
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error InsertGuild - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error InsertGuild - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqCreateGuild = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqCreateGuild -', p_user.uuid, p_recv);

		var recv_guild_name = p_recv.guild_name;
		var recv_guild_mark = parseInt(p_recv.guild_mark);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			// 필요 재화 검사. 
			if ( user_data.CASH < DefineValues.inst.GuildCreateCost ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'Need Cash', DefineValues.inst.GuildCreateCost, 'Current Cash', user_data.CASH);
				return;
			}

			// GT_GUILD_MEMBER select - 길드 가입 여부 검사. 
			GTMgr.inst.GetGTGuildMember().find({ 
				where: { UUID : p_user.uuid, JOIN_STATES : true, EXIST_YN : true }
			})
			.then(function (p_ret_member) {
				// 이미 길드 멤버
				if ( p_ret_member != null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlReadyJoinGuild());
					return;
				}

				// 같은 이름이 있는지 검색한다. 
				GTMgr.inst.GetGTGuild().find({
					where: { GUILD_NAME : recv_guild_name, GUILD_STATES : true }
				})
				.then(function (p_ret_guild) {
					// console.log('p_ret_attend:', p_ret_guild);
					// 동일한 길드명 존재
					if (p_ret_guild != null) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlReadyExistGuildName());
						return;
					}

					// GT_GUILD_MEMBER select
					GTMgr.inst.GetGTGuildMember().find({ 
						where: { UUID : p_user.uuid, JOIN_STATES : false }, limit : 1, order : 'REG_DATE desc' 
					})
					.then(function (p_ret_guild_member) {
						if ( p_ret_guild_member == null ) {
							// 길드 가입 한적 없음. 
							InsertGuild(p_user, recv_guild_name, recv_guild_mark, p_ack_cmd, p_ack_packet);
						} else {
							// 길드 가입 한적 있음. 시간 계산 해야 함. 
							if ( Timer.inst.GetDeltaTime(p_ret_guild_member.REG_DATE) > 86400 ) {
								InsertGuild(p_user, recv_guild_name, recv_guild_mark, p_ack_cmd, p_ack_packet);
							} else {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retRemainTime());
							}
						}
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqCreateGuild - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqCreateGuild -3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqCreateGuild - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqCreateGuild - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;