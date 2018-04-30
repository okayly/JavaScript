/********************************************************************
Title : GuildJoin
Date : 2016.06.15
Update : 2017.04.10
writer: dongsu -> jongwook
Desc : 길드 가입
	GUILD_AUTH  	(1 : 길드장, 2 : 장로, 3 : 일반.)
	JOIN_OPTION 	(1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
	APPROVAL_STATES (0 : 승인 대기. 1 : 승인, 2 : 거부.)
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var SetGTGuild = require('../../DB/GTSet/SetGTGuild.js');
var SetGTUser = require('../../DB/GTSet/SetGTUser.js');

var BaseGuild = require('../../Data/Base/BaseGuild.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransactionInsertMember = function(p_ret_guild_member, p_uuid, p_guild_id) {
		return new Promise(function (resolve, reject) {
			let join_states = true;

			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// 길드 멤버 설정
				Promise.all([
					SetGTGuild.inst.SetGuildMember(p_ret_guild_member, p_uuid, p_guild_id, DefineValues.inst.GuildAuthMember, join_states, t),
					SetGTGuild.inst.SetGuildMemberOneUserEffect(p_uuid, p_guild_id, t)
				])
				.then(values => {
					t.commit();

					resolve(values[0]);
				})
				.catch(p_error => {
					if (t)
						t.rollback();

					reject(p_error);
				});
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransactionJoinPending = function(p_uuid, p_guild_id) {
		return new Promise(function (resolve, reject) {
			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// GT_GUILD_JOIN_PENDING_APPROVAL insert
				GTMgr.inst.GetGTGuildJoinPendingApproval().create({
					UUID : p_uuid,
					GUILD_ID : p_guild_id,
					APPROVAL_STATES : 0,
					REG_DATE : Timer.inst.GetNowByStrDate()
				}, { transaction : t })
				.then(p_ret_member => {
					t.commit();

					resolve(p_ret_member);
				})
				.catch(p_error => {
					if (t)
						t.rollback();

					reject(p_error);
				});
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetJoinPendingApproval = function(p_uuid, p_guild_id) {
		return new Promise(function (resolve, reject) {
			// 1. 길드 가입 대기 확인
			LoadGTGuild.inst.SelectJoinPendingApproval(p_uuid, p_guild_id)
			.then(p_ret_join_pending => {
				if ( p_ret_join_pending != null )
					throw ( PacketRet.inst.retAlreadyGuildJoinPendingApproval() );

				console.log('Join 3 : GT_GUILD_JOIN_PENDING_APPROVAL insert');

				// 2. 길드 가입 대기 등록
				ProcessTransactionJoinPending(p_uuid, p_guild_id)
				.then(value => {
					resolve(value);
				})
				.catch(p_error => {
					reject(p_error);
				});
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGuildJoin = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGuildJoin -', p_user.uuid, p_recv);

		var recv_guild_id = parseInt(p_recv.guild_id);
		
		// Promise.add GO! - 길드, 길드멤버, 길드멤버 수
		Promise.all([
			LoadGTGuild.inst.GetGuild(recv_guild_id),
			LoadGTGuild.inst.GetGuildMember(p_user.uuid),
			LoadGTGuild.inst.GetGuildMemberCount(recv_guild_id)
		])
		.then(values => {
			let ret_guild = values[0];
			let ret_guild_member = values[1];		// 길드 가입 여부 확인.
			let member_count = values[2];

			// 1. 길드 존재 확인
			if ( ret_guild == null )
				throw ( PacketRet.inst.retNotExistGuild() );

			// 2. 길드 OPTION 확인
			if ( ret_guild.dataValues.JOIN_OPTION == DefineValues.inst.GuildJoinOptionDisable )
				throw ( PacketRet.inst.retJoinOptionIsDisabled() );

			// 길드 BaseData - 길드 최대 맴버수 구하기 위해서
			let base_guild = BaseGuild.inst.GetGuildInfo(ret_guild.dataValues.GUILD_LEVEL);
			if ( typeof base_guild === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Exist Guild Info In Base Target Level', ret_guild.dataValues.GUILD_LEVEL ]);

			console.log('현재 인원 : %d, 최대 인원 : %d', member_count, base_guild.max_member_count);

			// 3. 길드 인원 확인
			if ( member_count >= base_guild.max_member_count )
				throw ([ PacketRet.inst.retArriveInMaxMemberCount(), 'Max Count', base_guild.max_member_count ]);

			if ( ret_guild_member != null ) {
				// 4. 길드 가입 상태 확인
				if ( ret_guild_member.dataValues.JOIN_STATES == true ) {
					if ( ret_guild_member.dataValues.GUILD_ID == ret_guild.dataValues.GUILD_ID )
						throw ([ PacketRet.inst.retAlReadyJoinGuild(), ret_guild.dataValues.GUILD_ID ]);
					else
						throw ([ PacketRet.inst.retAlreadyAnotherGuildMember(), ret_guild_member.dataValues.JOIN_STATES ]);
				} else {
					// 5. 길드 탈퇴 시간 확인
					if ( Timer.inst.GetDeltaTime(ret_guild_member.dataValues.JOIN_DATE) > 86400 ) { // 24시간 
						// 가입 가능
						return values;
					} else {
						// 가입 불가능
						throw ([ PacketRet.inst.retRemainTime(), Timer.inst.GetDeltaTime(ret_guild_member.dataValues.REG_DATE) ]);
					}
				}
			} else {
				// 길드 가입 한적 없는 유저. 가입 가능
				 return values;
			}
		})
		.then(values => {
			let ret_guild = values[0];
			let ret_guild_member = values[1];		// 길드 가입 여부 확인.

			if ( ret_guild.dataValues.JOIN_OPTION == DefineValues.inst.GuildJoinOptionFree ) {
				// 길드 멤버 설정
				return ProcessTransactionInsertMember(ret_guild_member, p_user.uuid, recv_guild_id);
			} else if ( ret_guild.dataValues.JOIN_OPTION == DefineValues.inst.GuildJoinOptionApproval ) {
				return SetJoinPendingApproval(p_user.uuid, recv_guild_id);
			} else {
				throw ([ PacketRet.inst.retFail(), 'Error Join Option', ret_guild.dataValues.JOIN_OPTION ]);
			}
		})
		.then(value => {
			// console.log('value', value);

			let ret_guild_member = value;
			p_ack_packet.guild_id = ret_guild_member.dataValues.GUILD_ID;

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