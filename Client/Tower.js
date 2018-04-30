var listener = function() {
	socket.on('AckInfinityTowerUser', function (packet) {
		Acklog('AckInfinityTowerUser', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerHero', function (packet) {
		Acklog('AckInfinityTowerHero', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerBot', function (packet) {
		Acklog('AckInfinityTowerBot', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerClear', function (packet) {
		Acklog('AckInfinityTowerClear', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerProcess', function (packet) {
		Acklog('AckInfinityTowerProcess', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerScoreRankList', function (packet) {
		Acklog('AckInfinityTowerScoreRankList', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerRankerDetailInfo', function (packet) {
		Acklog('AckInfinityTowerRankerDetailInfo', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerBattleFloorEntrance', function (packet) {
		Acklog('AckInfinityTowerBattleFloorEntrance', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerBattleSelect', function (packet) {
		Acklog('AckInfinityTowerBattleSelect', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerBattleFinish', function (packet) {
		Acklog('AckInfinityTowerBattleFinish', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerBuffList', function (packet) {
		Acklog('AckInfinityTowerBuffList', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerBuyBuff', function (packet) {
		Acklog('AckInfinityTowerBuyBuff', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerRewardBox', function (packet) {
		Acklog('AckInfinityTowerRewardBox', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerCashRewardBox', function (packet) {
		Acklog('AckInfinityTowerCashRewardBox', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerSecretMazeType', function (packet) {
		Acklog('AckInfinityTowerSecretMazeType', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerSecretMazeReset', function (packet) {
		Acklog('AckInfinityTowerSecretMazeReset', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerSecretMazeEntrance', function (packet) {
		Acklog('AckInfinityTowerSecretMazeEntrance', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerAccumScoreReward', function (packet) {
		Acklog('AckInfinityTowerAccumScoreReward', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerBattleSkip', function (packet) {
		Acklog('AckInfinityTowerBattleSkip', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerBattleAllSkip', function (packet) {
		Acklog('AckInfinityTowerBattleAllSkip', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerSecretAccumScoreReward', function (packet) {
		Acklog('AckInfinityTowerSecretAccumScoreReward', packet);
		$('#Display > #output').html(packet);
	});

	socket.on('AckInfinityTowerAllClear', function (packet) {
		Acklog('AckInfinityTowerAllClear', packet);
		$('#Display > #output').html(packet);
	});
}
$(document).ready(function () {
	global_listener.push(listener);

	$('#ReqInfinityTowerBattleFloorEntrance > #floor').change(function () {
		$('#ReqInfinityTowerBattleSelect > #floor').val(this.value);
		$('#ReqInfinityTowerBattleFinish > #floor').val(this.value);
	});

	$('#ReqInfinityTowerBattleFloorEntrance > #battle_type').change(function () {
		$('#ReqInfinityTowerBattleSelect > #battle_type').val(this.value);
		$('#ReqInfinityTowerBattleFinish > #battle_type').val(this.value);
	});

	$('#ReqInfinityTowerBuffList > #floor').change(function () {
		$('#ReqInfinityTowerBuyBuff > #floor').val(this.value);
	});

	$('#ReqInfinityTowerRewardBox > #floor').change(function () {
		$('#ReqInfinityTowerCashRewardBox > #floor').val(this.value);
	});

	$('#ReqInfinityTowerSecretMazeType > #floor').change(function () {
		$('#ReqInfinityTowerSecretMazeReset > #floor').val(this.value);
		$('#ReqInfinityTowerSecretMazeEntrance > #floor').val(this.value);
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerUser > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqInfinityTowerUser', send);

		socket.emit('ReqInfinityTowerUser', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerHero > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqInfinityTowerHero', send);

		socket.emit('ReqInfinityTowerHero', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerBot > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqInfinityTowerBot', send);

		socket.emit('ReqInfinityTowerBot', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerClear > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqInfinityTowerClear', send);

		socket.emit('ReqInfinityTowerClear', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerProcess > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;

		Reqlog('ReqInfinityTowerProcess', send);

		socket.emit('ReqInfinityTowerProcess', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerScoreRankList > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.page_num;
		};
		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.page_num = $('#ReqInfinityTowerScoreRankList > #page_num').val();

		Reqlog('ReqInfinityTowerScoreRankList', send);
		socket.emit('ReqInfinityTowerScoreRankList', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerRankerDetailInfo > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.uuid;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.uuid = $('#ReqInfinityTowerRankerDetailInfo > #uuid').val();

		Reqlog('ReqInfinityTowerRankerDetailInfo', send);
		socket.emit('ReqInfinityTowerRankerDetailInfo', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerBattleFloorEntrance > #send').click(function() {
		var BattleBot = function () {
			this.icon_id;
			this.bot_name;
			this.bot_rank;
		}

		var packet = function () {
			this.packet_srl;
			this.floor;
			this.battle_type;
			this.battle_bot_list = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.floor = $('#ReqInfinityTowerBattleFloorEntrance > #floor').val();
		send.battle_type = $('#ReqInfinityTowerBattleFloorEntrance > #battle_type').val();

		var icon_id_list = [1, 2, 3, 4];
		var bot_name_list = ['100', '200', '300', '400'];
		var bot_rank_list = [10, 11, 12, 13];

		for (var cnt = 0; cnt < icon_id_list.length; ++cnt) {
			var battle_bot = new BattleBot();
			battle_bot.icon_id = icon_id_list[cnt];
			battle_bot.bot_name = bot_name_list[cnt];
			battle_bot.bot_rank = bot_rank_list[cnt];

			send.battle_bot_list.push(battle_bot);
		}
		
		Reqlog('ReqInfinityTowerBattleFloorEntrance', send);

		socket.emit('ReqInfinityTowerBattleFloorEntrance', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerBattleSelect > #send').click(function() {
		var BattleBot = function() {
			this.hero_id;
			this.hero_hp;
			this.hero_level;
			this.promotion_step;
			this.evolution_step;
			this.slot_num;
		}

		var packet = function () {
			this.packet_srl;
			this.floor;
			this.battle_type;
			this.battle_bot_hero_list = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.floor = $('#ReqInfinityTowerBattleSelect > #floor').val();
		send.battle_type = $('#ReqInfinityTowerBattleSelect > #battle_type').val();

		var bot_id_list = [1, 2, 3, 4];
		var bot_hp_list = [100, 100, 100];
		var bot_level_list = [1, 2, 3, 4];
		var bot_promotion_step_list = [1, 2, 3, 4];
		var bot_evolution_step_list = [1, 2, 3, 4];
		var bot_slot_num_list = [1, 2, 3, 4];

		for (var cnt = 0; cnt < bot_id_list.length; ++cnt) {
			var battle_bot = new BattleBot();
			battle_bot.hero_id = bot_id_list[cnt];
			battle_bot.hero_hp = bot_hp_list[cnt];
			battle_bot.hero_level = bot_level_list[cnt];
			battle_bot.promotion_step = bot_promotion_step_list[cnt];
			battle_bot.evolution_step = bot_evolution_step_list[cnt];
			battle_bot.slot_num = bot_slot_num_list[cnt];

			send.battle_bot_hero_list.push(battle_bot);			
		}
		
		Reqlog('ReqInfinityTowerBattleSelect', send);

		socket.emit('ReqInfinityTowerBattleSelect', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerBattleFinish > #send').click(function() {
		var TowerHero = function () {
			this.hero_id;
			this.hero_hp;
		}

		var BattleBot = function() {
			this.hero_id;
			this.hero_hp;
			this.hero_level;
			this.promotion_step;
			this.evolution_step;
			this.slot_num;
		}

		var packet = function () {
			this.packet_srl;
			this.floor;
			this.clear_grade;
			this.battle_type;
			this.hero_list = [];
			this.battle_bot_hero_list = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.floor = $('#ReqInfinityTowerBattleFinish > #floor').val();
		send.battle_type = $('#ReqInfinityTowerBattleFinish > #battle_type').val();
		send.clear_grade = $('#ReqInfinityTowerBattleFinish > #clear_grade').val();

		var hero_id_list = [3, 6, 23, 25];
		var hero_hp_list = [100, 101, 102, 103];

		for (var cnt = 0; cnt < hero_id_list.length; ++cnt) {
			var tower_hero = new TowerHero();
			tower_hero.hero_id = hero_id_list[cnt];
			tower_hero.hero_hp = hero_hp_list[cnt];			

			send.hero_list.push(tower_hero);
		}

		var bot_id_list = [5, 6, 7, 8];
		var bot_hp_list = [100, 100, 100, 100];
		var bot_level_list = [5, 6, 7, 8];
		var bot_promotion_step_list = [5, 6, 7, 8];
		var bot_evolution_step_list = [5, 6, 7, 8];
		var bot_slot_num_list = [5, 6, 7, 8];

		// for (var cnt = 0; cnt < bot_id_list.length; ++cnt) {
		// 	var battle_bot = new BattleBot();
		// 	battle_bot.hero_id = bot_id_list[cnt];
		// 	battle_bot.hero_hp = bot_hp_list[cnt];
		// 	battle_bot.hero_level = bot_level_list[cnt];
		// 	battle_bot.promotion_step = bot_promotion_step_list[cnt];
		// 	battle_bot.evolution_step = bot_evolution_step_list[cnt];
		// 	battle_bot.slot_num = bot_slot_num_list[cnt];

		// 	send.battle_bot_hero_list.push(battle_bot);
		// }

		send.battle_bot_hero_list = null;

		Reqlog('ReqInfinityTowerBattleFinish', send);

		socket.emit('ReqInfinityTowerBattleFinish', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerBuffList > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.floor;
			this.buff_id_list = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.floor = $('#ReqInfinityTowerBuffList > #floor').val();
		send.buff_id_list = [Math.floor(Math.random() * (64)) + 18, Math.floor(Math.random() * (64)) + 18, Math.floor(Math.random() * (64)) + 18];

		Reqlog('ReqInfinityTowerBuffList', send);

		socket.emit('ReqInfinityTowerBuffList', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerBuyBuff > #send').click(function() {
		var TowerHero = function () {
			this.hero_id;
			this.hero_hp;
			// this.hero_skill_gauge;
		}

		var packet = function () {
			this.packet_srl;
			this.floor;
			this.slot_id;
			this.buff_id;
			this.recovery_hero_list = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.floor = $('#ReqInfinityTowerBuyBuff > #floor').val();
		send.slot_id = $('#ReqInfinityTowerBuyBuff > #slot_id').val();
		send.buff_id = $('#ReqInfinityTowerBuyBuff > #buff_id').val();

		var hero_id_list = [3, 6, 23];
		var hero_hp_list = [200, 200, 200];
		// var hero_skill_gauge_list = [10, 20, 30];

		for (var cnt = 0; cnt < hero_id_list.length; ++cnt) {
			var tower_hero = new TowerHero();
			tower_hero.hero_id = hero_id_list[cnt];
			tower_hero.hero_hp = hero_hp_list[cnt];
			// tower_hero.hero_skill_gauge = hero_skill_gauge_list[cnt];

			send.recovery_hero_list.push(tower_hero);
		}

		Reqlog('ReqInfinityTowerBuyBuff', send);

		socket.emit('ReqInfinityTowerBuyBuff', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerRewardBox > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.floor;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.floor = $('#ReqInfinityTowerRewardBox > #floor').val();

		Reqlog('ReqInfinityTowerRewardBox', send);

		socket.emit('ReqInfinityTowerRewardBox', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerCashRewardBox > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.floor;
			this.buy_count;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.floor = $('#ReqInfinityTowerCashRewardBox > #floor').val();
		// send.buy_count = $('#ReqInfinityTowerCashRewardBox > #buy_count').val();

		Reqlog('ReqInfinityTowerCashRewardBox', send);

		socket.emit('ReqInfinityTowerCashRewardBox', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerSecretMazeType > #send').click(function() {
		var BattleBot = function () {
			this.icon_id;
			this.bot_name;
			this.bot_rank;
		}

		var packet = function () {
			this.packet_srl;
			this.floor;
			this.secret_maze_type;
			this.secret_maze_battle_id;
			this.battle_bot_list = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.floor = $('#ReqInfinityTowerSecretMazeType > #floor').val();
		send.secret_maze_type = $('#ReqInfinityTowerSecretMazeType > #secret_maze_type').val();
		send.secret_maze_battle_id = $('#ReqInfinityTowerSecretMazeType > #secret_maze_battle_id').val();
		 
		var icon_id_list = [1, 2, 3, 4];
		var bot_name_list = ['100', '200', '300', '400'];
		var bot_rank_list = [10, 11, 12, 13];

		for (var cnt = 0; cnt < icon_id_list.length; ++cnt) {
			var battle_bot = new BattleBot();
			battle_bot.icon_id = icon_id_list[cnt];
			battle_bot.bot_name = bot_name_list[cnt];
			battle_bot.bot_rank = bot_rank_list[cnt];

			send.battle_bot_list.push(battle_bot);
		}

		Reqlog('ReqInfinityTowerSecretMazeType', send);

		socket.emit('ReqInfinityTowerSecretMazeType', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerSecretMazeReset > #send').click(function() {
		var BattleBot = function () {
			this.icon_id;
			this.bot_name;
			this.bot_rank;
		}

		var packet = function () {
			this.packet_srl;
			this.floor;
			this.secret_maze_type;
			this.secret_maze_battle_id;
			this.battle_bot_list = [];
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.floor = $('#ReqInfinityTowerSecretMazeReset > #floor').val();
		send.secret_maze_type = $('#ReqInfinityTowerSecretMazeReset > #secret_maze_type').val();
		send.secret_maze_battle_id = $('#ReqInfinityTowerSecretMazeReset > #secret_maze_battle_id').val();
		 
		// var icon_id_list = [1, 2, 3, 4, 5];
		// var bot_name_list = ['100', '200', '300', '400', '500'];
		// var bot_rank_list = [10, 11, 12, 13, 14];

		// for (var cnt = 0; cnt < icon_id_list.length; ++cnt) {
		// 	var battle_bot = new BattleBot();
		// 	battle_bot.icon_id = icon_id_list[cnt];
		// 	battle_bot.bot_name = bot_name_list[cnt];
		// 	battle_bot.bot_rank = bot_rank_list[cnt];

		// 	send.battle_bot_list.push(battle_bot);
		// }

		Reqlog('ReqInfinityTowerSecretMazeReset', send);

		socket.emit('ReqInfinityTowerSecretMazeReset', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerSecretMazeEntrance > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.floor;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.floor = $('#ReqInfinityTowerSecretMazeEntrance > #floor').val();

		Reqlog('ReqInfinityTowerSecretMazeEntrance', send);

		socket.emit('ReqInfinityTowerSecretMazeEntrance', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerBattleSkip > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.floor;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.floor = $('#ReqInfinityTowerBattleSkip > #floor').val();

		Reqlog('ReqInfinityTowerBattleSkip', send);

		socket.emit('ReqInfinityTowerBattleSkip', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerBattleAllSkip > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.start_floor;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.start_floor = $('#ReqInfinityTowerBattleAllSkip > #start_floor').val();
		Reqlog('ReqInfinityTowerBattleAllSkip', send);

		socket.emit('ReqInfinityTowerBattleAllSkip', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerAccumScoreReward > #send').click(function() {
		var packet = function () {
			this.packet_srl;
			this.reward_id;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		send.reward_id = $('#ReqInfinityTowerAccumScoreReward > #reward_id').val();
		Reqlog('ReqInfinityTowerAccumScoreReward', send);

		socket.emit('ReqInfinityTowerAccumScoreReward', JSON.stringify(send));
	});

	//------------------------------------------------------------------------------------------------------------------
	$('#ReqInfinityTowerAllClear > #send').click(function() {
		var packet = function () {
			this.packet_srl;
		};

		var send = new packet();
		send.packet_srl = global_packet_srl++;
		Reqlog('ReqInfinityTowerAllClear', send);

		socket.emit('ReqInfinityTowerAllClear', JSON.stringify(send));
	});
});