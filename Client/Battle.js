var listener = function() {	
	socket.on('AckBattleStart', function (packet) { 
		Acklog('AckBattleStart', packet);
		$('#Display > #output').html(packet);
	});
	socket.on('AckBattleFinish', function (packet) { 
		Acklog('AckBattleFinish', packet);
		$('#Display > #output').html(packet);
	});
	socket.on('AckBattleSweep', function (packet) { 
		Acklog('AckBattleSweep', packet);
		$('#Display > #output').html(packet);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqBattleStart > #send').click(function () {
		var ReqBattleStart = function() {
			this.packet_srl;
			this.chapter_id;
			this.stage_id;
		}
		var send = new ReqBattleStart();
		send.packet_srl = global_packet_srl++;
		send.chapter_id = $('#ReqBattleStart > #chapter_id').val();
		send.stage_id = $('#ReqBattleStart > #stage_id').val();

		socket.emit('ReqBattleStart', JSON.stringify(send));
		Reqlog('ReqBattleStart', send);
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqBattleFinish > #send').click(function () {
		var ReqBattleFinish = function() {
			this.packet_srl;
			this.clear_grade;
		};

		var send = new ReqBattleFinish();
		send.packet_srl = global_packet_srl++;
		send.clear_grade = $('#ReqBattleFinish > #clear_grade').val();
		
		socket.emit('ReqBattleFinish', JSON.stringify(send));
		Reqlog('ReqBattleFinish', send);
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqBattleSweep > #send').click(function () {
		var ReqBattleSweep = function() {
			this.packet_srl;
			this.chapter_id;
			this.stage_id;
			this.sweep_count;
		};

		var send = new ReqBattleSweep();
		send.packet_srl = global_packet_srl++;
		send.chapter_id = $('#ReqBattleSweep > #chapter_id').val();
		send.stage_id = $('#ReqBattleSweep > #stage_id').val();
		send.sweep_count = $('#ReqBattleSweep > #sweep_count').val();
		
		socket.emit('ReqBattleSweep', JSON.stringify(send));
		Reqlog('ReqBattleSweep', send);
	});
});