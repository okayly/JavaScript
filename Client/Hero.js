var listener = function() {
	socket.on('AckHeroSkills', function (recv) {
		Acklog('AckHeroSkills', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckHeroSkillLevelup', function (recv) {
		Acklog('AckHeroSkillLevelup', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckHeroSummon', function (recv) {
		Acklog('AckHeroSummon', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckHeroEvolution', function (recv) {
		Acklog('AckHeroEvolution', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckHeroLevelup', function (recv) {
		Acklog('AckHeroLevelup', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckHeroPromotion', function (recv) {
		Acklog('AckHeroPromotion', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckHeroArmySkill', function (recv) {
		Acklog('AckHeroArmySkill', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckHeroCombiBuff', function (recv) {
		Acklog('AckHeroCombiBuff', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckChangeTeam', function (recv) {
		Acklog('AckChangeTeam', recv);
		$('#ReqChangeTeam > #output').html(recv);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHero > #send').click(function () {
		var packet = function() {
			this.packet_srl;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqHero', send);

		socket.emit('ReqHeroBases', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroEquipItem > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.uuid;
			this.hero_id;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = $('#ReqHeroEquipItem > #uuid').val();
		send.hero_id = $('#ReqHeroEquipItem > #hero_id').val();

		Reqlog('ReqHeroEquipItem', send);

		socket.emit('ReqHeroEquipItem', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroSkills > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.uuid;
			this.hero_id;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = $('#ReqHeroSkills > #uuid').val();
		send.hero_id = $('#ReqHeroSkills > #hero_id').val();

		Reqlog('ReqHeroSkills', send);

		socket.emit('ReqHeroSkills', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroSkillLevelup > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.uuid;
			this.hero_id;
			this.skill_id;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = $('#ReqHeroSkillLevelup > #uuid').val();
		send.hero_id = $('#ReqHeroSkillLevelup > #hero_id').val();
		send.skill_id = $('#ReqHeroSkillLevelup > #skill_id').val();

		Reqlog('ReqHeroSkillLevelup', send);

		socket.emit('ReqHeroSkillLevelup', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroSummon > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.iuid;
			this.hero_id;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.iuid = $('#ReqHeroSummon > #iuid').val();
		send.hero_id = $('#ReqHeroSummon > #hero_id').val();

		Reqlog('ReqHeroSummon', send);

		socket.emit('ReqHeroSummon', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroEvolution > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.uuid;
			this.need_item_iuid;
			this.hero_id;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = $('#ReqHeroEvolution > #uuid').val();
		send.need_item_iuid = $('#ReqHeroEvolution > #iuid').val();
		send.hero_id = $('#ReqHeroEvolution > #hero_id').val();

		Reqlog('ReqHeroEvolution', send);

		socket.emit('ReqHeroEvolution', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroLevelup > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.uuid;
			this.hero_id;
			this.iuid;
			this.use_item_count;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = $('#ReqHeroLevelup > #uuid').val();
		send.hero_id = $('#ReqHeroLevelup > #hero_id').val();
		send.iuid = $('#ReqHeroLevelup > #iuid').val();
		send.use_item_count = $('#ReqHeroLevelup > #item_count').val();

		Reqlog('ReqHeroLevelup', send);

		socket.emit('ReqHeroLevelup', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroPromotion > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.uuid;
			this.hero_id;
			this.need_item_iuids = [];
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = $('#ReqHeroPromotion > #uuid').val();
		send.hero_id = $('#ReqHeroPromotion > #hero_id').val();
		var iuid1 = $('#ReqHeroPromotion > #need_item_iuid1').val();
		if ( iuid1 != 0 && iuid1 != undefined ) {
			send.need_item_iuids.push(iuid1);
		}

		var iuid2 = $('#ReqHeroPromotion > #need_item_iuid2').val();
		if ( iuid2 != 0 && iuid2 != undefined ) {
			send.need_item_iuids.push(iuid2);
		}

		var iuid3 = $('#ReqHeroPromotion > #need_item_iuid3').val();
		if ( iuid3 != 0 && iuid3 != undefined ) {
			send.need_item_iuids.push(iuid3);
		}

		var iuid4 = $('#ReqHeroPromotion > #need_item_iuid4').val();
		if ( iuid4 != 0 && iuid4 != undefined ) {
			send.need_item_iuids.push(iuid4);
		}

		var iuid5 = $('#ReqHeroPromotion > #need_item_iuid5').val();
		if ( iuid5 != 0 && iuid5 != undefined ) {
			send.need_item_iuids.push(iuid5);
		}

		var iuid6 = $('#ReqHeroPromotion > #need_item_iuid6').val();
		if ( iuid6 != 0 && iuid6 != undefined ) {
			send.need_item_iuids.push(iuid6);
		}

		Reqlog('ReqHeroLevelup', send);

		socket.emit('ReqHeroPromotion', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroArmySkill > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.hero_id;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.hero_id = $('#ReqHeroArmySkill > #hero_id').val();

		Reqlog('ReqHeroArmySkill', send);

		socket.emit('ReqHeroArmySkill', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroCombiBuff > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.buff_id;
			this.buff_level;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.buff_id = $('#ReqHeroCombiBuff > #buff_id').val();
		send.buff_level = $('#ReqHeroCombiBuff > #buff_level').val();

		Reqlog('ReqHeroCombiBuff', send);

		socket.emit('ReqHeroCombiBuff', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqChangeTeam > #send').click(function () {

		var packet = function() {
			this.packet_srl;
			this.team_id;
			this.hero_id_list = [];
			this.battle_power;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.team_id = $('#ReqChangeTeam > #team_id').val();
		send.hero_id_list[0] = $('#ReqChangeTeam > #slot01').val();
		send.hero_id_list[1] = $('#ReqChangeTeam > #slot02').val();
		send.hero_id_list[2] = $('#ReqChangeTeam > #slot03').val();
		send.hero_id_list[3] = $('#ReqChangeTeam > #slot04').val();
		send.battle_power = $('#ReqChangeTeam > #battle_power').val();
		
		socket.emit('ReqChangeTeam', JSON.stringify(send));
		Reqlog('ReqChangeTeam', send);
	});
});