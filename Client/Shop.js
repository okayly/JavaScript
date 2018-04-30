var listener = function() {
	socket.on('AckShopIDs', function (packet) {
		Acklog('AckShopIDs', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckShopBuy', function (packet) {
		Acklog('AckShopBuy', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckShopReset', function (packet) {
		Acklog('AckShopReset', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckShopResetCount', function (packet) {
		Acklog('AckShopResetCount', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckRandomShopIsOpen', function (packet) {
		Acklog('AckRandomShopIsOpen', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckRandomShopOpen', function (packet) {
		Acklog('AckRandomShopOpen', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckShopBuyHeroExp', function (packet) {
		Acklog('AckShopBuyHeroExp', packet);
		$('#Display > #output').html(packet);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqShopIDs > #send').click(function() {
		var uuid = $('#ReqShopIDs > #uuid').val();

		var packet = function () {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt(uuid);

		Reqlog('ReqShopIDs', send);

		socket.emit('ReqShopIDs', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqShopBuy > #send').click(function() {
		var uuid = $('#ReqShopBuy > #uuid').val();
		var shop_id = $('#ReqShopBuy > #shop_id').val();
		var item_slot = $('#ReqShopBuy > #item_slot').val();
		var shop_type = $('#ReqShopBuy > #shop_type').val();

		var packet = function () {
			this.packet_srl;
			this.uuid;
			this.shop_id;
			this.item_slot;
			this.shop_type;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt(uuid);
		send.shop_id = parseInt(shop_id);
		send.item_slot = parseInt(item_slot);
		send.shop_type = parseInt(shop_type);

		Reqlog('ReqShopBuy', send);

		socket.emit('ReqShopBuy', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqShopReset > #send').click(function() {
		var uuid = $('#ReqShopReset > #uuid').val();
		var shop_type = $('#ReqShopReset > #shop_type').val();

		var packet = function () {
			this.packet_srl;
			this.uuid;
			this.shop_type;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt(uuid);
		send.shop_type = parseInt(shop_type);

		Reqlog('ReqShopReset', send);

		socket.emit('ReqShopReset', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqShopResetCount > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqShopResetCount', send);

		socket.emit('ReqShopResetCount', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqRandomShopIsOpen > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt($('#ReqRandomShopIsOpen > #uuid').val());

		Reqlog('ReqRandomShopIsOpen', send);

		socket.emit('ReqRandomShopIsOpen', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqRandomShopOpen > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqRandomShopOpen', send);

		socket.emit('ReqRandomShopOpen', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqShopBuyHeroExp > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.uuid;
			this.item_id;
			this.item_count;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt($('#ReqShopBuyHeroExp > #uuid').val());
		send.item_id = parseInt($('#ReqShopBuyHeroExp > #item_id').val());
		send.item_count = parseInt($('#ReqShopBuyHeroExp > #item_count').val());

		Reqlog('ReqShopBuyHeroExp', send);

		socket.emit('ReqShopBuyHeroExp', JSON.stringify(send));
	});
});