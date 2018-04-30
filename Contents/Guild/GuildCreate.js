/********************************************************************
Title : GuildCreate
Date : 2016.06.30
Update : 2017.04.10
Desc : 길드 생성
writer: dongsu -> jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTUser = require('../../DB/GTLoad/LoadGTUser.js');
var LoadGTGuild = require('../../DB/GTLoad/LoadGTGuild.js');

var SetGTUser = require('../../DB/GTSet/SetGTUser.js');
var SetGTGuild = require('../../DB/GTSet/SetGTGuild.js');

var BaseGuild = require('../../Data/Base/BaseGuild.js');

var DefineValues = require('../../Common/DefineValues.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	var CreateGuild = function(p_t, p_uuid, p_guild_name, p_guild_mark) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD insert
			GTMgr.inst.GetGTGuild().create({
				UUID : p_uuid,
				GUILD_NAME : p_guild_name,
				GUILD_MARK : p_guild_mark,
				REG_DATE : Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_guild => {
				console.log('CreateGuild');
				resolve(p_ret_guild);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var CreateGuildSkill = function(p_guild_id, p_guild_skill_id, p_t) {
		return new Promise(function (resolve, reject) {
			// throw 'force error - CreateGuildSkill';
			// GT_GUILD_SKILL insert
			GTMgr.inst.GetGTGuildSkill().create({
				GUILD_ID : p_guild_id,
				SKILL_ID : p_guild_skill_id,
				REG_DATE : Timer.inst.GetNowByStrDate()
			}, { transaction : p_t })
			.then(p_ret_guild_skill => {
				console.log('CreateGuildSkill');
				resolve(p_ret_guild_skill);
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SelectJoinPendingList = function(p_t, p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_JOIN_PENDING_APPROVAL select
			GTMgr.inst.GetGTGuildJoinPendingApproval().findAll({
				where : { UUID : p_uuid, EXIST_YN : true }
			}, { transaction : p_t })
			.then(p_ret_pending_list => { resolve(p_ret_pending_list); })
			.catch(p_error => { reject(p_error); })
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var UpdateJoinPending = function(p_t, p_uuid) {
		return new Promise(function (resolve, reject) {
			SelectJoinPendingList(p_t, p_uuid)
			.then(p_ret_pending_list => {
				// Promise.all GO!
				return Promise.all(p_ret_pending_list.map(row => {
					return row.updateAttributes({
						APPROVAL_STATES : DefineValues.inst.GuildJoinPendingApprovalReject,
						EXIST_YN : false
					}, { trasaction : p_t });
				}))
				.then(values => { resolve(); })
				.catch(p_error => { reject(p_error); });
			})
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransaction = function(p_ret_user, p_ret_member, p_ret_cash, p_guild_name, p_guild_mark, p_skill_id) {
		return new Promise(function (resolve, reject) {
			let guild_data;
			let uuid = p_ret_user.dataValues.UUID;

			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// !! 순서 중요 !!
				// 1. 유저 캐쉬
				// 2. 길드 생성
				// 3. 길드 가입 승인 대기 목록 확인
				Promise.all([
					SetGTUser.inst.UpdateUserCash(t, p_ret_user, p_ret_cash),
					CreateGuild(t, uuid, p_guild_name, p_guild_mark),
					UpdateJoinPending(t, uuid)
				])
				.then(values => {
					// let user_data = values[0];
					guild_data = values[1];

					// 3. 길드 스킬
					return CreateGuildSkill(guild_data.dataValues.GUILD_ID, p_skill_id, t);
				})
				.then(ret_guild_skill => {
					let auth = DefineValues.inst.GuildAuthMaster;
					let join_states = true;

					// 4. 길드 멤버 생성
					// 5. 길드 스킬 효과 생성(GT_USER_EFFECT)
					Promise.all([
						SetGTGuild.inst.SetGuildMember(p_ret_member, uuid, guild_data.dataValues.GUILD_ID, auth, join_states, t),
						SetGTGuild.inst.SetGuildMemberOneUserEffect(uuid, guild_data.dataValues.GUILD_ID, t)
					])
					.then(values => {
						t.commit();

						// 유저, 길드, 길드스킬
						resolve([ p_ret_user, guild_data, ret_guild_skill ]);
					})
					.catch(p_error => {
						if (t)
							t.rollback();

						reject(p_error);
					});
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
	var LeaveGuildMemeber = function(p_uuid) {
		return new Promise(function (resolve, reject) {
			// GT_GUILD_MEMBER select
			GTMgr.inst.GetGTGuildMember().find({ 
				where: { UUID : p_uuid, JOIN_STATES : false }, limit : 1, order : 'REG_DATE desc' 
			})
			.then(p_ret_member => { resolve(p_ret_member); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqCreateGuild = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqCreateGuild -', p_user.uuid, p_recv);

		var recv_guild_name = p_recv.guild_name;
		var recv_guild_mark = parseInt(p_recv.guild_mark);

		return new Promise(function (resolve, reject) {
			// Promise.all GO!
			Promise.all([
				LoadGTUser.inst.SelectUser(p_user.uuid),
				LoadGTGuild.inst.GetGuildMember(p_user.uuid),
				LoadGTGuild.inst.GetGuildByName(recv_guild_name)
			])
			.then(values => {
				let user_data = values[0];
				let guild_member_data = values[1];
				let guild_data = values[2];

				// console.log('user_data.dataValues.CASH < DefineValues.inst.GuildCreateCost', user_data.dataValues.CASH, DefineValues.inst.GuildCreateCost);

				if ( user_data == null ) {
					throw ([ PacketRet.inst.retFail(), 'Not Find User In GT_USER' ]);
				} else if ( user_data.dataValues.CASH < DefineValues.inst.GuildCreateCost ) {
					throw ([ PacketRet.inst.retNotEnoughCash(), 'Need Cash', DefineValues.inst.GuildCreateCost, 'Current Cash', user_data.CASH ]);
				}

				// 이미 길드 멤버
				if ( guild_member_data != null && guild_member_data.JOIN_STATES == true )
					throw (PacketRet.inst.retAlReadyJoinGuild());

				// 동일한 길드명 존재
				if ( guild_data != null )
					throw (PacketRet.inst.retAlReadyExistGuildName());

				// 길드 재가입 제한 시간 확인
				LeaveGuildMemeber(p_user.uuid)
				.then(p_ret_member => {
					if ( p_ret_member != null && Timer.inst.GetDeltaTime(p_ret_member.REG_DATE) < 86400 )
						throw (PacketRet.inst.retRemainTime());

					resolve(values);
				})
				.catch(p_error => { reject(p_error); })
			})
			.catch(p_error => { reject(p_error); });
		})
		.then(values => {
			let user_data = values[0];
			let guild_member_data = values[1];
			let guild_data = values[2];

			let ret_cash = user_data.dataValues.CASH - DefineValues.inst.GuildCreateCost;

			let base_guild = BaseGuild.inst.GetGuildInfo(1);
			if ( typeof base_guild === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'Not Exist Guild Info In Base Target Level', 1 ]);

			// transaction - GT_USER, GT_GUILD, GT_GUILD_MEMBER, GT_GUILD_SKILL
			return ProcessTransaction(user_data, guild_member_data, ret_cash, recv_guild_name, recv_guild_mark, base_guild.open_guild_skill);
		})
		.then(values => {
			let user_data			= values[0];
			let guild_data			= values[1];
			let guild_skill_data	= values[2];

			p_ack_packet.guild_id		= guild_data.dataValues.GUILD_ID;
			p_ack_packet.result_cash	= user_data.dataValues.CASH;
			p_ack_packet.skill_id		= guild_skill_data.dataValues.SKILL_ID;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());	
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1], p_error[2], p_error[3], p_error[4]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;