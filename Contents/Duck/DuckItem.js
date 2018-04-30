/********************************************************************
Title : DuckItem
Date : 2016.06.01
Update : 2017.04.19
Desc : 테스트 패킷을 관리 - 보유 영웅 장착 아이템
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var LoadGTInventory = require('../../DB/GTLoad/LoadGTInventory.js');

var SetGTInventory = require('../../DB/GTSet/SetGTInventory.js');

var BaseItemRe = require('../../Data/Base/BaseItemRe.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

var moment = require('moment');

(function(exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 아이템 경험치(레벨)
	inst.ReqEquipItemLevel = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet)  {
		logger.debug('UUID : %d, recv - ReqEquipItemLevel -', p_uuid, p_recv);

		var item_level = parseInt(p_recv.item_level);		

		// call update
		mkDB.inst.GetSequelize().query('update GT_EQUIPMENT_ITEMs set ITEM_LEVEL = ? where UUID = ? and EXIST_YN = true;',
			null,
			{ raw : true, type : 'UPDATE' },
			[ item_level, p_uuid ]
		)
		.then(function (p_ret_item_update) {
			// call select
			mkDB.inst.GetSequelize().query('select * from GT_EQUIPMENT_ITEMs where UUID = ? and EXIST_YN = true order by HERO_ID, EQUIP_KIND;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_uuid ]
			)
			.then(function (p_ret_equip_item) {
				if ( Object.keys(p_ret_equip_item).length > 0 ) {
					for ( var cnt in p_ret_equip_item ) {
						var equip_item_info = new PacketCommonData.EquipItem();
						equip_item_info.item_id		= p_ret_equip_item[cnt].ITEM_ID;
						equip_item_info.item_level	= p_ret_equip_item[cnt].ITEM_LEVEL;
						
						p_ack_packet.equip_item_list.push(equip_item_info);
					}

					p_evt_packet.item_level = item_level;
				} else {
					p_ack_packet.equip_item_list= null;
					p_evt_packet.item_level		= 0;
				}

				Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
			})
			.catch(function (p_error) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqEquipItemLevel - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqEquipItemLevel - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 보유 아이템 진화
	inst.ReqEquipItemEvolution = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet) {
		logger.debug('UUID : %d, recv - ReqEquipItemEvolution -', p_uuid, p_recv);

		var evolution_step = parseInt(p_recv.evolution_step);		

		// call update
		mkDB.inst.GetSequelize().query('update GT_EQUIPMENT_ITEMs set EVOLUTION_STEP = ? where UUID = ? and EXIST_YN = true;',
			null,
			{ raw : true, type : 'UPDATE' },
			[ evolution_step, p_uuid ]
		)
		.then(function (p_ret_hero_evolution_update) {
			// GT_EQUIP_ITEM select
			mkDB.inst.GetSequelize().query('select * from GT_EQUIPMENT_ITEMs where UUID = ? and EXIST_YN = true order by HERO_ID, EQUIP_KIND;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_uuid ]
			)
			.then(function (p_ret_hero) {
				if ( Object.keys(p_ret_hero).length > 0 ) {
					for ( var cnt in p_ret_hero ) {
						var equip_item_data = p_ret_hero[cnt];

						var equip_item_info = new PacketCommonData.EquipItem();
						equip_item_info.item_id			= equip_item_data.ITEM_ID;
						equip_item_info.evolution_step	= equip_item_data.EVOLUTION_STEP;
						
						p_ack_packet.equip_item_list.push(equip_item_info);
					}

					p_evt_packet.item_evolution_step = evolution_step;
				} else {
					p_ack_packet.equip_item_list	= null;
					p_evt_packet.item_evolution_step= 0;
				}

				Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
			})
			.catch(function (p_error) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqEquipItemEvolution - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqEquipItemEvolution - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 보유 아이템 승급
	inst.ReqEquipItemReinforce = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet) {
		logger.debug('UUID : %d, recv - ReqEquipItemReinforce -', p_uuid, p_recv);

		var reinforce_step = parseInt(p_recv.promotion_step);		

		// call update
		mkDB.inst.GetSequelize().query('update GT_EQUIPMENT_ITEMs set REINFORCE_STEP = ? where UUID = ? and EXIST_YN = true;',
			null,
			{ raw : true, type : 'UPDATE' },
			[ reinforce_step, p_uuid ]
		)
		.then(function (p_ret_hero_promotion_update) {
			// GT_EQUIP_ITEM select
			mkDB.inst.GetSequelize().query('select * from GT_EQUIPMENT_ITEMs where UUID = ? and CATEGORY1 = ? and EXIST_YN = true order by ITEM_ID;',
				null,
				{ raw : true, type : 'SELECT' },
				[ p_uuid, DefineValues.inst.FirstCategoryEquipment ]
			)
			.then(function (p_ret_item_list) {
				if ( Object.keys(p_ret_item_list).length > 0 ) {
					for ( var cnt in p_ret_item_list ) {
						let item_data = p_ret_item_list[cnt];

						let reinforce = new PacketCommonData.EquipItem();
						reinforce.item_id		= item_data.ITEM_ID;
						reinforce.reinforce_step= item_data.REINFORCE_STEP;
						
						p_ack_packet.equip_item_list.push(reinforce);
					}

					p_evt_packet.item_reinforce_step = reinforce_step;
				} else {
					p_evt_packet.item_reinforce_step = 0;
				}

				Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
			})
			.catch(function (p_error) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqEquipItemReinforce - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqEquipItemReinforce - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var InsertItem = function(p_t, p_uuid, p_item_id, p_item_count) {
		// 장비 아이템 : 갯수 만큼 개별로 새로 만들고
		// 장비 아닌 아이템 : DB에 있으면 update 없으면 insert
		return new Promise(function (resolve, reject) {
			let base_item = BaseItemRe.inst.GetItem(p_item_id);
			if ( typeof base_item === 'undefined' )
				throw ([ PacketRet.inst.retFail(), 'No base item', p_item_id ]);
			
			// console.log('base_item.category1 : %d, status_id : %d, define', base_item.category1, base_item.equip_status_id, DefineValues.inst.FirstCategoryEquipment);
			if ( base_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
				// 장비 아이템
				let promises = [];

				for ( let cnt = 0; cnt < p_item_count; ++ cnt ) {
					let promise = SetGTInventory.inst.InsertEquipment(p_t, p_uuid, base_item.category1, base_item.item_id, base_item.equip_status_id);
					promises.push(promise);
				}

				return Promise.all(promises)
				.then(values => { resolve(values); })
				.catch(p_error => { reject(p_error); });
			} else if ( base_item.category1 == DefineValues.inst.FirstCategoryEquipment ) {
				// 2017.04.19 영웅은 생각 할 필요가 없다.
				// 영웅은 영웅석 아이템을 생성 후 소환을 하면되니까.
				// 만약, 영웅을 만들 필요가 있다면 여기서 하면된다.
				// 하지만 영웅 소환권은 어쩔꺼? 영웅 소환권을 사용할때 영웅이 있으면 영웅석 아이템으로 변경 해주자.

			} else {
				return SetGTInventory.inst.SelectItem(p_t, p_uuid, base_item.item_id)
				.then(p_ret_item => {
					// 장비 
					if ( p_ret_item == null ) {
						// console.log('Insert Item', base_item.item_id, base_item.item_count);
						return SetGTInventory.inst.InsertItem(p_t, p_uuid, base_item.category1, base_item.item_id, p_item_count)
						.then(value => { resolve([ value ]); })
						.catch(p_error => { reject(p_error); });
					} else {
						// GT_INVENTORY update
						return p_ret_item.updateAttributes({ ITEM_COUNT : p_item_count }, { transaction : p_t })
						.then(value => { resolve([ value ]); })
						.catch(p_erro => { reject(p_error); });
					}
				});
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransactionCreateItem = function(p_uuid, p_item_id, p_item_count) {
		return new Promise(function (resolve, reject) {
			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;
				
				return InsertItem(t, p_uuid, p_item_id, p_item_count)
				.then(values => {
					t.commit();
					resolve(values);
				})
				.catch(p_error => {
					if (t)
						t.rollback();
					reject(p_error);
				});
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var MakePacket = function(p_ret_item, p_ack_packet, p_evt_packet) {
		if ( p_ret_item.dataValues.CATEGORY1 == DefineValues.inst.FirstCategoryEquipment ) {
			let equipment = new PacketCommonData.Equipment();

			equipment.iuid		= p_ret_item.IUID;
			equipment.item_id	= p_ret_item.ITEM_ID;

			equipment.sub_option_id_list.push(p_ret_item.SUB_OPTION_ID_1);
			equipment.sub_option_id_list.push(p_ret_item.SUB_OPTION_ID_2);
			equipment.sub_option_id_list.push(p_ret_item.SUB_OPTION_ID_3);
			equipment.sub_option_id_list.push(p_ret_item.SUB_OPTION_ID_4);
			equipment.sub_option_id_list.push(p_ret_item.SUB_OPTION_ID_5);
			equipment.sub_option_id_list.push(p_ret_item.SUB_OPTION_ID_6);

			p_ack_packet.equipment_list.push(equipment);
			p_evt_packet.equipment_list.push(equipment);
		} else {
			let item = new PacketCommonData.Item();
			item.iuid		= p_ret_item.dataValues.IUID;
			item.item_id	= p_ret_item.dataValues.ITEM_ID;
			item.item_count	= p_ret_item.dataValues.ITEM_COUNT;

			p_ack_packet.item_list.push(item);
			p_evt_packet.item_list.push(item);
		}
	}
	
	//------------------------------------------------------------------------------------------------------------------
	// 아이템 생성 - 한종류
	inst.ReqCreateItemOne = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet) {
		logger.debug('UUID : %d, recv - ReqCreateItemOne -', p_uuid, p_recv);

		let recv_item_id = parseInt(p_recv.item_id);
		let recv_item_count = parseInt(p_recv.item_count);

		ProcessTransactionCreateItem(p_uuid, recv_item_id, recv_item_count)
		.then(values => {
			for ( let cnt = 0; cnt < values.length; ++cnt ) {
				let ret_inventory = values[cnt];
				MakePacket(ret_inventory, p_ack_packet, p_evt_packet);
			}

			Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);			
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error[0], p_error[1], p_error[2]);
			else
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var ProcessTransactionCreateItemList = function(p_ret_item_list, p_uuid, p_item_count) {
		return new Promise(function (resolve, reject) {
			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				let t = transaction;

				// Promise.all GO!
				return Promise.all(p_ret_item_list.map(item => {
					return InsertItem(t, p_uuid, item.ITEM_ID, p_item_count);
				}))
				.then(values => {
					t.commit();
					resolve(values);
				})
				.catch(p_error => {
					if (t)
						t.rollback();
					reject(p_error);
				})
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 아이템 생성 - 대분류
	inst.ReqCreateItemCategory = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet) {
		logger.debug('UUID : %d, recv - ReqCreateItemCategory -', p_uuid, p_recv);

		var recv_category1 = parseInt(p_recv.item_category1);
		var recv_item_count = parseInt(p_recv.item_count);

		mkDB.inst.GetSequelize().query('select * from BT_ITEM_BASEs where CATEGORY1 = ? order by ITEM_ID;',
			null,
			{ raw : true, type : 'SELECT' },
			[ recv_category1 ]
		)
		.then(p_ret_item_list => {
			return ProcessTransactionCreateItemList(p_ret_item_list, p_uuid, recv_item_count);
		})
		.then(values => {
			console.log('ReqCreateItemCategory values', values.length);
			let ret_item_group_list = values;

			if ( ret_item_group_list.length == 0 ) {
				p_ack_packet.item_list = null;
				p_evt_packet.item_list = null;
			} else {
				for ( let cnt = 0; cnt < ret_item_group_list.length; ++cnt ) {
					let item_group = ret_item_group_list[cnt];

					for ( let cnt = 0; cnt < item_group.length; ++ cnt ) {
						MakePacket(item_group[cnt], p_ack_packet, p_evt_packet);
					}
				}
			}

			Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
		})
		.catch(p_error => {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 아이템 생성 - 전체
	inst.ReqCreateItemAll = function(p_socket, p_uuid, p_recv, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet) {
		logger.debug('UUID : %d, recv - ReqCreateItemAll - ', p_uuid, p_recv);

		var recv_item_count = parseInt(p_recv.item_count);

		mkDB.inst.GetSequelize().query('select * from BT_ITEM_BASEs order by ITEM_ID;',
			null,
			{ raw : true, type : 'SELECT' },
			[ ]
		)
		.then(p_ret_item_list => {
			return ProcessTransactionCreateItemList(p_ret_item_list, p_uuid, recv_item_count);
		})
		.then(values => {
			console.log('ReqCreateItemCategory values', values.length);
			let ret_item_group_list = values;

			if ( ret_item_group_list.length == 0 ) {
				p_ack_packet.item_list = null;
				p_evt_packet.item_list = null;
			} else {
				for ( let cnt = 0; cnt < ret_item_group_list.length; ++cnt ) {
					let item_group = ret_item_group_list[cnt];

					for ( let cnt = 0; cnt < item_group.length; ++ cnt ) {
						MakePacket(item_group[cnt], p_ack_packet, p_evt_packet);
					}
				}
			}

			Sender.inst.toDuck(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet);
		})
		.catch(p_error => {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}
	
	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;