/********************************************************************
Title : Duck
Date : 2016.03.22
Update : 2017.04.07
Desc : 테스트 패킷을 관리
		클라이언트 메세지
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTUser = require('../../DB/GTLoad/LoadGTUser.js');

var BaseExpRe = require('../../Data/Base/BaseExpRe.js');
var BaseLevelUnlock = require('../../Data/Base/BaseLevelUnlock.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 계정 레벨업 - 레벨 설정하고 경험치 full로 만든다.
	inst.ReqAccountLevelSet = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqAccountLevelSet -', p_user.uuid, p_recv);

		let target_level = parseInt(p_recv.target_level);

		if ( target_level > BaseExpRe.inst.max_account_level )
			target_level = BaseExpRe.inst.max_account_level;

		let base_exp = BaseExpRe.inst.GetAccountExp(target_level);
		if ( typeof base_exp === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find BaseExp', target_level);
			return;
		}

		return new Promise(function (resolve, reject) {
			LoadGTUser.inst.SelectUser(p_user.uuid)
			.then(value => {
				let ret_user = value;

				if ( ret_user == null )
					throw ([ PacketRet.inst.retFail(), 'Not Find User in GT_USER', p_user ]);

				let base_unlock = BaseLevelUnlock.inst.GetLevelUnlock(base_exp.level);
				
				if ( typeof base_unlock === 'undefined' )
					throw ([ PacketRet.inst.retFail(), 'Not Exist LevelUnlock In Base level', levelup.level ]);

				// use account_buff
				let old_level = p_ret_user.dataValues.USER_LEVEL;

				p_ret_user['USER_LEVEL'] = levelup_exp.level;

				// 1. MAX 스테미너 증가
				p_ret_user['MAX_STAMINA'] = base_unlock.max_stamina;
				// p_ret_user['LAST_STAMINA_CHANGE_DATE'] = Timer.inst.GetNowByStrDate();

				// 2. 스테미너 회복
				p_ret_user['STAMINA'] = p_ret_user.dataValues.STAMINA + base_unlock.recovery_stamina;

				// 3. 계정 버프 포인트 계산
				if ( base_unlock.open_accountbuff == true ) {
					let ret_buff_point = ( levelup_exp.level - old_level ) * DefineValues.inst.AccountBuffPoint;

					console.log('ret_buff_point : %d', ret_buff_point);

					p_ret_user['ACCOUNT_BUFF_POINT'] = p_ret_user.dataValues.ACCOUNT_BUFF_POINT + ret_buff_point;
				}
			})
			.catch(p_error => { reject(p_error); });
		});

		// var exp_percent = 99;

		// // GT_USER select
		// GTMgr.inst.GetGTUser().find({
		// 	where : { UUID : p_user.uuid, EXIST_YN : true }
		// })
		// .then(function (p_ret_user) {
		// 	if ( p_ret_user == null ) {
		// 		Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
		// 		return;
		// 	}

		// 	// sp_update_account_level
		// 	mkDB.inst.GetSequelize().query('call sp_duck_update_account_level(?, ?, ?);'
		// 		, null
		// 		, { raw: true, type: 'SELECT' }
		// 		, [ p_user.uuid,
		// 			target_level,
		// 			exp_percent
		// 		]
		// 	)
		// 	.then (function (p_ret_level) {
		// 		// console.log('p_ret_level:', p_ret_level);

		// 		p_ack_packet.uuid			= p_ret_level[0][0].UUID;
		// 		p_ack_packet.account_level	= p_ret_level[0][0].USER_LEV EL;
		// 		p_ack_packet.account_exp	= p_ret_level[0][0].USER_EXP;

		// 		Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		// 	})
		// 	.catch(function (p_error) {
		// 		Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAccountLevelSet - 2');
		// 	});
		// })
		// .catch(function (p_error) {
		// 	Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAccountLevelSet - 1');
		// });
	}

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 레벨업
	inst.ReqHeroLevelSet = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('ReqHeroLevelSet -', p_recv);

		var hero_id = parseInt(p_recv.hero_id);
		var target_level = parseInt(p_recv.target_level);
		var exp_percent = 99;

		// GT_HERO select
		GTMgr.inst.GetGTHero().find({
			where : { UUID : p_user.uuid, HERO_ID : hero_id, EXIST_YN : true }
		})
		.then(function (p_ret_hero) {
			if ( p_ret_hero == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Hero in GT_HERO');
				return;
			}

			// sp_update_account_level
			mkDB.inst.GetSequelize().query('call sp_duck_update_hero_level(?, ?, ?, ?);',
				null,
				{ raw: true, type: 'SELECT' },
				[ p_user.uuid,
					hero_id,
					target_level,
					exp_percent
				]
			)
			.then (function (p_ret_level) {
				console.log('p_ret_level:', p_ret_level);
				if ( Object.keys(p_ret_level[0]).length > 0 ) {
					p_ack_packet.uuid = p_ret_level[0][0].UUID;
					p_ack_packet.hero_level = p_ret_level[0][0].HERO_LEVEL;
					p_ack_packet.hero_exp = p_ret_level[0][0].EXP;

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				} else {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail());
				}
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroLevelSet - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqHeroLevelSet - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// BT_ITEM_BASE 에서 장착 아이템을 제외한 아이템을 모두 1000개씩 inventory에 넣는다.
	inst.ReqMakeInventoryItem = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		var item_count = 1000;

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}

			mkDB.inst.GetSequelize().query('call sp_insert_inventory_all_item(?, ?);',
				null,
				{ raw: true, type: 'SELECT' },
				[ p_user.uuid, item_count ]
			)
			.then(function (p_ret_item) {
				// console.log('p_ret_item', p_ret_item);
				for (var cnt in p_ret_item[0]) {
					console.log('p_ret_item[0][%d]', cnt, p_ret_item[0][cnt]);
					
					var packet_item			= new PacketCommonData.Item();
					packet_item.iuid		= p_ret_item[0][cnt].IUID;
					packet_item.item_id		= p_ret_item[0][cnt].ITEM_ID;
					packet_item.item_count	= p_ret_item[0][cnt].ITEM_COUNT;

					p_ack_packet.item_list.push(packet_item);
				}

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMakeInventoryItem - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqMakeInventoryItem - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 리셋
	inst.ReqInfinityTowerReset = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}

			mkDB.inst.GetSequelize().query('call sp_duck_infinity_tower_reset(?);',
				null,
				{ raw: true, type: 'SELECT' },
				[ p_user.uuid ]
			)
			.then(function (p_ret_reset) {
				// console.log('p_ret_reset', p_ret_reset);
				p_ack_packet.tower_user				= (Object.keys(p_ret_reset[0]).length == 0) ? true : false;
				p_ack_packet.tower_floor			= (Object.keys(p_ret_reset[1]).length == 0) ? true : false;
				p_ack_packet.tower_hero				= (Object.keys(p_ret_reset[2]).length == 0) ? true : false;
				p_ack_packet.tower_battle_bot		= (Object.keys(p_ret_reset[3]).length == 0) ? true : false;
				p_ack_packet.tower_battle_bot_status= (Object.keys(p_ret_reset[4]).length == 0) ? true : false;

				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqInfinityTowerReset - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqInfinityTowerReset - 1');
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;