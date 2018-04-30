var listener = function() {
	socket.on('AckChargeStamina', function (packet) {
		Acklog(packet);
		$('#ReqChargeStamina > #output').html(packet);
	});

	socket.on('AckChargeSkillPoint', function (packet) {
		Acklog(packet);
		$('#ReqChargeSkillPoint > #output').html(packet);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqChargeStamina > #reqChargeStamina').click(function() {
		var uuid = $('#ReqChargeStamina > #uuid').val();

		var packet = function () {
			this.uuid;
		};

		var send = new packet();
		send.uuid = parseInt(uuid);

		Reqlog(send);

		socket.emit('ReqChargeStamina', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqChargeSkillPoint > #reqChargeSkillPoint').click(function() {
		var uuid = $('#ReqChargeSkillPoint > #uuid').val();

		var packet = function () {
			this.uuid;
		};

		var send = new packet();
		send.uuid = parseInt(uuid);

		Reqlog(send);

		socket.emit('ReqChargeSkillPoint', JSON.stringify(send));
	});
});