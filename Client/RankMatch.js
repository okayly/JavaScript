var listener = function() {
	socket.on('AckPvpInfo', function (recv) {
		Acklog('AckPvpInfo', recv);
		$('#Display > #output').html(recv);
	});
	socket.on('AckPvpInfoUpdate', function (recv) {
		Acklog('AckPvpInfoUpdate', recv);
		$('#Display > #output').html(recv);
	});
	socket.on('AckFindMatchPlayer', function (recv) {
		Acklog('AckFindMatchPlayer', recv);
		$('#Display > #output').html(recv);
	});
	socket.on('AckPvpStart', function (recv) {
		Acklog('AckPvpStart', recv);
		$('#Display > #output').html(recv);
	});
	socket.on('AckPvpFinish', function (recv) {
		Acklog('AckPvpFinish', recv);
		$('#Display > #output').html(recv);
	});
	socket.on('AckPvpAchievementReward', function (recv) {
		Acklog('AckPvpAchievementReward', recv);
		$('#Display > #output').html(recv);
	});
	socket.on('AckPvpLeagueRankList', function (recv) {
		Acklog('AckPvpLeagueRankList', recv);
		$('#Display > #output').html(recv);
	});
	socket.on('AckPvpGroupRankList', function (recv) {
		Acklog('AckPvpGroupRankList', recv);
		$('#Display > #output').html(recv);
	});
	socket.on('AckPvpRecord', function (recv) {
		Acklog('AckPvpRecord', recv);
		$('#Display > #output').html(recv);
	});
	// socket.on('AckInitMatchRemainTime', function (recv) {
	// 	Acklog('AckInitMatchRemainTime', recv);
	// 	$('#Display > #output').html(recv);
	// });
	// socket.on('AckRankList', function (recv) {
	// 	Acklog('AckRankList', recv);
	// 	$('#Display > #output').html(recv);
	// });
	// socket.on('AckRankMatchRecord', function (recv) {
	// 	Acklog('AckRankMatchRecord', recv);
	// 	$('#Display > #output').html(recv);
	// });
	// socket.on('AckRankMatchRecordDetailInfo', function (recv) {
	// 	Acklog('AckRankMatchRecordDetailInfo', recv);
	// 	$('#Display > #output').html(recv);
	// });
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqPvpInfo > #send').click(function () {
		var packet = function() {
			this.packet_srl;
		}

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqPvpInfo', JSON.stringify(send));
		socket.emit('ReqPvpInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqPvpInfoUpdate > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.except_uuid_list = [];
		}
		var send = new packet();
		send.packet_srl = global_packet_srl++;

		let except_uuid_1 = $('#ReqPvpInfoUpdate > #except_uuid_1').val();
		let except_uuid_2 = $('#ReqPvpInfoUpdate > #except_uuid_2').val();
		let except_uuid_3 = $('#ReqPvpInfoUpdate > #except_uuid_3').val();

		send.except_uuid_list.push(except_uuid_1);
		send.except_uuid_list.push(except_uuid_2);
		send.except_uuid_list.push(except_uuid_3);

		Reqlog('ReqPvpInfoUpdate', JSON.stringify(send));
		socket.emit('ReqPvpInfoUpdate', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqFindMatchPlayer > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.except_uuid_list = [];
		}
		var send = new packet();
		send.packet_srl = global_packet_srl++;

		let except_uuid_1 = $('#ReqFindMatchPlayer > #except_uuid_1').val();
		let except_uuid_2 = $('#ReqFindMatchPlayer > #except_uuid_2').val();
		let except_uuid_3 = $('#ReqFindMatchPlayer > #except_uuid_3').val();

		send.except_uuid_list.push(except_uuid_1);
		send.except_uuid_list.push(except_uuid_2);
		send.except_uuid_list.push(except_uuid_3);

		Reqlog('ReqFindMatchPlayer', JSON.stringify(send));
		socket.emit('ReqFindMatchPlayer', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqPvpStart > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.target_uuid;
		}
		var send = new packet();
		send.packet_srl = global_packet_srl++;

		send.target_uuid = $('#ReqPvpStart > #target_uuid').val();

		Reqlog('ReqPvpStart', JSON.stringify(send));
		socket.emit('ReqPvpStart', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqPvpFinish > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.target_uuid;
			this.battle_result;
		}
		var send = new packet();
		send.packet_srl = global_packet_srl++;

		send.target_uuid = $('#ReqPvpFinish > #target_uuid').val();
		send.battle_result = $('#ReqPvpFinish > #battle_result').val();

		Reqlog('ReqPvpFinish', JSON.stringify(send));
		socket.emit('ReqPvpFinish', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqPvpAchievementReward > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.league_id;
		}
		var send = new packet();
		send.packet_srl = global_packet_srl++;

		send.league_id = $('#ReqPvpAchievementReward > #league_id').val();

		Reqlog('ReqPvpAchievementReward', JSON.stringify(send));
		socket.emit('ReqPvpAchievementReward', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqPvpLeagueRankList > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.league_id;
		}
		var send = new packet();
		send.packet_srl = global_packet_srl++;

		send.league_id = $('#ReqPvpLeagueRankList > #league_id').val();

		Reqlog('ReqPvpLeagueRankList', JSON.stringify(send));
		socket.emit('ReqPvpLeagueRankList', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqPvpGroupRankList > #send').click(function () {
		var packet = function() {
			this.packet_srl;
			this.page_num;
			this.league_id;
			this.group_id;
		}
		
		var send = new packet();
		send.packet_srl = global_packet_srl++;

		send.page_num = $('#ReqPvpGroupRankList > #page_num').val();
		send.league_id = $('#ReqPvpGroupRankList > #league_id').val();
		send.group_id = $('#ReqPvpGroupRankList > #group_id').val();

		Reqlog('ReqPvpGroupRankList', JSON.stringify(send));
		socket.emit('ReqPvpGroupRankList', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqPvpRecord > #send').click(function () {
		var packet = function() {
			this.packet_srl;
		}
		
		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqPvpRecord', JSON.stringify(send));
		socket.emit('ReqPvpRecord', JSON.stringify(send));
	});

	// //------------------------------------------------------------------------------------------------------------------
	// $('#ReqInitMatchRemainTime > #send').click(function () {
	// 	var packet = function() {
	// 		this.packet_srl;
	// 	}
		
	// 	var send = new packet();
	// 	send.packet_srl = global_packet_srl++;

	// 	Reqlog('ReqInitMatchRemainTime', JSON.stringify(send));
	// 	socket.emit('ReqInitMatchRemainTime', JSON.stringify(send));
	// });

	// //------------------------------------------------------------------------------------------------------------------
	// $('#ReqRankList > #send').click(function () {
	// 	var packet = function() {
	// 		this.packet_srl;
	// 		this.page_num;
	// 	}
	// 	var send = new packet();
	// 	send.packet_srl = global_packet_srl++;
	// 	send.page_num = $('#ReqRankList > #page_num').val();

	// 	Reqlog('ReqRankList', JSON.stringify(send));
	// 	socket.emit('ReqRankList', JSON.stringify(send));
	// });

	// //------------------------------------------------------------------------------------------------------------------
	// $('#ReqRankMatchRecord > #send').click(function () {
	// 	var packet = function() {
	// 		this.packet_srl;
	// 	}
		
	// 	var send = new packet();
	// 	send.packet_srl = global_packet_srl++;

	// 	Reqlog('ReqRankMatchRecord', JSON.stringify(send));
	// 	socket.emit('ReqRankMatchRecord', JSON.stringify(send));
	// });

	// //------------------------------------------------------------------------------------------------------------------
	// $('#ReqRankMatchRecordDetailInfo > #send').click(function () {
	// 	var packet = function() {
	// 		this.packet_srl;
	// 		this.battle_date;
	// 	}
	// 	var send = new packet();
	// 	send.packet_srl = global_packet_srl++;
	// 	send.battle_date = $('#ReqRankMatchRecordDetailInfo > #battle_date').val();

	// 	Reqlog('ReqRankMatchRecordDetailInfo', JSON.stringify(send));
	// 	socket.emit('ReqRankMatchRecordDetailInfo', JSON.stringify(send));
	// });
});