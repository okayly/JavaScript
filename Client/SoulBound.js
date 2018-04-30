var listener = function() {
	socket.on('AckHeroRuneSlotInfo', function (packet) {
		Acklog('AckHeroRuneSlotInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckHeroRuneInfo', function (packet) {
		Acklog('AckHeroRuneInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckHeroRuneSlotOpen', function (packet) {
		Acklog('AckHeroRuneSlotOpen', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckHeroRuneCreate', function (packet) {
		Acklog('AckHeroRuneCreate', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckHeroRuneEquip', function (packet) {
		Acklog('AckHeroRuneEquip', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckHeroRuneUnEquip', function (packet) {
		Acklog('AckHeroRuneUnEquip', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckHeroRuneLevelup', function (packet) {
		Acklog('AckHeroRuneLevelup', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckHeroEquipRuneLevelup', function (packet) {
		Acklog('AckHeroEquipRuneLevelup', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckHeroRuneSell', function (packet) {
		Acklog('AckHeroRuneSell', packet);
		$('#Display > #output').html(packet);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroRuneSlotInfo > #send').click(function() {
		var uuid = $('#ReqHeroRuneSlotInfo > #uuid').val();

		var packet = function () { 
			this.packet_srl;
		};
		var send = new packet();
		send.packet_srl = global_packet_srl++;
		
		Reqlog('ReqHeroRuneSlotInfo', send);

		socket.emit('ReqHeroRuneSlotInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroRuneInfo > #send').click(function() {
		var uuid = $('#ReqHeroRuneInfo > #uuid').val();

		var packet = function () { 
			this.packet_srl;
		};
		var send = new packet();
		send.packet_srl = global_packet_srl++;
		
		Reqlog('ReqHeroRuneInfo', send);

		socket.emit('ReqHeroRuneInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroRuneSlotOpen > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.uuid;
			this.reward_day;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.hero_id = $('#ReqHeroRuneSlotOpen > #hero_id').val();
		send.rune_slot_id = $('#ReqHeroRuneSlotOpen > #rune_slot_id').val();
		Reqlog('ReqHeroRuneSlotOpen', send);

		socket.emit('ReqHeroRuneSlotOpen', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroRuneCreate > #send').click(function() {
		var Item = function () {
			this.iuid;
			this.item_id;
			this.item_count;
		}

		var packet = function () {
			this.packet_srl;
			this.rune_recipe_id;
			this.use_item_list = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.rune_recipe_id = parseInt($('#ReqHeroRuneCreate > #rune_recipe_id').val());

		var iuid_list = [1
						, 10
						, 11
						, 12
						, 18
						, 19
						, 212
						, 215
						, 216
		];
		var item_id_list = [3020005
							, 3020002
							, 3020006
							, 3020004
							, 3020001
							, 3020003
							, 3020016
							, 3020014
							, 3020017

		];

		for (var cnt in iuid_list) {
			var item = new Item();
			item.iuid = iuid_list[cnt];
			item.item_id = item_id_list[cnt];
			// item.item_count = Math.floor(Math.random() * (30 - 1 + 1)) + 1;
			item.item_count = 1;

			send.use_item_list.push(item);
		}

		Reqlog('ReqHeroRuneCreate', send);

		socket.emit('ReqHeroRuneCreate', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroRuneEquip > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.hero_id;
			this.rune_slot_id;
			this.ruid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.hero_id = parseInt($('#ReqHeroRuneEquip > #hero_id').val());
		send.rune_slot_id = parseInt($('#ReqHeroRuneEquip > #rune_slot_id').val());
		send.ruid = parseInt($('#ReqHeroRuneEquip > #ruid').val());
		Reqlog('ReqHeroRuneEquip', send);

		socket.emit('ReqHeroRuneEquip', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroRuneUnEquip > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.hero_id;
			this.rune_slot_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.hero_id = parseInt($('#ReqHeroRuneUnEquip > #hero_id').val());
		send.rune_slot_id = parseInt($('#ReqHeroRuneUnEquip > #rune_slot_id').val());
		Reqlog('ReqHeroRuneUnEquip', send);

		socket.emit('ReqHeroRuneUnEquip', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroRuneLevelup > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.ruid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.ruid = parseInt($('#ReqHeroRuneLevelup > #ruid').val());
		Reqlog('ReqHeroRuneLevelup', send);

		socket.emit('ReqHeroRuneLevelup', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroEquipRuneLevelup > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.hero_id;
			this.rune_slot_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.hero_id = parseInt($('#ReqHeroEquipRuneLevelup > #hero_id').val());
		send.rune_slot_id = parseInt($('#ReqHeroEquipRuneLevelup > #rune_slot_id').val());
		Reqlog('ReqHeroEquipRuneLevelup', send);

		socket.emit('ReqHeroEquipRuneLevelup', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroRuneSell > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.ruid;
			this.sell_count;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.ruid = parseInt($('#ReqHeroRuneSell > #ruid').val());
		send.sell_count = parseInt($('#ReqHeroRuneSell > #sell_count').val());

		Reqlog('ReqHeroRuneSell', send);

		socket.emit('ReqHeroRuneSell', JSON.stringify(send));
	});
});