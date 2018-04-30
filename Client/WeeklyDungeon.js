var listener = function() {
	socket.on('AckWeeklyDungeonStart', function (recv) {
		Acklog('AckWeeklyDungeonStart', recv);
	});

	socket.on('AckWeeklyDungeonFinish', function (recv) {
		Acklog('AckWeeklyDungeonFinish', recv);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqWeeklyDungeonStart > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.stage_id;
		}

		var send = new Packet();

		send.packet_srl = global_packet_srl++;
		send.stage_id = $('#ReqWeeklyDungeonStart > #stage_id').val();

		Reqlog('ReqWeeklyDungeonStart', JSON.stringify(send));
		socket.emit('ReqWeeklyDungeonStart', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqWeeklyDungeonFinish > #send').click(function () {
		var Packet = function() {
			this.packet_srl;
			this.stage_id;
			this.team_id;
		};

		var send = new Packet();
		send.packet_srl = global_packet_srl++;
		send.stage_id = $('#ReqWeeklyDungeonFinish > #stage_id').val();
		send.team_id = $('#ReqWeeklyDungeonFinish > #team_id').val();

		Reqlog('ReqWeeklyDungeonFinish', JSON.stringify(send));
		socket.emit('ReqWeeklyDungeonFinish', JSON.stringify(send));
	});
});