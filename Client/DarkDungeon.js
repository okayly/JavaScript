var listener = function() {
	socket.on('AckDarkDungeon', function (packet) {
		Acklog('AckDarkDungeon', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckDarkDungeonCreate', function (packet) {
		Acklog('AckDarkDungeonCreate', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckDarkDungeonChapter', function (packet) {
		Acklog('AckDarkDungeonChapter', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckDarkDungeonBattleStart', function (packet) {
		Acklog('AckDarkDungeonBattleStart', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckDarkDungeonBattleFinish', function (packet) {
		Acklog('AckDarkDungeonBattleFinish', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckDarkDungeonChapterReset', function (packet) {
		Acklog('AckDarkDungeonChapterReset', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckDarkDungeonReward', function (packet) {
		Acklog('AckDarkDungeonReward', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckDarkDungeonNextStage', function (packet) {
		Acklog('AckDarkDungeonNextStage', packet);
		$('#Display > #output').html(packet);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqDarkDungeon > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqDarkDungeon', send);

		socket.emit('ReqDarkDungeon', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqDarkDungeonCreate > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.chapter_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.chapter_id = parseInt($('#ReqDarkDungeonCreate > #chapter_id').val());

		Reqlog('ReqDarkDungeonCreate', send);

		socket.emit('ReqDarkDungeonCreate', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqDarkDungeonChapter > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.chapter_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.chapter_id = parseInt($('#ReqDarkDungeonChapter > #chapter_id').val());

		Reqlog('ReqDarkDungeonChapter', send);

		socket.emit('ReqDarkDungeonChapter', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqDarkDungeonBattleStart > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.stage_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.stage_id = parseInt($('#ReqDarkDungeonBattleStart > #stage_id').val());

		Reqlog('ReqDarkDungeonBattleStart', send);

		socket.emit('ReqDarkDungeonBattleStart', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqDarkDungeonBattleFinish > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.stage_id;
			this.clear_grade;
			this.hero_id_list = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.stage_id = parseInt($('#ReqDarkDungeonBattleFinish > #stage_id').val());
		send.clear_grade = parseInt($('#ReqDarkDungeonBattleFinish > #clear_grade').val());

		for ( var slot = 1; slot <= 4; ++slot ) {
			var hero_id = parseInt($('#ReqDarkDungeonBattleFinish > #hero_id_' + slot).val());
			if ( hero_id == undefined )
				hero_id = 0;

			send.hero_id_list.push(hero_id);
		}

		Reqlog('ReqDarkDungeonBattleFinish', send);

		socket.emit('ReqDarkDungeonBattleFinish', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqDarkDungeonChapterReset > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.chapter_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.chapter_id = parseInt($('#ReqDarkDungeonChapterReset > #chapter_id').val());

		Reqlog('ReqDarkDungeonChapterReset', send);

		socket.emit('ReqDarkDungeonChapterReset', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqDarkDungeonReward > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.chapter_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.chapter_id = parseInt($('#ReqDarkDungeonReward > #chapter_id').val());

		Reqlog('ReqDarkDungeonReward', send);

		socket.emit('ReqDarkDungeonReward', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqDarkDungeonNextStage > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.chapter_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.chapter_id = parseInt($('#ReqDarkDungeonNextStage > #chapter_id').val());

		Reqlog('ReqDarkDungeonNextStage', send);

		socket.emit('ReqDarkDungeonNextStage', JSON.stringify(send));
	});
});