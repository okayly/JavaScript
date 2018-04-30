var listener = function() {
	socket.on('AckFriendInfo', function (packet) {
		Acklog('AckFriendInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFindFriend', function (packet) {
		Acklog('AckFindFriend', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendRecommandList', function (packet) {
		Acklog('AckFriendRecommandList', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendRequestSendList', function (packet) {
		Acklog('AckFriendRequestSendList', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendRequestRecvList', function (packet) {
		Acklog('AckFriendRequestRecvList', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendRequest', function (packet) {
		Acklog('AckFriendRequest', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendRequestCancel', function (packet) {
		Acklog('AckFriendRequestCancel', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendRequestCancelAll', function (packet) {
		Acklog('AckFriendRequestCancelAll', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendRequestAccept', function (packet) {
		Acklog('AckFriendRequestAccept', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendRequestAcceptAll', function (packet) {
		Acklog('AckFriendRequestAcceptAll', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('EvtFriendAccept', function (packet) {
		Acklog('EvtFriendAccept', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendRequestRefuse', function (packet) {
		Acklog('AckFriendRequestRefuse', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendRequestRefuseAll', function (packet) {
		Acklog('AckFriendRequestRefuseAll', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendDelete', function (packet) {
		Acklog('AckFriendDelete', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendSendStamina', function (packet) {
		Acklog('AckFriendSendStamina', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendSendStaminaAll', function (packet) {
		Acklog('AckFriendSendStaminaAll', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendTakeStamina', function (packet) {
		Acklog('AckFriendTakeStamina', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendTakeStaminaRecv', function (packet) {
		Acklog('AckFriendTakeStaminaRecv', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckFriendSendMemo', function (packet) {
		Acklog('AckFriendSendMemo', packet);
		$('#Display > #output').html(packet);
	});
}

$(document).ready(function () {
	global_listener.push(listener);	

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendInfo > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt($('#ReqFriendInfo > #uuid').val());

		Reqlog('ReqFriendInfo', send);

		socket.emit('ReqFriendInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFindFriend > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.nick;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.nick = $('#ReqFindFriend > #nick').val();

		Reqlog('ReqFindFriend', send);

		socket.emit('ReqFindFriend', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendRecommandList > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt($('#ReqFriendRecommandList > #uuid').val());

		Reqlog('ReqFriendRecommandList', send);

		socket.emit('ReqFriendRecommandList', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendRequestSendList > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt($('#ReqFriendRequestSendList > #uuid').val());

		Reqlog('ReqFriendRequestSendList', send);

		socket.emit('ReqFriendRequestSendList', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendRequestRecvList > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt($('#ReqFriendRequestRecvList > #uuid').val());

		Reqlog('ReqFriendRequestRecvList', send);

		socket.emit('ReqFriendRequestRecvList', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendRequest > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.request_uuid_list = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		// console.log('0 :', $('#ReqFriendRequest > #request_uuid0').val());
		// console.log('0 :', parseInt($('#ReqFriendRequest > #request_uuid' + 0).val(), 10));

		var max_count = 10;
		for ( var cnt = 0; cnt < max_count; ++cnt ) {
			var ctrl = '#ReqFriendRequest > #request_uuid' + cnt;
			var uuid = parseInt($(ctrl).val(), 10);

			// console.log('%d, uuid', cnt, uuid, isNaN(uuid), (uuid != null));

			if ( isNaN(uuid) == false && uuid != null ) 
				send.request_uuid_list.push(uuid);
		}

		Reqlog('ReqFriendRequest', send);

		socket.emit('ReqFriendRequest', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendRequestAccept > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.accept_uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.accept_uuid = parseInt($('#ReqFriendRequestAccept > #accept_uuid').val());

		Reqlog('ReqFriendRequestAccept', send);

		socket.emit('ReqFriendRequestAccept', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendRequestAcceptAll > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqFriendRequestAcceptAll', send);

		socket.emit('ReqFriendRequestAcceptAll', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendRequestRefuse > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.refuse_uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.refuse_uuid = parseInt($('#ReqFriendRequestRefuse > #refuse_uuid').val());

		Reqlog('ReqFriendRequestRefuse', send);

		socket.emit('ReqFriendRequestRefuse', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendRequestRefuseAll > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqFriendRequestRefuseAll', send);

		socket.emit('ReqFriendRequestRefuseAll', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendRequestCancel > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.cancel_uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.cancel_uuid = parseInt($('#ReqFriendRequestCancel > #cancel_uuid').val());

		Reqlog('ReqFriendRequestCancel', send);

		socket.emit('ReqFriendRequestCancel', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendRequestCancelAll > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqFriendRequestCancelAll', send);

		socket.emit('ReqFriendRequestCancelAll', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendDelete > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.delete_uuid_list = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		// console.log('0 :', $('#ReqFriendRequest > #request_uuid0').val());
		// console.log('0 :', parseInt($('#ReqFriendRequest > #request_uuid' + 0).val(), 10));

		var max_count = 10;
		for ( var cnt = 0; cnt < max_count; ++cnt ) {
			var ctrl = '#ReqFriendDelete > #delete_uuid' + cnt;
			var uuid = parseInt($(ctrl).val(), 10);

			// console.log('%d, uuid', cnt, uuid, isNaN(uuid), (uuid != null));

			if ( isNaN(uuid) == false && uuid != null ) 
				send.delete_uuid_list.push(uuid);
		}

		Reqlog('ReqFriendDelete', send);

		socket.emit('ReqFriendDelete', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendSendStamina > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.friend_uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.friend_uuid = parseInt($('#ReqFriendSendStamina > #friend_uuid').val());

		Reqlog('ReqFriendSendStamina', send);

		socket.emit('ReqFriendSendStamina', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendSendStaminaAll > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqFriendSendStaminaAll', send);

		socket.emit('ReqFriendSendStaminaAll', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendTakeStamina > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.friend_uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.friend_uuid = parseInt($('#ReqFriendTakeStamina > #friend_uuid').val());

		Reqlog('ReqFriendTakeStamina', send);

		socket.emit('ReqFriendTakeStamina', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendTakeStaminaAll > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqFriendTakeStaminaAll', send);

		socket.emit('ReqFriendTakeStaminaAll', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFriendSendMemo > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.friend_uuid;
			this.memo;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.friend_uuid = parseInt($('#ReqFriendSendMemo > #friend_uuid').val());
		send.memo = $('#ReqFriendSendMemo > #memo').val();

		Reqlog('ReqFriendSendMemo', send);

		socket.emit('ReqFriendSendMemo', JSON.stringify(send));
	});
});