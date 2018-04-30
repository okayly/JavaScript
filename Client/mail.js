var listener = function() {
	socket.on('AckMailReadInfo', function (packet) {
		Acklog('AckMailReadInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckMailList', function (packet) {
		Acklog('AckMailList', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckMailRead', function (packet) {
		Acklog('AckMailRead', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckMailReward', function (packet) {
		Acklog('AckMailReward', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckMailRewardAll', function (packet) {
		Acklog('AckMailRewardAll', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckMailSend', function (packet) {
		Acklog('AckMailSend', packet);
		$('#Display > #output').html(packet);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	$(document).on("keyup", "input:text[numberOnly]", function() {
		$(this).val( $(this).val().replace(/[^0-9]/gi,"") );
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqMailReadInfo > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqMailReadInfo', send);

		socket.emit('ReqMailReadInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqMailList > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.recv_all;
			this.mail_ids = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.recv_all = $('#ReqMailList > #recv_all').val();
		send.mail_ids.push(parseInt($('#ReqMailList > #mail1_id').val()));
		send.mail_ids.push(parseInt($('#ReqMailList > #mail2_id').val()));
		send.mail_ids.push(parseInt($('#ReqMailList > #mail3_id').val()));
		send.mail_ids.push(parseInt($('#ReqMailList > #mail4_id').val()));
		send.mail_ids.push(parseInt($('#ReqMailList > #mail5_id').val()));

		Reqlog('ReqMailList', send);

		socket.emit('ReqMailList', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqMailRead > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.mail_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.mail_id = $('#ReqMailRead > #mail_id').val();

		Reqlog('ReqMailRead', send);

		socket.emit('ReqMailRead', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqMailReward > #send').click(function() {
		packet = function () {
			this.uuid;
			this.mail_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.mail_id = $('#ReqMailReward > #mail_id').val();

		Reqlog('ReqMailReward', send);

		socket.emit('ReqMailReward', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqMailRewardAll > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.mail_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.mail_id = $('#ReqMailRewardAll > #mail_id').val();

		Reqlog('ReqMailRewardAll', send);

		socket.emit('ReqMailRewardAll', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#reqMailSend').click(function() {
		var packet = function () {
			this.packet_srl;
			this.uuid;
			this.sender;
			this.mail_type;
			this.mail_icon_type;
			this.mail_icon_item_id;
			this.mail_icon_count;
			this.subject;
			this.contents;
			this.reward_items = [];	// Item array : max 5
		};

		var RewardItem = function () {
			this.reward_type;
			this.reward_item_id;
			this.reward_count;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		send.uuid = GetNumber($('#uuid').val());
		if (send.uuid == 0) {
			alert('받는 사람 UUID 오류');
			$('#ReqMailSend > #uuid').focus();
			return;
		}

		send.sender = GetNumber($('#sender').val());
		if (send.sender == 0) {
			alert('보내는 사람 UUID 오류');
			$('#ReqMailSend > #sender').focus();
			return;
		}
		send.mail_type = $('input:radio[name=mail_type]:checked').val();
		send.subject = $('#subject').val();
		send.contents = $('#contents').val();

		for (var cnt = 0; cnt < 5; ++cnt) {
			var reward_id = cnt + 1;
			var reward_item = new RewardItem();
			reward_item.reward_type = GetNumber($('#reward_0' + reward_id + '_type').val());
			reward_item.reward_item_id = GetNumber($('#reward_0' + reward_id + '_item_id').val());
			if (reward_item.reward_type == 1 && reward_item.reward_item_id == 0) {
				alert('보상 아이템 ID 오류')
				$('#ReqMailSend > #reward_0' + reward_id + '_item_id').focus();
				return;
			}
			reward_item.reward_count = GetNumber($('#reward_0' + reward_id + '_count').val());
			if (reward_item.reward_type != 0 && reward_item.reward_count == 0) {
				alert('보상 아이템 수 오류')
				$('#ReqMailSend > #reward_0' + reward_id + '_count').focus();
				return;
			}

			send.reward_items.push(reward_item);
		}

		function GetNumber(p_obj, p_msg) { return (p_obj != '') ? parseInt(p_obj) : 0; }

		Reqlog('reqMailSend', send);

		socket.emit('ReqMailSend', JSON.stringify(send));
	});
});