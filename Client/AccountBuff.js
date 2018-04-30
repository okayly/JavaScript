var listener = function() {
	// 계정 버프
	socket.on('AckAccountBuffInfo', function(packet) {
		Acklog('AckAccountBuffInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckAccountBuffLevelup', function(packet) {
		Acklog('AckAccountBuffLevelup', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckAccountBuffReset', function(packet) {
		Acklog('AckAccountBuffReset', packet);
		$('#Display > #output').html(packet);
	});
}
$(document).ready(function() {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqAccountBuffInfo > #send').click(function() {
		var packet = function() {
			this.packet_srl;};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqAccountBuffInfo', send);

		socket.emit('ReqAccountBuffInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqAccountBuffLevelup > #send').click(function() {
		var uuid = $('#ReqAccountBuffLevelup > #uuid').val();

		var packet = function() {
			this.packet_srl;
			this.account_buff_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.account_buff_id = parseInt($('#ReqAccountBuffLevelup > #account_buff_id').val());

		Reqlog('ReqAccountBuffLevelup', send);

		socket.emit('ReqAccountBuffLevelup', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqAccountBuffReset > #send').click(function() {
		var packet = function() {
			this.packet_srl;};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqAccountBuffReset', send);

		socket.emit('ReqAccountBuffReset', JSON.stringify(send));
	});
});