/********************************************************************
Title : EquipItem
Date : 2016.01.05
Update : 2017.04.07
Desc : 장착 아이템
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 장비 정보
	inst.ReqEquipment = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqEquipment -', p_user.uuid, p_recv);
		
		// GT_INVENTORY select
		GTMgr.inst.GetGTInventory().findAll({
			where : { UUID : p_user.uuid, CATEGORY1 : DefineValues.inst.FirstCategoryEquipment, EXIST_YN : true }
		})
		.then(function (p_ret_equip) {
			for ( var cnt in p_ret_equip ) {
				var equipment			= new PacketCommonData.Equipment();

				equipment.iuid			= p_ret_equip[cnt].IUID;
				equipment.item_id		= p_ret_equip[cnt].ITEM_ID;
				equipment.bind_hero_id	= p_ret_equip[cnt].BIND_HERO_ID;
				equipment.item_level	= p_ret_equip[cnt].ITEM_LEVEL;
				equipment.reinforce_step= p_ret_equip[cnt].REINFORCE_STEP;
				equipment.is_lock		= p_ret_equip[cnt].IS_LOCK;

				equipment.sub_option_id_list.push(p_ret_equip[cnt].SUB_OPTION_ID_1);
				equipment.sub_option_id_list.push(p_ret_equip[cnt].SUB_OPTION_ID_2);
				equipment.sub_option_id_list.push(p_ret_equip[cnt].SUB_OPTION_ID_3);
				equipment.sub_option_id_list.push(p_ret_equip[cnt].SUB_OPTION_ID_4);
				equipment.sub_option_id_list.push(p_ret_equip[cnt].SUB_OPTION_ID_5);
				equipment.sub_option_id_list.push(p_ret_equip[cnt].SUB_OPTION_ID_6);

				p_ack_packet.equipment_list.push(equipment);
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqEquipment');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 장비 장착
	inst.ReqEquipItem = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqEquipItem -', p_user.uuid, p_recv);

		var hero_id = parseInt(p_recv.hero_id);
		var equip_set_id = parseInt(p_recv.equip_set_id);
		var iuid_list = p_recv.iuid_list;

		// console.log('Array.isArray(iuid_list)', Array.isArray(iuid_list));
		if ( isNaN(hero_id) || hero_id == 0 || hero_id == '' || Array.isArray(iuid_list) == false ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Error hero_id', hero_id, 'iuid_list', iuid_list);
			return;
		}

		// iuid_list 에 중복된 iuid 가 있는지 확인 하는 로직 필요.

		// 1. 장비 아이템 목록 얻기
		var GetEquipItemList = function() {
			return new Promise(function (resolve, reject) {
				console.log('1. GetEquipItemList');

				// GT_INVENTORY select
				GTMgr.inst.GetGTInventory().findAll({
					where : { UUID : p_user.uuid, IUID : { in : iuid_list }, EXIST_YN : true }
				})
				.then(p_item_list => {
					resolve(p_item_list);
				})
				.catch(p_error => { reject(p_error); });
			});
		}

		// 2. 장비 아이템에 귀속 영웅 ID 설정
		var SetBindHeroID = function(p_equip_item_list) {
			console.log('2. SetBindHeroID');

			// BIND_HERO_ID 검증
			for ( var cnt in p_equip_item_list ) {
				if ( p_equip_item_list[cnt].dataValues.BIND_HERO_ID != 0 && p_equip_item_list[cnt].dataValues.BIND_HERO_ID != hero_id ) {
					throw ([ PacketRet.inst.retIncorrectBindHeroID(), 'Bind Hero ID is wrong' ]);
				}
			}

			return Promise.all(p_equip_item_list.map(function (row) {
				return new Promise(function (resolve, reject) {
					// console.log('row.dataValues.BIND_HERO_ID', row.dataValues.BIND_HERO_ID);
					if ( row.dataValues.BIND_HERO_ID == 0 ) {
						// GT_INVENTORY update
						row.updateAttributes({ BIND_HERO_ID : hero_id })
						.then(p_equip_item => { resolve(p_equip_item); })
						.catch(p_error => { reject(p_error); });
					} else {
						resolve(row);
					}
				});
			}));
		}

		// 3. 영웅의 장비 세트 슬롯 얻기
		var GetEquipment = function() {
			console.log('3. GetEquipment');

			return new Promise(function (resolve, reject) {
				// GT_EQUIPMENT_ITEM select
				GTMgr.inst.GetGTEquipmentItem().find({
					where : { UUID : p_user.uuid, HERO_ID : hero_id, SLOT_ID : equip_set_id, EXIST_YN : true }
				})
				.then(p_equipment => { resolve(p_equipment); })
				.catch(p_error => { reject(p_error); });
			});
		}

		// 4. 영웅의 장비 세트 슬롯 설정
		var SetEquipment = function(p_equipment) {
			console.log('4. SetEquipment');

			return new Promise(function (resolve, reject) {
				if ( p_equipment == null ) {
					console.log('GT_EQUIPMENT_ITEM insert');

					// GT_EQUIPMENT_ITEM insert
					GTMgr.inst.GetGTEquipmentItem().create({
						UUID : p_user.uuid,
						HERO_ID : hero_id,
						SLOT_ID : equip_set_id,
						IUID_1 : iuid_list[0],
						IUID_2 : iuid_list[1],
						IUID_3 : iuid_list[2],
						IUID_4 : iuid_list[3],
						REG_DATE : Timer.inst.GetNowByStrDate()
					})
					.then(p_equipment => { resolve(p_equipment); })
					.catch(p_error => { reject(p_error); });
				} else {
					console.log('GT_EQUIPMENT_ITEM update');
					// GT_EQUIPMENT_ITEM update
					p_equipment.updateAttributes({
						IUID_1 : iuid_list[0],
						IUID_2 : iuid_list[1],
						IUID_3 : iuid_list[2],
						IUID_4 : iuid_list[3]
					})
					.then(p_equipment => { resolve(p_equipment); })
					.catch(p_error => { reject(p_error); });
				}
			});
		}

		var SendPacket = function() {
			console.log('All done! SendPacket');

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		}

		// Promise GO!
		GetEquipItemList()
		.then(p_item_list => { SetBindHeroID(p_item_list); })
		.then(GetEquipment)
		.then(p_equipment => { SetEquipment(p_equipment); })
		.then(SendPacket)
		.catch(p_error => {
			console.log('Promise Error', p_error);

			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 장비 장착 하나
	inst.ReqEquipItemOne = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqEquipItemOne -', p_user.uuid, p_recv);

		var hero_id = parseInt(p_recv.hero_id);
		var equip_set_id = parseInt(p_recv.equip_set_id);
		var equip_slot = p_recv.equip_slot;

		if ( isNaN(hero_id) || hero_id == 0 || hero_id == '' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Error hero_id', hero_id, 'equip_slot', equip_slot);
			return;
		}

		// 1. 장비 아이템 목록 얻기
		var GetEquipItem = function() {
			return new Promise(function (resolve, reject) {
				console.log('1. GetEquipItem');

				// GT_INVENTORY select
				GTMgr.inst.GetGTInventory().find({
					where : { UUID : p_user.uuid, IUID : equip_slot.iuid, EXIST_YN : true }
				})
				.then(p_item => {
					resolve(p_item);
				})
				.catch(p_error => { reject(p_error); });
			});
		}

		// 2. 장비 아이템에 귀속 영웅 ID 설정
		var SetBindHeroID = function(p_item) {
			console.log('2. SetBindHeroID');

			// BIND_HERO_ID 검증
			if ( p_item.dataValues.BIND_HERO_ID != 0 && p_item.dataValues.BIND_HERO_ID != hero_id ) {
				throw ([ PacketRet.inst.retIncorrectBindHeroID(), 'Bind Hero ID is wrong' ]);
			}

			return new Promise(function (resolve, reject) {
				// console.log('p_item.dataValues.BIND_HERO_ID', p_item.dataValues.BIND_HERO_ID);
				if ( p_item.dataValues.BIND_HERO_ID == 0 ) {
					// GT_INVENTORY update
					p_item.updateAttributes({ BIND_HERO_ID : hero_id })
					.then(p_equip_item => { resolve(p_equip_item); })
					.catch(p_error => { reject(p_error); });
				} else {
					resolve(p_item);
				}
			});
		}

		// 3. 영웅의 장비 세트 슬롯 얻기
		var GetEquipment = function() {
			console.log('3. GetEquipment');

			return new Promise(function (resolve, reject) {
				// GT_EQUIPMENT_ITEM select
				GTMgr.inst.GetGTEquipmentItem().find({
					where : { UUID : p_user.uuid, HERO_ID : hero_id, SLOT_ID : equip_set_id, EXIST_YN : true }
				})
				.then(p_equipment => { resolve(p_equipment); })
				.catch(p_error => { reject(p_error); });
			});
		}

		// 4. 영웅의 장비 세트 슬롯 설정
		var SetEquipment = function(p_equipment) {
			console.log('4. SetEquipment');

			return new Promise(function (resolve, reject) {
				if ( p_equipment == null ) {
					console.log('GT_EQUIPMENT_ITEM insert');

					// 장비 슬롯 셋팅
					let iuid_list = [ 0, 0, 0, 0 ];

					if ( equip_slot.slot_id > 0 )
						iuid_list[equip_slot.slot_id - 1] = equip_slot.iuid;

					// GT_EQUIPMENT_ITEM insert
					GTMgr.inst.GetGTEquipmentItem().create({
						UUID : p_user.uuid,
						HERO_ID : hero_id,
						SLOT_ID : equip_set_id,
						IUID_1 : iuid_list[0],
						IUID_2 : iuid_list[1],
						IUID_3 : iuid_list[2],
						IUID_4 : iuid_list[3],
						REG_DATE : Timer.inst.GetNowByStrDate()
					})
					.then(p_equipment => { resolve(p_equipment); })
					.catch(p_error => { reject(p_error); });
				} else {
					// 장비 슬롯 셋팅
					let iuid_list = [ p_equipment.dataValues.IUID_1, p_equipment.dataValues.IUID_2, p_equipment.dataValues.IUID_3, p_equipment.dataValues.IUID_4 ];

					if ( equip_slot.slot_id > 0 )
						iuid_list[equip_slot.slot_id - 1] = equip_slot.iuid;

					console.log('GT_EQUIPMENT_ITEM update');
					// GT_EQUIPMENT_ITEM update
					p_equipment.updateAttributes({
						IUID_1 : iuid_list[0],
						IUID_2 : iuid_list[1],
						IUID_3 : iuid_list[2],
						IUID_4 : iuid_list[3]
					})
					.then(p_equipment => { resolve(p_equipment); })
					.catch(p_error => { reject(p_error); });
				}
			});
		}

		var SendPacket = function() {
			console.log('All done! SendPacket');

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		}

		// Promise GO!
		// 장비 해제
		if ( equip_slot.iuid == 0 ) {
			GetEquipment()
			.then(p_equipment => { SetEquipment(p_equipment); })
			.then(SendPacket)
			.catch(p_error => {
				console.log('Promise Error', p_error);

				if ( Array.isArray(p_error) )
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
				else
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
			});			
		} else {
			// 장비 변경
			GetEquipItem()
			.then(p_item_list => { SetBindHeroID(p_item_list); })
			.then(GetEquipment)
			.then(p_equipment => { SetEquipment(p_equipment); })
			.then(SendPacket)
			.catch(p_error => {
				console.log('Promise Error', p_error);

				if ( Array.isArray(p_error) )
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
				else
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
			});
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;