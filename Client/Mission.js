var listener = function() {
	socket.on('AckMissionReward', function (packet) {
		Acklog('AckMailReadInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckMissionProgress', function (packet) {
		Acklog('AckMailProgress', packet);
		$('#Display > #output').html(packet);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqMissionReward > #send').click(function () {
		let Packet = function() {
			this.packet_srl;
			this.mission_id;
		}
		var send = new Packet();
		send.packet_srl = global_packet_srl++;

		send.mission_id = $('#ReqMissionReward > #mission_id').val();

		console.log(JSON.stringify(send));
		socket.emit('ReqMissionReward', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqMissionProgress > #send').click(function () {
		let Packet = function() {
			this.packet_srl;
			this.mission_id;
			this.progress_count;
			this.is_accum;
		}

		var send = new Packet();
		send.packet_srl = global_packet_srl++;

		send.mission_id = $('#ReqMissionProgress > #mission_id').val();
		send.progress_count = $('#ReqMissionProgress > #progress_count').val();
		send.is_accum = $('#ReqMissionProgress > #is_accum').val();

		console.log(JSON.stringify(send));
		socket.emit('ReqMissionProgress', JSON.stringify(send));
	});
});