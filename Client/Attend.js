var listener = function() {
	socket.on('AckAttendDailyReward', function (packet) {
		Acklog('AckAttendDailyReward', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckAddAttendDailyReward', function (packet) {
		Acklog('AckAddAttendDailyReward', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckAttendAccumReward', function (packet) {
		Acklog('AckAttendAccumReward', packet);
		$('#Display > #output').html(packet);
	});
}

$(document).ready(function () {
	global_listener.push(listener);	

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqAttendDailyReward > #send').click(function() {
		var uuid = $('#ReqAttendDailyReward > #uuid').val();

		var packet = function () {
			this.packet_srl;
			this.uuid;
			this.reward_day;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt(uuid);
		send.reward_day = parseInt($('#ReqAttendDailyReward > #reward_day').val());

		Reqlog('ReqAttendDailyReward', send);

		socket.emit('ReqAttendDailyReward', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqAddAttendDailyReward > #send').click(function() {
		var uuid = $('#ReqAddAttendDailyReward > #uuid').val();

		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqAddAttendDailyReward', send);

		socket.emit('ReqAddAttendDailyReward', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqAttendAccumReward > #send').click(function() {
		var uuid = $('#ReqAttendAccumReward > #uuid').val();

		var packet = function () {
			this.packet_srl;
			this.uuid;
			this.reward_day;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = parseInt(uuid);
		send.reward_day = parseInt($('#ReqAttendAccumReward > #reward_day').val());

		Reqlog('ReqAttendAccumReward', send);

		socket.emit('ReqAttendAccumReward', JSON.stringify(send));
	});
});