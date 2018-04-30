var listener = function() {
	socket.on('AckInventory', function(packet) {
		Acklog('AckInventory', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckHeroBases', function(packet) {
		Acklog('AckHeroBases', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckTeam', function(packet) {
		Acklog('AckTeam', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckChangeTeam', function (packet) {
		Acklog('AckChangeTeam', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckStageInfo', function(packet) {
		Acklog('AckStageInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckChapterReward', function(packet) {
		Acklog('AckChapterReward', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckVip', function(packet) {
		Acklog('AckVip', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckVipReward', function(packet) {
		Acklog('AckVipReward', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckGachaInfo', function(packet) {
		Acklog('AckGachaInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckGacha', function (recv) {
		Acklog('AckGacha', recv); 
		$('#Display > #output').html(recv);
	});

	socket.on('AckWeeklyDungeonExecCount', function(packet) {
		Acklog('AckWeeklyDungeonExecCount', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckAttendInfo', function(packet) {
		Acklog('AckAttendInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckRankInfo', function(packet) {
		Acklog('AckRankInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckGuildInfo', function(packet) {
		Acklog('AckGuildInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckMissionInfo', function(packet) {
		Acklog('AckMissionInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckReConnect', function(packet) {
		Acklog('AckReConnect', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckChargeStamina', function(packet) {
		Acklog('AckChargeStamina', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckChargeSkillPoint', function(packet) {
		Acklog('AckChargeSkillPoint', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckChangeNick', function(packet) {
		Acklog('AckChangeNick', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckChangeUserIcon', function(packet) {
		Acklog('AckChangeUserIcon', packet);
		$('#Display > #output').html(packet);
	});
}

$(document).ready(function() {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqAttendInfo > #send').click(function() {
		var packet = function() {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqAttendInfo', send);

		socket.emit('ReqAttendInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInventory > #send').click(function() {
		var packet = function() {
			this.packet_srl;
		}
		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqInventory', send);

		socket.emit('ReqInventory', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroBases > #send').click(function() {
		var packet = function() {
			this.packet_srl;
			this.uuid;
		}
		var send = new packet();
		send.packet_srl = global_packet_srl++;

		send.uuid = parseInt($('#ReqHeroBases > #uuid').val());
		Reqlog('ReqHeroBases', send);

		socket.emit('ReqHeroBases', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqTeam > #send').click(function() {
		var uuid = $('#ReqTeam > #uuid').val();

		var packet = function() {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt($('#ReqTeam > #uuid').val());

		Reqlog('ReqTeam', send);

		socket.emit('ReqTeam', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqChangeTeam > #reqChangeTeam').click(function () {

		var team_id = $('#ReqChangeTeam > #team_id').val();
		var slot01 = $('#ReqChangeTeam > #slot01').val();
		var slot02 = $('#ReqChangeTeam > #slot02').val();
		var slot03 = $('#ReqChangeTeam > #slot03').val();
		var slot04 = $('#ReqChangeTeam > #slot04').val();

		var packet = function() {
			this.packet_srl;
			this.team_id;
			this.hero_id_list = [];
		};

		var json = new packet();
		json.packet_srl = global_packet_srl++;
		json.team_id = parseInt(team_id);
		json.hero_id_list[0] = parseInt(slot01);
		json.hero_id_list[1] = parseInt(slot02);
		json.hero_id_list[2] = parseInt(slot03);
		json.hero_id_list[3] = parseInt(slot04);
	
		socket.emit('ReqChangeTeam', JSON.stringify(json));
		Reqlog('ReqChangeTeam', json);
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqStageInfo > #send').click(function() {
		var uuid = $('#ReqStageInfo > #uuid').val();

		var packet = function() {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt($('#ReqStageInfo > #uuid').val());

		Reqlog('ReqStageInfo', send);

		socket.emit('ReqStageInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqChapterReward > #send').click(function() {
		var packet = function() {
			this.packet_srl;
			this.chapter_id;
			this.stage_type;
			this.reward_box_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.chapter_id = $('#ReqChapterReward > #chapter_id').val();
		send.stage_type = $('#ReqChapterReward > #stage_type').val();
		send.reward_box_id = $('#ReqChapterReward > #reward_box_id').val();

		Reqlog('ReqChapterReward', send);

		socket.emit('ReqChapterReward', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqVip > #send').click(function() {
		var packet = function() {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt($('#ReqVip > #uuid').val());

		Reqlog('ReqVip', send);

		socket.emit('ReqVip', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqVipReward > #send').click(function() {
		var packet = function() {
			this.packet_srl;
			this.uuid;
			this.step;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt($('#ReqVipReward > #uuid').val());
		send.step = parseInt($('#ReqVipReward > #step').val());

		Reqlog('ReqVipReward', send);

		socket.emit('ReqVipReward', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGachaInfo > #send').click(function() {
		var packet = function() {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqGachaInfo', send);

		socket.emit('ReqGachaInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGacha > #send').click(function () {
		var ReqGacha = function() {
			this.gacha_id;
			this.packet_srl;
		}
		var send = new ReqGacha();
		send.packet_srl = global_packet_srl++;
		send.gacha_id = $('#ReqGacha > #gacha_id').val();

		Reqlog('ReqGacha', JSON.stringify(send));
		socket.emit('ReqGacha', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqWeeklyDungeonExecCount > #send').click(function() {
		var packet = function() {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqWeeklyDungeonExecCount', send);

		socket.emit('ReqWeeklyDungeonExecCount', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGuildInfo > #send').click(function() {
		var packet = function() {
			this.packet_srl;};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqGuildInfo', send);

		socket.emit('ReqGuildInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqMissionInfo > #send').click(function() {
		var packet = function() {
			this.packet_srl;};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqMissionInfo', send);

		socket.emit('ReqMissionInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqReConnect > #send').click(function() {
		var packet = function() {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = $('#ReqReConnect > #uuid').val();
		Reqlog('ReqReConnect', send);

		socket.emit('ReqReConnect', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqChargeStamina > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = $('#ReqChargeSkillPoint > #uuid').val();
		Reqlog('ReqChargeStamina', send);

		socket.emit('ReqChargeStamina', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqChargeSkillPoint > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = $('#ReqChargeSkillPoint > #uuid').val();
		Reqlog('ReqChargeSkillPoint', send);

		socket.emit('ReqChargeSkillPoint', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqChangeNick > #send').click(function() {
		var packet = function() {
			this.packet_srl;
			this.nick;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.nick = $('#ReqChangeNick > #nick').val();
		Reqlog('ReqChangeNick', send);

		socket.emit('ReqChangeNick', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqChangeUserIcon > #send').click(function() {
		var packet = function() {
			this.packet_srl;
			this.icon_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.icon_id = $('#ReqChangeUserIcon > #icon_id').val();
		Reqlog('ReqChangeUserIcon', send);

		socket.emit('ReqChangeUserIcon', JSON.stringify(send));
	});
});