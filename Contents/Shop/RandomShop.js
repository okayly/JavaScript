/********************************************************************
Title : RandomShop
Date : 2016.01.18
Update : 2016.08.01
Desc : 상점 - 랜덤 샵
writer: jongwook
********************************************************************/
var GTMgr	= require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseShopRe	= require('../../Data/Base/BaseShopRe.js')

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');
var moment	= require('moment');

(function (exports) {
	// private 변수
	var inst = {};	

	//------------------------------------------------------------------------------------------------------------------
	var IsOpen = function(p_open_time) {
		var close_time = moment(p_open_time).add(1, 'hours');
		return moment().isBefore(close_time);
	}

	//------------------------------------------------------------------------------------------------------------------
	var SendPacketProcess = function(p_user, p_recv, p_ack_cmd, p_ack_packet, p_shop_id, p_unix_time) {
		p_ack_packet.shop_id				= p_shop_id;
		p_ack_packet.random_open_unix_time	= p_unix_time;

		Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());		
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqRandomShopIsOpen = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqRandomShopIsOpen -', p_user.uuid, p_recv);

		// GT_SHOP select - 랜덤 상점 Open, Close 는 DB 기준으로 확인 하자.
		GTMgr.inst.GetGTShop().find({
			where: { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_shop) {
			// 랜덤 상점 닫힌 상태
			if ( p_ret_shop == null ) {
				SendPacketProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, 0, 0);
			} else {
				var shop_data = p_ret_shop.dataValues;

				if ( shop_data.SHOP_RANDOM_ID != 0 && shop_data.RANDOM_SHOP_OPEN_TIME != null ) {
					// 랜덤 상점 열려 있는 상태					
					if ( IsOpen(shop_data.RANDOM_SHOP_OPEN_TIME) ) {
						SendPacketProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, shop_data.SHOP_RANDOM_ID, Timer.inst.GetUnixTime(shop_data.RANDOM_SHOP_OPEN_TIME));
					} else {
						// GT_SHOP update - 닫힐 시간이 지나서 열림->닫힘 으로 변경
						p_ret_shop.updateAttributes({
							SHOP_RANDOM_ID : 0
							, RANDOM_SHOP_OPEN_TIME : null
						})
						.then(function (p_ret_shop_update) {
							SendPacketProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, 0, 0);
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqRandomShopIsOpen - 1');
						});
					}
				} else {
					// 랜덤 상점 닫힌 상태
					SendPacketProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, 0, 0);
				}
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqRandomShopIsOpen - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqRandomShopOpen = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {		
		logger.info('UUID : %d, recv - ReqRandomShopOpen -', p_user.uuid, p_recv);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			// GT_SHOP select
			GTMgr.inst.GetGTShop().find({
				where: { UUID : user_data.UUID, EXIST_YN : true }
			})
			.then(function (p_ret_shop) {
				var now = moment();
				var str_now = now.format('YYYY-MM-DD HH:mm:ss');

				if ( p_ret_shop == null ) {
					// GT_SHOP insert
					GTMgr.inst.GetGTShop().create({
						UUID : user_data.UUID,
						SHOP_RANDOM_ID : BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.RandomShop, 0),
						RANDOM_SHOP_OPEN_TIME : str_now
					})
					.then(function (p_ret_shop_create) {
						// console.log('RandomShopID: %d CloseTime:', p_ret_shop_create.dataValues.SHOP_RANDOM_ID, p_ret_shop_create.dataValues.RANDOM_SHOP_OPEN_TIME);
						var shop_data = p_ret_shop_create.dataValues;

						SendPacketProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, shop_data.SHOP_RANDOM_ID, Timer.inst.GetUnixTime(shop_data.RANDOM_SHOP_OPEN_TIME));
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqRandomShopOpen - 4');
					});
				} else {
					// 이미 랜덤 상점이 열려 있다면
					var shop_data = p_ret_shop.dataValues;

					if ( shop_data.SHOP_RANDOM_ID != 0 && shop_data.RANDOM_SHOP_OPEN_TIME != null && IsOpen(shop_data.RANDOM_SHOP_OPEN_TIME) ) {
						SendPacketProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, shop_data.SHOP_RANDOM_ID, Timer.inst.GetUnixTime(shop_data.RANDOM_SHOP_OPEN_TIME));
					} else {
						// GT_SHOP update
						p_ret_shop.updateAttributes({
							SHOP_RANDOM_ID : BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.RandomShop, 0),
							RANDOM_SHOP_OPEN_TIME : str_now
						})
						.then(function (p_ret_shop_update) {
							// console.log('RandomShopID: %d CloseTime:', p_ret_shop_update.dataValues.SHOP_RANDOM_ID, p_ret_shop_update.dataValues.RANDOM_SHOP_OPEN_TIME);
							shop_data = p_ret_shop_update.dataValues;
							SendPacketProcess(p_user, p_recv, p_ack_cmd, p_ack_packet, shop_data.SHOP_RANDOM_ID, Timer.inst.GetUnixTime(shop_data.RANDOM_SHOP_OPEN_TIME));
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqRandomShopOpen - 3');
						});
					}
				}
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqRandomShopOpen - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqRandomShopOpen - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;