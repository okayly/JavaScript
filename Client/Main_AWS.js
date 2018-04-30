var socket = undefined;
var global_packet_srl = 0;
var global_listener = [];

function Reqlog(p_cmd, p_packet) {
	console.log(p_cmd, JSON.stringify(p_packet));
}

function Acklog(p_cmd, p_packet) {
	console.log(p_cmd, p_packet);
}

function Connect(p_port) {
	if ( typeof socket != 'undefined' )
		socket.disconnect();

	console.log('port', p_port);
	socket = io.connect('http://52.78.25.165:' + p_port, { 'forceNew' : true });
	// socket = io.connect('http://192.168.0.29:' + p_port, { 'forceNew' : true });

	socket.on('connect', function() {
		console.log('connected server...');
	});

	socket.on('disconnect', function(recv) {
		console.log('disconnect server...', recv);
	});

	socket.on('RecvError', function(recv) {
		console.log(recv);
	});

	socket.on('evt_notice', function(recv) {
		console.log(recv);
	});

	//------------------------------------------------------------------------------------------------------------------
	// 로그인을 main에 설정
	socket.on('AckLogon', function(recv_packet) {
		Acklog('AckLogon', recv_packet);

		var recv = JSON.parse(recv_packet);
		$('#uuid, div').val(recv.uuid);

		// ReqUser
		var send_packet = function() { 
			this.uuid;
			this.packet_srl;
		}
		var send = new send_packet();
		send.uuid = recv.uuid;
		send.packet_srl = global_packet_srl++;

		socket.emit('ReqUser', JSON.stringify(send));
	});

	socket.on('AckTest', function (p_recv_packet) {
		Acklog('AckTest', p_recv_packet);
		$('#test > #output').html(p_recv_packet);
	});

	socket.on('AckVersion', function(packet) {
		Acklog('AckVersion', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckUser', function(packet) {
		Acklog('AckUser', packet);
		$('#Display > #output').html(packet);
	});

	// 컨텐츠 js의 socket listener 호출
	for ( var cnt = 0; cnt < global_listener.length; ++cnt ) {
		console.log('cnt', cnt);
		global_listener[cnt]();
	}
}

function Disconnect() {
	if (typeof socket != 'undefined')
		socket.disconnect();
}

$(document).ready(function() {
	// Design 서버에 로그인
	Connect(7953);

	//------------------------------------------------------------------------------------------------------------------
	$('#ConnectServer > #connect').click(function() {
		var port = $('#ConnectServer > #port').val();
		Connect(port);
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ConnectServer > #disconnect').click(function() {
		Disconnect();
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqTest > #send').click(function () {
		var packet = function() {
			this.temp;
		};

		var send = new packet();
		send.temp = $('#ReqTest > #temp').val();;

		socket.emit('ReqTest', JSON.stringify(send));
	});	

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqVersion > #send').click(function() {
		var packet = function() {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqVersion', send);

		socket.emit('ReqVersion', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqLogon > #send').click(function() {
		var packet = function() {
			this.account;
			this.packet_srl;
		}
		var send = new packet();
		send.packet_srl = global_packet_srl++;

		send.account = $('#ReqLogon > #account').val();
		Reqlog('ReqLogon', send);

		socket.emit('ReqLogon', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqUser > #send').click(function() {
		var packet = function() {
			this.packet_srl;
			this.uuid;
		}
		var send = new packet();
		send.packet_srl = global_packet_srl++;

		send.uuid = $('#ReqUser > #uuid').val();
		Reqlog('ReqUser', send);

		socket.emit('ReqUser', JSON.stringify(send));
	});
});