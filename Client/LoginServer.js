function Reqlog(p_cmd, p_packet) {
	console.log(p_cmd, JSON.stringify(p_packet));
}

function Acklog(p_cmd, p_packet) {
	console.log(p_cmd, p_packet);
}

$(document).ready(function () {
	//------------------------------------------------------------------------------------------------------------------
	socket.on('AckGameServer', function (packet) {
		Acklog('AckGameServer', packet);
		$('#Display > #output').html(packet);
	});

	//------------------------------------------------------------------------------------------------------------------
	socket.on('AckDownLoad', function (packet) {
		console.log('packet', packet);
		// Acklog('AckDownLoad', packet);
		// $('#Display > #output').html(packet);
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGameServer > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqGameServer', JSON.stringify(send));

		socket.emit('ReqGameServer', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFileDownLoad > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqFileDownLoad', JSON.stringify(send));

		socket.emit('ReqFileDownLoad', JSON.stringify(send));
	});
});