var listener = function() {
	socket.on('AckGacha', function (recv) {
		Acklog('AckGacha', recv); 
		$('#Display > #output').html(recv);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqGacha > #send').click(function () {
		var ReqGacha = function() {
			this.gacha_id;
			this.packet_srl;
		}
		var send = new ReqGacha();
		send.packet_srl = global_packet_srl++;
		send.gacha_id = $('#ReqGacha > #gacha_id').val();

		Reqlog('ReqGacha', JSON.stringify(send));
		socket.emit('ReqGacha', JSON.stringify(send));
	});
});