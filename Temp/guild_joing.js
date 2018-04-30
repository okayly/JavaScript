/********************************************************************
Title : GuildJoin
Date : 2016.06.15
Update : 2017.02.28
writer: dongsu
Desc : 길드 가입
	GUILD_AUTH  	(1 : 길드장, 2 : 장로, 3 : 일반.)
	JOIN_OPTION 	(1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
	APPROVAL_STATES (0 : 승인 대기. 1 : 승인, 2 : 거부.)
********************************************************************/
var mkDB	= require('../../DB/mkDB.js');
var GTMgr	= require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// JOIN_OPTION - 자유 가입
	var InsertGuildMember = function(p_user, p_guild_id, p_ack_cmd, p_ack_packet) {
		console.log('자유 가입 처리 guild_id : %d', p_guild_id);

		// GT_GUILD_MEMBER select - 길드 가입 확인.
		GTMgr.inst.GetGTGuildMember().find({
			where : { UUID : p_user.uuid, JOIN_STATES : true, EXIST_YN : true }
		})
		.then(function (p_ret_member) {
			if ( p_ret_member != null ) {
				if ( p_ret_member.dataValues.GUILD_ID == p_guild_id ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlReadyJoinGuild());
				} else {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyAnotherGuildMember());
				}
				return;
			}

			// GT_GUILD_MEMBER insert - 길드 가입 성공.
			GTMgr.inst.GetGTGuildMember().create(
				{ UUID : p_user.uuid, GUILD_ID : p_guild_id, GUILD_AUTH : 3, REG_DATE : Timer.inst.GetNowByStrDate(), EXIST_YN : true }
			)
			.then(function (p_ret_member_insert) {
				p_ack_packet.guild_id = p_guild_id;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

				// GT_GUILD_JOIN_PENDING_APPROVAL select - 대상 유저 대기 상태 확인.
				GTMgr.inst.GetGTGuildJoinPendingApproval().findAll({
					where : { UUID : p_user.uuid, EXIST_YN : true }
				})
				.then(function (p_ret_join_pending_approval) {
					if ( Object.keys(p_ret_join_pending_approval).length > 0 ) {
						for ( var cnt in p_ret_join_pending_approval ) {
							(function (cnt) {
								// GT_GUILD_JOIN_PENDING_APPROVAL select - 가입 승인 대기 처리
								p_ret_join_pending_approval[cnt].updateAttributes({
									APPROVAL_STATES : DefineValues.inst.GuildJoinPendingApprovalReject,
									EXIST_YN : false
								})
								.then(function (p_ret_join_pending_approval_update) {
									logger.info('InsertGuildMember p_ret_join_pending_approval_update state -', DefineValues.inst.GuildJoinPendingApprovalReject, 'Guild ID -', p_ret_join_pending_approval[cnt].dataValues.GUILD_ID);
								})
								.catch(function (p_error) {
									Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack);
								});
							})(cnt);
						}
					}
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error InsertGuildMember - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error InsertGuildMember - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error InsertGuildMember - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// JOIN_OPTION - 승인 가입
	var InsertGuildPendingApproval = function(p_user, p_guild_id, p_ack_cmd, p_ack_packet) {
		console.log('승인 가입 처리 guild_id : %d', p_guild_id);
		// GT_GUILD_JOIN_PENDING_APPROVAL select - 승인 대기 중인지 확인
		GTMgr.inst.GetGTGuildJoinPendingApproval().find({
			where : { UUID : p_user.uuid, GUILD_ID : p_guild_id, EXIST_YN : true }
		})
		.then(function (p_ret_join_pending_approval_select) {
			// console.log('p_ret_join_pending_approval_select', p_ret_join_pending_approval_select);
			if (p_ret_join_pending_approval_select != null) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyGuildJoinPendingApproval());
				return;
			}

			// GT_GUILD_JOIN_PENDING_APPROVAL insert
			GTMgr.inst.GetGTGuildJoinPendingApproval().create(
				{ UUID : p_user.uuid, GUILD_ID : p_guild_id, APPROVAL_STATES : 0, REG_DATE : Timer.inst.GetNowByStrDate() }
			)
			.then(function (p_ret) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccessGuildPendingApproval());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error InsertGuildPendingApproval - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error InsertGuildPendingApproval - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 길드 가입 로직. 
	var ProcessGuildJoin = function(p_user, p_guild_id, p_ack_cmd, p_ack_packet) {
		mkDB.inst.GetSequelize().query('select A.JOIN_OPTION, B.MAX_MEMBER_COUNT \
											, (select COUNT(*) from GT_GUILD_MEMBERs where GUILD_ID = ? and JOIN_STATES = true) as CURRENT_MEMBER_COUNT \
										from GT_GUILDs as A \
										left join BT_GUILDs as B on A.GUILD_LEVEL = B.GUILD_LV \
										where A.GUILD_ID = ? and A.GUILD_STATES = true;',
			null,
			{ raw : true, type : 'SELECT' },
			[ p_guild_id, p_guild_id ]
		)
		.then(function (p_ret_guild) {
			console.log('ProcessGuildJoin -', p_ret_guild);
			// 길드 정보. 
			console.log('현재 길드 인원 -', Object.keys(p_ret_guild).length);

			// 길드 찾기 실패. 
			if ( Object.keys(p_ret_guild).length <= 0 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotExistGuild());
				return;
			}

			// 1. 대상 길드의 인원 제한 체크. 
			var join_option		= p_ret_guild[0].JOIN_OPTION;
			var current_count	= p_ret_guild[0].CURRENT_MEMBER_COUNT;
			var max_count		= p_ret_guild[0].MAX_MEMBER_COUNT;

			console.log('현재 인원 : %d, 최대 인원 : %d', current_count, max_count);

			// 현재 최대 인원 도달. 
			if ( current_count >= max_count ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retArriveInMaxMemberCount(), 'Max Count', max_count);
				return;
			}
			
			// 2. 대상 길드의 가입 옵션 체크. (1 : 자유가입, 2 : 승인가입, 3 : 가입불가.)
			// 2-1. 대상 길드의 가입 옵션이 자유 가입이면 바로 가입.
			// 2-2. 대상 길드이 가입 옵션이 승인 가입이면 가입 신청 테이블에 저장.
			switch (join_option) {
				// 자동 가입. 
				case DefineValues.inst.GuildJoinOptionFree :
					InsertGuildMember(p_user, p_guild_id, p_ack_cmd, p_ack_packet);
					break;

				// 승인 가입. 
				case DefineValues.inst.GuildJoinOptionApproval :
					InsertGuildPendingApproval(p_user, p_guild_id, p_ack_cmd, p_ack_packet);
					break;

				// 가입 불가. 
				case DefineValues.inst.GuildJoinOptionDisable	:
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retJoinOptionIsDisabled());
					break;

				default :
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retJoinOptionIsDisabled());
					break;
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ProcessGuildJoin');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGuildJoin = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGuildJoin -', p_user.uuid, p_recv);

		var recv_guild_id = parseInt(p_recv.guild_id);

		// GT_GUILD_MEMBER select 1. 길드 가입 여부 확인.
		GTMgr.inst.GetGTGuildMember().find({ 
			where: { UUID : p_user.uuid, JOIN_STATES : true, EXIST_YN : true } 
		})
		.then(function (p_ret_member) {
			if (p_ret_member != null) {
				// 길드 가입 한적 있음. 시간 계산 해야 함. 
				if ( Timer.inst.GetDeltaTime(p_ret_member.dataValues.REG_DATE) > 86400 ) { // 24시간 
					ProcessGuildJoin(p_user, recv_guild_id, p_ack_cmd, p_ack_packet);
				} else {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retRemainTime());
				}
			} else {
				// 길드 가입 한적 없음
				// GT_GUILD_ 2. 마지막 길드 탈퇴 시간 확인(현 시점이 중요함)
				GTMgr.inst.GetGTGuildMember().find({ 
					where: { UUID : p_user.uuid, JOIN_STATES : false }, limit : 1, order : 'REG_DATE desc' 
				})
				.then(function (p_ret_user) {
					if ( p_ret_user == null ) {
						// 길드 가입 한적 없음. 
						ProcessGuildJoin(p_user, recv_guild_id, p_ack_cmd, p_ack_packet);
					} else {
						// 길드 가입 한적 있음. 시간 계산 해야 함
						if ( Timer.inst.GetDeltaTime(p_ret_user.REG_DATE) > 86400 ) { // 24시간 
							ProcessGuildJoin(p_user, recv_guild_id, p_ack_cmd, p_ack_packet);
						} else {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retRemainTime());
						}
					}
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildJoin - 2');
				});
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGuildJoin - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;