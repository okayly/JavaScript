var listener = function() {
	socket.on('AckUseItem', function (packet) {
		Acklog('AckUseItem', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckSellItem', function (packet) {
		Acklog('AckSellItem', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckUseRandomBox', function (packet) {
		Acklog('AckUseRandomBox', packet);
		$('#Display > #output').html(packet);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqUseItem > #send').click(function() {
		var uuid = $('#ReqUseItem > #uuid').val();
		var iuid = $('#ReqUseItem > #iuid').val();

		var packet = function () {
			this.packet_srl;
			this.uuid;
			this.iuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt(uuid);
		send.iuid = parseInt(iuid);

		Reqlog('ReqUseItem', send);

		socket.emit('ReqUseItem', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqSellItem > #send').click(function() {
		var uuid = $('#ReqSellItem > #uuid').val();
		var iuid = $('#ReqSellItem > #iuid').val();
		var sell_count = $('#ReqSellItem > #sell_count').val();

		var packet = function () {
			this.packet_srl;
			this.uuid;
			this.iuid;
			this.sell_count;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt(uuid);
		send.iuid = parseInt(iuid);
		send.sell_count = parseInt(sell_count);

		Reqlog('ReqSellItem', send);

		socket.emit('ReqSellItem', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqUseRandomBox > #send').click(function() {
		var uuid = $('#ReqUseRandomBox > #uuid').val();
		var iuid = $('#ReqUseRandomBox > #iuid').val();
		var use_count = $('#ReqUseRandomBox > #use_count').val();

		var packet = function () {
			this.packet_srl;
			this.uuid;
			this.iuid;
			this.use_count;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt(uuid);
		send.iuid = parseInt(iuid);
		send.use_count = parseInt(use_count);

		Reqlog('ReqUseRandomBox', send);

		socket.emit('ReqUseRandomBox', JSON.stringify(send));
	});
});