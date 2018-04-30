var listener = function() {
	socket.on('AckHeroSkills', function (recv) {
		Acklog('AckHeroSkills', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckEquipment', function (recv) {
		Acklog('AckEquipment', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckEquipItem', function (recv) {
		Acklog('AckEquipItem', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckEquipItemOne', function (recv) {
		Acklog('AckEquipItemOne', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckEquipItemLevelup', function (recv) {
		Acklog('AckEquipItemLevelup', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckEquipItemReinforce', function (recv) {
		Acklog('AckEquipItemReinforce', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckEquipItemLock', function (recv) {
		Acklog('AckEquipItemLock', recv);
		$('#Display > #output').html(recv);
	});

	socket.on('AckEquipItemSell', function (recv) {
		Acklog('AckEquipItemSell', recv);
		$('#Display > #output').html(recv);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqEquipment > #send').click(function () {
		var packet = function() {
			this.packet_srl;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqEquipment', send);

		socket.emit('ReqEquipment', JSON.stringify(send));
	});	

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqEquipItem > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.hero_id;
			this.iuid_list = [];
			this.equip_set_id;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.hero_id = $('#ReqEquipItem > #hero_id').val();
		send.equip_set_id = $('#ReqEquipItem > #equip_set_id').val();
		send.iuid_list.push($('#ReqEquipItem > #iuid_1').val());
		send.iuid_list.push($('#ReqEquipItem > #iuid_2').val());
		send.iuid_list.push($('#ReqEquipItem > #iuid_3').val());
		send.iuid_list.push($('#ReqEquipItem > #iuid_4').val());

		if ( isNaN(send.equip_set_id) || send.equip_set_id == '' )
			send.equip_set_id = 0;

		for (var cnt = 0; cnt < send.iuid_list.length; ++cnt) {
			// console.log('cnt: ', cnt, 'value', send.iuid_list[cnt]);
			if ( send.iuid_list[cnt] == '' || isNaN(send.iuid_list[cnt])) {
				send.iuid_list[cnt] = 0;
			}
		}

		Reqlog('ReqEquipItem', send);

		socket.emit('ReqEquipItem', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqEquipItemOne > #send').click(function () {
		var EquipSlot = function() {
			this.slot_id;
			this.iuid;
		}
		
		var packet = function() {
			this.packet_srl;
			this.hero_id;
			this.equip_set_id;
			this.equip_slot;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.hero_id = $('#ReqEquipItemOne > #hero_id').val();
		send.equip_set_id = $('#ReqEquipItemOne > #equip_set_id').val();

		send.equip_slot = new EquipSlot();
		send.equip_slot.slot_id = $('#ReqEquipItemOne > #slot_id').val();
		send.equip_slot.iuid = $('#ReqEquipItemOne > #iuid').val();

		if ( isNaN(send.equip_set_id) || send.equip_set_id == '' )
			send.equip_set_id = 0;

		if ( isNaN(send.equip_slot.slot_id) || send.equip_slot.slot_id == '' )
			send.equip_slot.slot_id = 0;

		if ( isNaN(send.equip_slot.iuid) || send.equip_slot.iuid == '' )
			send.equip_slot.iuid = 0;

		Reqlog('ReqEquipItemOne', send);

		socket.emit('ReqEquipItemOne', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	// Equip Item levelup
	$('#ReqEquipItemLevelup > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.iuid;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.iuid = parseInt($('#ReqEquipItemLevelup > #iuid').val());

		Reqlog('ReqEquipItemLevelup', send);
		socket.emit('ReqEquipItemLevelup', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	// Equip Item Reinforce
	$('#ReqEquipItemReinforce > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.iuid;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.iuid = parseInt($('#ReqEquipItemReinforce > #iuid').val());

		Reqlog('ReqEquipItemReinforce', send);
		socket.emit('ReqEquipItemReinforce', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	// Equip Item lock
	$('#ReqEquipItemLock > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.iuid;
			this.is_lock;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.iuid = parseInt($('#ReqEquipItemLock > #iuid').val());
		send.is_lock = $('#ReqEquipItemLock > #is_lock').val();

		Reqlog('ReqEquipItemLock', send);
		socket.emit('ReqEquipItemLock', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	// Equip Item sell
	$('#ReqEquipItemSell > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.iuid_list = [];			
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		for ( let iuid_cnt = 1; iuid_cnt <= 10; ++iuid_cnt) {
			var iuid = parseInt($('#ReqEquipItemSell > #iuid_' + iuid_cnt).val());
			if ( iuid == 0 || isNaN(iuid) || iuid == '' )
				continue;

			send.iuid_list.push(iuid);
		}

		Reqlog('ReqEquipItemSell', send);
		socket.emit('ReqEquipItemSell', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
});