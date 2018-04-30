var listener = function() {
	socket.on('AckSummonInfo', function (packet) {
		Acklog('AckSummonInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckSummonGage', function (packet) {
		Acklog('AckSummonGage', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckSummonOpen', function (packet) {
		Acklog('AckSummonOpen', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckSummonUse', function (packet) {
		Acklog('AckSummonUse', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckSummonLevelup', function (packet) {
		Acklog('AckSummonLevelup', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckSummonLevelupCash', function (packet) {
		Acklog('AckSummonLevelupCash', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckSummonTraitLevelup', function (packet) {
		Acklog('AckSummonTraitLevelup', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckSummonTraitLevelupCash', function (packet) {
		Acklog('AckSummonTraitLevelupCash', packet);
		$('#Display > #output').html(packet);
	});
}

$(document).ready(function () {
	global_listener.push(listener);

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqSummonInfo > #send').click(function() {
		var uuid = $('#ReqSummonInfo > #uuid').val();

		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqSummonInfo', send);

		socket.emit('ReqSummonInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqSummonGage > #send').click(function() {
		var uuid = $('#ReqSummonGage > #uuid').val();

		var packet = function () {
			this.packet_srl;
			this.battle_clear;
			this.use_summon;
		};
		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.battle_clear = $('#ReqSummonGage > #battle_clear').val();
		send.use_summon = $('#ReqSummonGage > #use_summon').val();

		Reqlog('ReqSummonGage', send);

		socket.emit('ReqSummonGage', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqSummonOpen > #send').click(function() {
		var uuid = $('#ReqSummonOpen > #uuid').val();

		var packet = function () {
			this.packet_srl;
			this.summon_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.summon_id = parseInt($('#ReqSummonOpen > #summon_id').val());

		Reqlog('ReqSummonOpen', send);

		socket.emit('ReqSummonOpen', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqSummonUse > #send').click(function() {
		var uuid = $('#ReqSummonUse > #uuid').val();

		var packet = function () {
			this.packet_srl;
			this.summon_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.summon_id = parseInt($('#ReqSummonUse > #summon_id').val());

		Reqlog('ReqSummonUse', send);

		socket.emit('ReqSummonUse', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqSummonLevelup > #send').click(function() {
		var uuid = $('#ReqSummonLevelup > #uuid').val();

		var packet = function () {
			this.packet_srl;
			this.summon_id;
			this.resource_iuids = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.summon_id = parseInt($('#ReqSummonLevelup > #summon_id').val());
		Reqlog('ReqSummonLevelup', send);

		socket.emit('ReqSummonLevelup', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqSummonLevelupCash > #send').click(function() {
		var uuid = $('#ReqSummonLevelupCash > #uuid').val();

		var packet = function () {
			this.packet_srl;
			this.summon_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.summon_id = parseInt($('#ReqSummonLevelupCash > #summon_id').val());
		Reqlog('ReqSummonLevelupCash', send);

		socket.emit('ReqSummonLevelupCash', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqSummonTraitLevelup > #send').click(function() {
		var uuid = $('#ReqSummonTraitLevelup > #uuid').val();

		var Item = function () {
			this.iuid;
			this.item_id;
			this.item_count;
		}

		var packet = function () {
			this.packet_srl;
			this.summon_id;
			this.trait_skill_id;
			this.use_items = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.summon_id = parseInt($('#ReqSummonTraitLevelup > #summon_id').val());
		send.trait_skill_id = parseInt($('#ReqSummonTraitLevelup > #trait_skill_id').val());

		var iuids = [9, 12, 15, 19, 20, 21];
		var item_ids = [1030002, 3020004, 1030001, 3020003, 1020001, 1021001];
		
		for (var cnt in iuids) {
			var item = new Item();
			item.iuid = iuids[cnt];
			item.item_id = item_ids[cnt];
			item.item_count = Math.floor(Math.random() * (30 - 1 + 1)) + 1;
			// item.item_count = 1;

			send.use_items.push(item);
		}

		Reqlog('ReqSummonTraitLevelup', send);

		socket.emit('ReqSummonTraitLevelup', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqSummonTraitLevelupCash > #send').click(function() {
		var uuid = $('#ReqSummonTraitLevelupCash > #uuid').val();

		var Item = function () {
			this.iuid;
			this.item_id;
			this.item_count;
		}

		var packet = function () {
			this.packet_srl;
			this.summon_id;
			this.trait_skill_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.summon_id = parseInt($('#ReqSummonTraitLevelupCash > #summon_id').val());
		send.trait_skill_id = parseInt($('#ReqSummonTraitLevelupCash > #trait_skill_id').val());

		Reqlog('ReqSummonTraitLevelupCash', send);

		socket.emit('ReqSummonTraitLevelupCash', JSON.stringify(send));
	});
});