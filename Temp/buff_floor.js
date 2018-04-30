/********************************************************************
Title : TowerBuffFloor
Date : 2016.04.01
Update : 2017.03.15
Desc : 무한탑 버프 층 - 버프 목록, 구매
writer: jongwook
********************************************************************/
var GTMgr	= require('../../DB/GTMgr.js');
var TowerMgr= require('./TowerMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseTower = require('../../Data/Base/BaseTower.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

var moment = require('moment');

(function (exports) {
	// private 변수
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 버프 저장
	inst.ReqTowerBuffList = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqTowerBuffList', p_user.uuid, p_recv);

		var floor = parseInt(p_recv.floor);
		var recv_buff_list = p_recv.buff_id_list;		

		var tower_base = BaseTower.inst.GetTowerFloor(floor);
		if ( typeof tower_base === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', floor);
			return;
		}

		// GT_INFINITY_TOWER_FLOOR select
		GTMgr.inst.GetGTInfinityTowerFloor().find({
			where : { UUID : p_user.uuid, FLOOR: floor, EXIST_YN : true }
		})
		.then(function (p_ret_floor) {
			var str_now = Timer.inst.GetNowByStrDate();

			// console.log('p_ret_floor:', p_ret_floor);
			if ( p_ret_floor == null ) {
				// GT_INFINITY_TOWER_FLOOR insert
				GTMgr.inst.GetGTInfinityTowerFloor().create({
					UUID		: p_user.uuid,
					FLOOR		: floor,
					FLOOR_TYPE	: tower_base.floor_type,
					BUFF_ID_1	: ( typeof recv_buff_list[0] !== 'undefined' ) ? parseInt(recv_buff_list[0]) : 0,
					BUFF_ID_2	: ( typeof recv_buff_list[1] !== 'undefined' ) ? parseInt(recv_buff_list[1]) : 0,
					BUFF_ID_3	: ( typeof recv_buff_list[2] !== 'undefined' ) ? parseInt(recv_buff_list[2]) : 0,
					UPDATE_DATE	: str_now,
					REG_DATE	: str_now
				})
				.then(function (p_ret_floor_create) {
					console.log('UUID : %d, Create Battle Floor', p_user.uuid, p_ret_floor_create.dataValues.FLOOR);

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

					// 시간 갱신
					TowerMgr.inst.UpdateTowerUser(p_user, floor);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBuffList - 3');
				});
			} else {
				p_ret_floor.updateAttributes({
					FLOOR		: floor,
					BUFF_ID_1	: ( typeof recv_buff_list[0] !== 'undefined' ) ? recv_buff_list[0] : 0,
					BUFF_ID_2	: ( typeof recv_buff_list[1] !== 'undefined' ) ? recv_buff_list[1] : 0,
					BUFF_ID_3	: ( typeof recv_buff_list[2] !== 'undefined' ) ? recv_buff_list[2] : 0,
					UPDATE_DATE	: str_now
				})
				.then(function (p_ret_floor_update) {
					console.log('UUID : %d, Update Battle Floor', p_user.uuid, p_ret_floor_update.dataValues.FLOOR);

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					
					// 시간 갱신
					TowerMgr.inst.UpdateTowerUser(p_user, floor);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBuffList - 2');
				});
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTowerBuffList - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 무한탑 버프 구매 : 강적 배틀, 버프 상점, 비밀미로 회복샘 같이 써보자
	inst.ReqBuyTowerBuff = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqBuyTowerBuff', p_user.uuid, p_recv);

		var floor	= parseInt(p_recv.floor);
		var recv_slot_id	= parseInt(p_recv.slot_id);
		var buff_id	= parseInt(p_recv.buff_id);

		var tower_base = BaseTower.inst.GetTowerFloor(floor);
		if ( typeof tower_base === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower In Base Floor', floor);
			return;
		}

		if ( tower_base.floor_type == DefineValues.inst.InfinityTowerRewardBoxFloor ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotMatchTowerFloorType(), 'Floor', floor, 'Floor Type', tower_base.floor_type);
			return;
		}

		var buff_list = BaseTower.inst.GetBuffList(buff_id);
		if ( typeof buff_list === 'undefined' ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Buff Info In Base Buff ID', buff_id);
			return;
		}

		// GT_INFINITY_TOWER_USER select
		GTMgr.inst.GetGTInfinityTowerUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_tower_user) {
			// console.log('p_ret_tower_user', p_ret_tower_user.dataValues);
			if ( p_ret_tower_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Tower User In GT_INFINITY_TOWER_USER Floor', floor);
				return;
			}
			var user_data = p_ret_tower_user.dataValues;			

			// 티켓 검사
			if ( user_data.TODAY_TICKET < buff_list.need_ticket ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughTowerTicket(), 'Need Ticket', buff_list.need_ticket, 'Current Ticket', user_data.TODAY_TICKET);
				return;
			}

			var str_now = Timer.inst.GetNowByStrDate();

			// GT_INFINITY_TOWER_USER update
			p_ret_tower_user.updateAttributes({
				TODAY_TICKET: user_data.TODAY_TICKET - buff_list.need_ticket,
				UPDATE_DATE	: str_now
			})
			.then(function (p_ret_ticket) {
				// GT_INFINITY_TOWER_FLOOR select - 구매 버프 정보
				GTMgr.inst.GetGTInfinityTowerFloor().find({
					where : { UUID : p_user.uuid, FLOOR: floor, EXIST_YN : true }
				})
				.then(function (p_ret_floor) {
					// console.log('p_ret_floor:', p_ret_floor);
					if ( p_ret_floor == null ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Floor In GT_INFINITY_TOWER_FLOOR Floor', floor);
						return;
					}
					var floor_data = p_ret_floor.dataValues;

					// 비밀미로 버프 구매는 한번 밖에 할 수 없다.
					if ( tower_base.floor_type == DefineValues.inst.InfinityTowerSecretMazeFloor &&
						(floor_data.BUY_BUFF_ID_1 != 0 || floor_data.BUY_BUFF_ID_2 != 0 || floor_data.BUY_BUFF_ID_3 != 0)) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retAlreadyTowerBuyBuff(), 'Floor', floor, 'Buff ID', buff_id);
						return;
					}

					// GT_INFINITY_TOWER_FLOOR update
					p_ret_floor.updateAttributes({
						FLOOR			: floor,
						FLOOR_TYPE		: tower_base.floor_type,
						BUY_BUFF_ID_1	: ( recv_slot_id == 1 ) ? floor_data.BUFF_ID_1 : floor_data.BUY_BUFF_ID_1,
						BUY_BUFF_ID_2	: ( recv_slot_id == 2 ) ? floor_data.BUFF_ID_2 : floor_data.BUY_BUFF_ID_2,
						BUY_BUFF_ID_3	: ( recv_slot_id == 3 ) ? floor_data.BUFF_ID_3 : floor_data.BUY_BUFF_ID_3,
						UPDATE_DATE		: str_now
					})
					.then(function (p_ret_floor_update) {
						// console.log('p_ret_floor.updateAttributes', floor);
						p_ack_packet.ticket	= p_ret_ticket.TODAY_TICKET;
						p_ack_packet.slot_id= recv_slot_id;

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

						// 비밀미로의 회복샘으로 HP를 회복한 영웅 저장
						if ( p_recv.recovery_hero_list.length >  0) {
							console.log('recovery_hero_list', p_recv.recovery_hero_list);
							TowerMgr.inst.SaveTowerHero(p_user.uuid, p_recv.recovery_hero_list);
						}
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyTowerBuff - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyTowerBuff - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyTowerBuff - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqBuyTowerBuff - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;