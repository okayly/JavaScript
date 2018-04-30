// var listener = function() {
// 	socket.on('AckChangeTeam', function (recv) {
// 		Acklog('AckChangeTeam', recv);
// 		$('#ReqChangeTeam > #output').html(recv);
// 	});
// }

// $(document).ready(function () {
// 	global_listener.push(listener);

// 	// //------------------------------------------------------------------------------------------------------------------
// 	// $('#ReqChangeTeam > #reqChangeTeam').click(function () {

// 	// 	var game_mode = $('#ReqChangeTeam > #game_mode').val();
// 	// 	var slot01 = $('#ReqChangeTeam > #slot01').val();
// 	// 	var slot02 = $('#ReqChangeTeam > #slot02').val();
// 	// 	var slot03 = $('#ReqChangeTeam > #slot03').val();
// 	// 	var slot04 = $('#ReqChangeTeam > #slot04').val();
// 	// 	var slot05 = $('#ReqChangeTeam > #slot05').val();
// 	// 	var slot06 = $('#ReqChangeTeam > #slot06').val();
// 	// 	var slot07 = $('#ReqChangeTeam > #slot07').val();
// 	// 	var slot08 = $('#ReqChangeTeam > #slot08').val();

// 	// 	var packet = function() {
// 	// 		this.packet_srl;
// 	// 		this.game_mode;
// 	// 		this.hero_ids = [];
// 	// 	};

// 	// 	var json = new packet();
// 	// 	json.packet_srl = global_packet_srl++;
// 	// 	json.game_mode = parseInt(game_mode);
// 	// 	json.hero_ids[0] = parseInt(slot01);
// 	// 	json.hero_ids[1] = parseInt(slot02);
// 	// 	json.hero_ids[2] = parseInt(slot03);
// 	// 	json.hero_ids[3] = parseInt(slot04);
// 	// 	json.hero_ids[4] = parseInt(slot05);
// 	// 	json.hero_ids[5] = parseInt(slot06);
// 	// 	json.hero_ids[6] = parseInt(slot07);
// 	// 	json.hero_ids[7] = parseInt(slot08);
	
// 	// 	socket.emit('ReqChangeTeam', JSON.stringify(json));
// 	// 	Reqlog('ReqChangeTeam', json);
// 	// });
// });