/********************************************************************
Title : ChangeGuildInfo
Date : 2016.08.11
Update : 2017.04.10
writer: dongsu -> jongwook
Desc : 길드 정보 변경
	GUILD_AUTH		(1 : 길드장, 2 : 장로, 3 : 일반.)
	JOIN_OPTION		(1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
	APPROVAL_STATES	(0 : 승인 대기. 1 : 승인, 2 : 거부.)
	GUILD_STATES	( true : 활성, false : 폐쇄.)
Logic :
	1. 길드 멤버 확인. 
	2. 권한 확인. 
	3. 정보 변경. 
********************************************************************/
var mkDB = require('../../DB/mkDB.js');

var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	// 길드 정보 변경.
	//------------------------------------------------------------------------------------------------------------------
	// TODO : 길드장 자동 변경 옵션은 현재 구현 하지 않는다. 길드 상세 내용 작업에서 작업 여부 결정 하도록 한다. 
	inst.ReqChangeGuildInfo = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqChangeGuildInfo -', p_user.uuid, p_recv);

		var recv_guild_mark			= parseInt(p_recv.guild_mark);
		var recv_guild_notice		= p_recv.guild_notice;
		var recv_join_option		= parseInt(p_recv.guild_join_option);
		var recv_auto_master_change	= ( p_recv.auto_master_change == true || p_recv.auto_master_change == 'true' ) ? true : false;
		var recv_elder_raid_open	= ( p_recv.elder_raid_open == true || p_recv.elder_raid_open == 'true' ) ? true : false;

		// console.log('p_recv.auto_master_change :', p_recv.auto_master_change, Object.prototype.toString.call(p_recv.auto_master_change));
		// console.log('recv_auto_master_change', recv_auto_master_change, Object.prototype.toString.call(recv_auto_master_change));

		LoadGTGuild.inst.GetGuildMember(p_user.uuid)
		.then(p_ret_member => {
			if ( p_ret_member == null || p_ret_member.dataValues.JOIN_STATES == false )
				throw ([ PacketRet.inst.retNotGuildMember(), 'member is not' ]);

			if ( p_ret_member.dataValues.GUILD_AUTH != DefineValues.inst.GuildAuthMaster )
				throw ( PacketRet.inst.retNotEnoughAuth() );

			return new Promise(function (resolve, reject) {
				LoadGTGuild.inst.GetGuild(p_ret_member.dataValues.GUILD_ID)
				.then(p_ret_guild => {
					if ( p_ret_guild == null )
						throw( PacketRet.inst.retFail() );

					resolve([ p_ret_member, p_ret_guild ]);
				})
				.catch(p_error => { reject(p_error); });
			});
		})
		.then(values => {
			let ret_member = values[0];
			let ret_guild = values[1];
			let guild_data = ret_guild.dataValues;

			// console.log('guild_data', guild_data);

			console.log('guild_data.AUTO_MASTER_CHANGE', guild_data.AUTO_MASTER_CHANGE, Object.prototype.toString.call(guild_data.AUTO_MASTER_CHANGE));
			console.log('guild_data.AUTO_MASTER_CHANGE != recv_auto_master_change', guild_data.AUTO_MASTER_CHANGE, recv_auto_master_change, guild_data.AUTO_MASTER_CHANGE != recv_auto_master_change)

			// console.log('guild_data.ELDER_RAID_OPEN', guild_data.ELDER_RAID_OPEN, Object.prototype.toString.call(guild_data.ELDER_RAID_OPEN));

			return new Promise(function (resolve, reject) {
				if ( guild_data.GUILD_MARK != recv_guild_mark ||  guild_data.GUILD_NOTICE != recv_guild_notice || 
					guild_data.JOIN_OPTION != recv_join_option ||
					guild_data.AUTO_MASTER_CHANGE != recv_auto_master_change || guild_data.ELDER_RAID_OPEN != recv_elder_raid_open ) {

					mkDB.inst.GetSequelize().transaction(function (transaction) {
						let t = transaction;

						if ( guild_data.GUILD_MARK != recv_guild_mark )
							ret_guild['GUILD_MARK'] = recv_guild_mark;

						if ( guild_data.GUILD_NOTICE != recv_guild_notice )
							ret_guild['GUILD_NOTICE'] = recv_guild_notice;

						if ( guild_data.JOIN_OPTION != recv_join_option )
							ret_guild['JOIN_OPTION'] = recv_join_option;

						if ( guild_data.AUTO_MASTER_CHANGE != recv_auto_master_change )
							ret_guild['AUTO_MASTER_CHANGE'] = recv_auto_master_change;

						if ( guild_data.ELDER_RAID_OPEN != recv_elder_raid_open )
							ret_guild['ELDER_RAID_OPEN'] = recv_elder_raid_open;

						// GT_GUILD update
						ret_guild.save({ transaction : t })
						.then(p_ret_guild_update => {
							t.commit();

							resolve(p_ret_guild_update);
						})
						.catch(p_error => {
							if (t)
								t.rollback();

							eject(p_error);
						});
					});
				} else {
					resolve(ret_guild);
				}
			});
		})
		.then(value => { 
			// console.log('value', value.dataValues);
			let ret_guild = value;

			p_ack_packet.guild_mark				= ret_guild.dataValues.GUILD_MARK;
			p_ack_packet.guild_notice			= ret_guild.dataValues.GUILD_NOTICE;			
			p_ack_packet.guild_join_option		= ret_guild.dataValues.JOIN_OPTION;
			p_ack_packet.auto_master_change		= ( ret_guild.dataValues.AUTO_MASTER_CHANGE == 1 ) ? true : false;
			p_ack_packet.elder_raid_open		= ( ret_guild.dataValues.ELDER_RAID_OPEN == 1 ) ? true : false;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;