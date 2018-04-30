var listener = function() {
	socket.on('AckCreateGuild', function (recv) {
		Acklog('AckCreateGuild', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckRecommandGuild', function (recv) {
		Acklog('AckRecommandGuild', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckGuildDetailInfo', function (recv) {
		Acklog('AckGuildDetailInfo', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckGuildJoin', function (recv) {
		Acklog('AckGuildJoin', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckGuildPendingApprovalList', function (recv) {
		Acklog('AckGuildPendingApprovalList', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckGuildPendingApprovalProcess', function (recv) {
		Acklog('AckGuildPendingApprovalProcess', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckGuildMemberBan', function (recv) {
		Acklog('AckGuildMemberBan', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckFindGuild', function (recv) {
		Acklog('AckFindGuild', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckWithdrawalAtGuild', function (recv) {
		Acklog('AckWithdrawalAtGuild', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckChangeGuildInfo', function (recv) {
		Acklog('AckChangeGuildInfo', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckGuildInvitation', function (recv) {
		Acklog('AckGuildInvitation', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckGuildInvitationList', function (recv) {
		Acklog('AckGuildInvitationList', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckGuildInvitationProcess', function (recv) {
		Acklog('AckGuildInvitationProcess', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckChangeAuth', function (recv) {
		Acklog('AckChangeAuth', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckChangeAuthConfirm', function (recv) {
		Acklog('AckChangeAuthConfirm', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckGuildPointDonation', function (recv) { 
		Acklog('AckGuildPointDonation', recv);
		$('#Display > #output').html(recv);
	});
	socket.on('AckGuildLevelup', function (recv) { 
		Acklog('AckGuildLevelup', recv); 
		$('#Display > #output').html(recv);
	});
	socket.on('AckGuildRaidInfo', function (recv) { 
		Acklog('AckGuildRaid', recv); 
		$('#Display > #output').html(recv);
	});
	socket.on('AckGuildRaidOpen', function (recv) { 
		Acklog('AckGuildRaidOpen', recv); 
		$('#Display > #output').html(recv);
	});
	socket.on('AckGuildRaidBattleStart', function (recv) { 
		Acklog('AckGuildRaidBattleStart', recv); 
		$('#Display > #output').html(recv);
	});
	socket.on('AckGuildRaidBattleFinish', function (recv) { 
		Acklog('AckGuildRaidBattleFinish', recv); 
		$('#Display > #output').html(recv);
	});
	socket.on('AckGuildRaidRank', function (recv) { 
		Acklog('AckGuildRaidRank', recv); 
		$('#Display > #output').html(recv);
	});
	socket.on('AckGuildSkillLevelUp', function (recv) { 
		Acklog('AckGuildSkillLevelUp', recv); 
		$('#Display > #output').html(recv);
	});

	socket.on('AckForceChangeAuth', function (recv) {
		Acklog('AckForceChangeAuth', recv);
		$('#Display > #output').html(recv);
	});
}
$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqCreateGuild > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.guild_name;
			this.guild_mark;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.guild_name = $('#ReqCreateGuild > #guild_name').val();
		send.guild_mark = $('#ReqCreateGuild > #guild_mark').val();

		Reqlog('ReqCreateGuild', JSON.stringify(send));
		socket.emit('ReqCreateGuild', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqRecommandGuild > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqRecommandGuild', JSON.stringify(send));
		socket.emit('ReqRecommandGuild', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildDetailInfo > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.guild_id;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.guild_id = $('#ReqGuildDetailInfo > #guild_id').val();

		Reqlog('ReqGuildDetailInfo', JSON.stringify(send));
		socket.emit('ReqGuildDetailInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildJoin > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.guild_id;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.guild_id = $('#ReqGuildJoin > #guild_id').val();

		Reqlog('ReqGuildJoin', JSON.stringify(send));
		socket.emit('ReqGuildJoin', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildPendingApprovalList > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqGuildPendingApprovalList', JSON.stringify(send));
		socket.emit('ReqGuildPendingApprovalList', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildPendingApprovalProcess > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.target_uuid;
			this.process_type;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.target_uuid = $('#ReqGuildPendingApprovalProcess > #target_uuid').val();
		send.process_type = $('#ReqGuildPendingApprovalProcess > #process_type').val();

		Reqlog('ReqGuildPendingApprovalProcess', JSON.stringify(send));
		socket.emit('ReqGuildPendingApprovalProcess', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildMemberBan > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.target_uuid;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.target_uuid = $('#ReqGuildMemberBan > #target_uuid').val();

		Reqlog('ReqGuildMemberBan', JSON.stringify(send));
		socket.emit('ReqGuildMemberBan', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFindGuild > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.guild_name;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.guild_name = $('#ReqFindGuild > #guild_name').val();

		Reqlog('ReqFindGuild', JSON.stringify(send));
		socket.emit('ReqFindGuild', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqLeaveGuild > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqWithdrawalAtGuild', JSON.stringify(send));
		socket.emit('ReqWithdrawalAtGuild', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqChangeGuildInfo > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.guild_mark;
			this.guild_notice;
			this.guild_join_option;
			this.auto_master_change;
			this.elder_raid_open;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.guild_mark = $('#ReqChangeGuildInfo > #guild_mark').val();
		send.guild_notice = $('#ReqChangeGuildInfo > #guild_notice').val();
		send.guild_join_option = $('#ReqChangeGuildInfo > #join_option').val();
		send.auto_master_change = $('#ReqChangeGuildInfo > #auto_master_change').val();
		send.elder_raid_open = $('#ReqChangeGuildInfo > #elder_raid_open').val();

		Reqlog('ReqChangeGuildInfo', JSON.stringify(send));
		socket.emit('ReqChangeGuildInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildInvitation > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.user_nick;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.user_nick = $('#ReqGuildInvitation > #user_nick').val();

		Reqlog('ReqGuildInvitation', JSON.stringify(send));
		socket.emit('ReqGuildInvitation', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildInvitationList > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqGuildInvitationList', JSON.stringify(send));
		socket.emit('ReqGuildInvitationList', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildInvitationProcess > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.guild_id;
			this.process_type;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.guild_id = $('#ReqGuildInvitationProcess > #guild_id').val();
		send.process_type = $('#ReqGuildInvitationProcess > #process_type').val();

		Reqlog('ReqGuildInvitationProcess', JSON.stringify(send));
		socket.emit('ReqGuildInvitationProcess', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqChangeAuth > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.auth_type;
			this.target_uuid;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.auth_type = $('#ReqChangeAuth > #auth_type').val();
		send.target_uuid = $('#ReqChangeAuth > #target_uuid').val();

		Reqlog('ReqChangeAuth', JSON.stringify(send));
		socket.emit('ReqChangeAuth', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqChangeAuthConfirm > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqChangeAuthConfirm', JSON.stringify(send));
		socket.emit('ReqChangeAuthConfirm', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildPointDonation > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.guild_id;
			this.donation_id;
		}

		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.guild_id = $('#ReqGuildPointDonation > #guild_id').val();
		send.donation_id = $('#ReqGuildPointDonation > #donation_id').val();

		Reqlog('ReqGuildPointDonation', JSON.stringify(send));
		socket.emit('ReqGuildPointDonation', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildLevelup > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.guild_id;
		}

		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.guild_id = $('#ReqGuildLevelup > #guild_id').val();

		Reqlog('ReqGuildLevelup', JSON.stringify(send));
		socket.emit('ReqGuildLevelup', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildRaidInfo > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.guild_id;
		}

		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.guild_id = $('#ReqGuildRaidInfo > #guild_id').val();

		Reqlog('ReqGuildRaidInfo', JSON.stringify(send));
		socket.emit('ReqGuildRaidInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildRaidOpen > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.guild_id;
			this.chapter_id;
			this.stage_id;
		}

		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.guild_id = $('#ReqGuildRaidOpen > #guild_id').val();
		send.chapter_id = $('#ReqGuildRaidOpen > #chapter_id').val();
		send.stage_id = $('#ReqGuildRaidOpen > #stage_id').val();

		Reqlog('ReqGuildRaidOpen', JSON.stringify(send));
		socket.emit('ReqGuildRaidOpen', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildRaidBattleStart > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.guild_id;
			this.chapter_id;
			this.stage_id;
		}

		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.guild_id = $('#ReqGuildRaidBattleStart > #guild_id').val();
		send.chapter_id = $('#ReqGuildRaidBattleStart > #chapter_id').val();
		send.stage_id = $('#ReqGuildRaidBattleStart > #stage_id').val();

		Reqlog('ReqGuildRaidBattleStart', JSON.stringify(send));
		socket.emit('ReqGuildRaidBattleStart', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildRaidBattleFinish > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.guild_id;
			this.chapter_id;
			this.stage_id;
			this.ret_boss_hp;
			this.attack_damage;
		}

		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.guild_id = $('#ReqGuildRaidBattleFinish > #guild_id').val();
		send.chapter_id = $('#ReqGuildRaidBattleFinish > #chapter_id').val();
		send.stage_id = $('#ReqGuildRaidBattleFinish > #stage_id').val();
		send.ret_boss_hp = $('#ReqGuildRaidBattleFinish > #ret_boss_hp').val();
		send.attack_damage = $('#ReqGuildRaidBattleFinish > #attack_damage').val();

		Reqlog('ReqGuildRaidBattleFinish', JSON.stringify(send));
		socket.emit('ReqGuildRaidBattleFinish', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildRaidRank > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.guild_id;
			this.rank_type;
			this.stage_id;
		}

		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.guild_id = $('#ReqGuildRaidRank > #guild_id').val();
		send.rank_type = $('#ReqGuildRaidRank > #rank_type').val();
		send.stage_id = $('#ReqGuildRaidRank > #stage_id').val();

		Reqlog('ReqGuildRaidRank', JSON.stringify(send));
		socket.emit('ReqGuildRaidRank', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildSkillLevelUp > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.skill_id;
		}

		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.skill_id = $('#ReqGuildSkillLevelUp > #skill_id').val();

		Reqlog('ReqGuildSkillLevelUp', JSON.stringify(send));
		socket.emit('ReqGuildSkillLevelUp', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqForceChangeAuth > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.master_uuid;
		}

		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.master_uuid = $('#ReqForceChangeAuth > #master_uuid').val();

		Reqlog('ReqForceChangeAuth', JSON.stringify(send));
		socket.emit('ReqForceChangeAuth', JSON.stringify(send));
	});

	// //------------------------------------------------------------------------------------------------------------------
	// $('#ReqGuildRaidStageDamageRank > #send').click(function () {
	// 	var Packet = function() {
	// 		this.packet_srl;
	// 		this.guild_id;
	// 		this.guild_raid_stage_id;
	// 	}

	// 	var send = new Packet();
	// 	send.packet_srl = global_packet_srl++;
	// 	send.guild_id = $('#ReqGuildRaidStageDamageRank > #guild_id').val();		
	// 	send.guild_raid_stage_id = $('#ReqGuildRaidStageDamageRank > #guild_raid_stage_id').val();

	// 	Reqlog('ReqGuildRaidStageDamageRank', JSON.stringify(send));
	// 	socket.emit('ReqGuildRaidStageDamageRank', JSON.stringify(send));
	// });

	// //------------------------------------------------------------------------------------------------------------------
	// $('#ReqGuildRaidChapterDamageRank > #send').click(function () {
	// 	var Packet = function() {
	// 		this.packet_srl;
	// 		this.guild_id;
	// 		this.guild_raid_chapter_id;
	// 	}

	// 	var send = new Packet();
	// 	send.packet_srl = global_packet_srl++;
	// 	send.guild_id = $('#ReqGuildRaidChapterDamageRank > #guild_id').val();		
	// 	send.guild_raid_chapter_id = $('#ReqGuildRaidChapterDamageRank > #guild_raid_chapter_id').val();

	// 	Reqlog('ReqGuildRaidChapterDamageRank', JSON.stringify(send));
	// 	socket.emit('ReqGuildRaidChapterDamageRank', JSON.stringify(send));
	// });

	// //------------------------------------------------------------------------------------------------------------------
	// $('#ReqGuildRaidChapterClearRank > #send').click(function () {
	// 	var Packet = function() {
	// 		this.packet_srl;
	// 		this.guild_id;
	// 		this.guild_chapter_id;
	// 	}

	// 	var send = new Packet();
	// 	send.packet_srl = global_packet_srl++;
	// 	send.guild_id = $('#ReqGuildRaidChapterClearRank > #guild_id').val();		
	// 	send.guild_chapter_id = $('#ReqGuildRaidChapterClearRank > #guild_chapter_id').val();

	// 	Reqlog('ReqGuildRaidChapterClearRank', JSON.stringify(send));
	// 	socket.emit('ReqGuildRaidChapterClearRank', JSON.stringify(send));
	// });

	// //------------------------------------------------------------------------------------------------------------------
	// $('#ReqGuildRaidChapter > #send').click(function () {
	// 	var Packet = function() {
	// 		this.packet_srl;
	// 		this.guild_id;
	// 	}

	// 	var send = new Packet();
	// 	send.packet_srl = global_packet_srl++;
	// 	send.guild_id = $('#ReqGuildRaidChapter > #guild_id').val();		

	// 	Reqlog('ReqGuildRaidChapter', JSON.stringify(send));
	// 	socket.emit('ReqGuildRaidChapter', JSON.stringify(send));
	// });

	// //------------------------------------------------------------------------------------------------------------------
	// $('#ReqGuildRaidStage > #send').click(function () {
	// 	var Packet = function() {
	// 		this.packet_srl;
	// 		this.guild_id;
	// 		this.guild_raid_chapter_id;
	// 	}

	// 	var send = new Packet();
	// 	send.packet_srl = global_packet_srl++;
	// 	send.guild_id = $('#ReqGuildRaidStage > #guild_id').val();
	// 	send.guild_raid_chapter_id = $('#ReqGuildRaidStage > #guild_raid_chapter_id').val();

	// 	Reqlog('ReqGuildRaidStage', JSON.stringify(send));
	// 	socket.emit('ReqGuildRaidStage', JSON.stringify(send));
	// });
});