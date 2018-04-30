var listener = function() {
	socket.on('AckBuyCash', function (packet) {
		Acklog('AckBuyCash', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckBuyGold', function (packet) {
		Acklog('AckBuyGold', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckBuyStamina', function (packet) {
		Acklog('AckBuyStamina', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckBuySkillPoint', function (packet) {
		Acklog('AckBuySkillPoint', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckBuyEquipItemInventorySlot', function (packet) {
		Acklog('AckBuyEquipItemInventorySlot', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckBuyPvpAbleCount', function (packet) {
		Acklog('AckBuyPvpAbleCount', packet);
		$('#Display > #output').html(packet);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqBuyCash > #send').click(function() {
		var uuid = $('#ReqBuyCash > #uuid').val();
		var cash_id = $('#ReqBuyCash > #cash_id').val();

		var packet = function () {
			this.packet_srl;
			this.uuid;
			this.cash_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt(uuid);
		send.cash_id = parseInt(cash_id);

		Reqlog('ReqBuyCash', send);

		socket.emit('ReqBuyCash', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqBuyGold > #send').click(function() {
		var uuid = $('#ReqBuyGold > #uuid').val();

		var packet = function () {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt(uuid);

		Reqlog('ReqBuyGold', send);

		socket.emit('ReqBuyGold', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqBuyStamina > #send').click(function() {
		var uuid = $('#ReqBuyStamina > #uuid').val();

		var packet = function () {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt(uuid);

		Reqlog('ReqBuyStamina', send);

		socket.emit('ReqBuyStamina', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqBuySkillPoint > #send').click(function() {
		var uuid = $('#ReqBuySkillPoint > #uuid').val();

		var packet = function () {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt(uuid);

		Reqlog('ReqBuySkillPoint', send);

		socket.emit('ReqBuySkillPoint', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqBuyEquipItemInventorySlot > #send').click(function() {
		var uuid = $('#ReqBuyEquipItemInventorySlot > #uuid').val();

		var packet = function () {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt(uuid);

		Reqlog('ReqBuyEquipItemInventorySlot', send);

		socket.emit('ReqBuyEquipItemInventorySlot', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqBuyPvpAbleCount > #send').click(function() {
		var uuid = $('#ReqBuyPvpAbleCount > #uuid').val();

		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqBuyPvpAbleCount', send);
		socket.emit('ReqBuyPvpAbleCount', JSON.stringify(send));
	});
});