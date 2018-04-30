var listener = function() {
	socket.on('AckAccountLevelSet', function (packet) {
		Acklog('AckAccountLevelSet', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckHeroLevelSet', function (packet) {
		Acklog('AckHeroLevelSet', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckMakeInventoryItem', function (packet) {
		Acklog('AckMakeInventoryItem', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerReset', function (packet) {
		Acklog('AckInfinityTowerReset', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckWalletPoint', function (packet) {
		Acklog('AckWalletPoint', packet);
		$('#Display > #output').html(packet);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqAccountLevelSet > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.uuid;
			this.target_level;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt($('#ReqAccountLevelSet > #uuid').val());
		send.target_level = parseInt($('#ReqAccountLevelSet > #target_level').val());

		Reqlog('ReqAccountLevelSet', send);

		socket.emit('ReqAccountLevelSet', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqHeroLevelSet > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.uuid;
			this.hero_id;
			this.target_level;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt($('#ReqHeroLevelSet > #uuid').val());
		send.hero_id = parseInt($('#ReqHeroLevelSet > #hero_id').val());
		send.target_level = parseInt($('#ReqHeroLevelSet > #target_level').val());

		Reqlog('ReqHeroLevelSet', send);

		socket.emit('ReqHeroLevelSet', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqMakeInventoryItem > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqMakeInventoryItem', send);

		socket.emit('ReqMakeInventoryItem', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerReset > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqInfinityTowerReset', send);

		socket.emit('ReqInfinityTowerReset', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqWalletPoint > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqWalletPoint', send);

		socket.emit('ReqWalletPoint', JSON.stringify(send));
	});
});