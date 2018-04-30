/********************************************************************
Title : UseRandomBox
Date : 2016.02.03
Update : 2016.07.22
Desc : 랜덤 박스 사용
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues	= require('../../Common/DefineValues.js');
var BaseItemRe		= require('../../Data/Base/BaseItemRe.js');
var BaseRandomBoxRe	= require('../../Data/Base/BaseRandomBoxRe.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqUseRandomBox = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqUseItem -', p_user.uuid, p_recv);

		var recv_iuid = parseInt(p_recv.iuid);
		var use_count = parseInt(p_recv.use_count);

		if ( use_count <= 0 ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectUseCount());
			return;			
		}

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}

			var user_data = p_ret_user.dataValues;

			// GT_INVENTORY select
			GTMgr.inst.GetGTInventory().find({
				where : { UUID : p_user.uuid, IUID : recv_iuid, EXIST_YN : true }
			})
			.then(function (p_ret_inventory) {
				if ( p_ret_inventory == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Item In GT_INVENTORY');
					return;
				}

				var item_data = p_ret_inventory.dataValues;
				// console.log('item_data', item_data);

				if ( item_data.ITEM_COUNT < use_count ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectUseCount(), 'Use Count', use_count, 'Current Count', item_data.ITEM_COUNT);
					return;		
				}

				var item_base = BaseItemRe.inst.GetItem(item_data.ITEM_ID);
				if ( typeof item_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Item In Base');
					return;
				}

				// RandomBox 카테고리 검사
				if ( item_base.category1 != DefineValues.inst.FirstCategoryConsumption ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Match Item Type cate 1 Need Category', DefineValues.inst.FirstCategoryConsumption, 'Item Category', item_base.category1);
					return;
				}

				if ( item_base.category2 != DefineValues.inst.SecondCategoryRandomBoxByConsumption) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Match Item Type cate 2 Need Category', DefineValues.inst.SecondCategoryRandomBoxByConsumption, 'Item Category', item_base.category2);
					return;			
				}

				var box_ids = undefined;
				for ( var cnt = 0; cnt < use_count; ++cnt ) {
					var random_box_base = BaseRandomBoxRe.inst.GetRandomBoxGroup(item_base.item_id);
					if ( typeof random_box_base === 'undefined' ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Eixst RandomBox In Base RandomBox ID', item_base.item_id);
						return;
					}

					var random_box = random_box_base.SelectBox();
					if ( typeof random_box === 'undefined' ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'RandomBox Select', 'ID', item_base.item_id);
						return;
					}

					box_ids = ( cnt == 0 ) ? random_box.box_id.toString() : box_ids + ',' + random_box.box_id.toString();
				}

				if ( typeof box_ids === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Error Make RandomBox IDs');
					return;
				}

				console.log('RandomBox IDs', box_ids);

				// call ad-hoc query
				mkDB.inst.GetSequelize().query('call sp_insert_randombox(?, ?, ?, ?, ?);',
					null,
					{ raw: true, type: 'SELECT' },
					[ p_user.uuid, item_data.IUID, item_data.ITEM_ID, box_ids, use_count ]
				)
				.then(function (p_ret_use_item) {
					// console.log('p_ret_use_item -', p_ret_use_item);
					// 1. 사용한 랜덤상자 정보
					p_ack_packet.use_item			= new PacketCommonData.Item();
					p_ack_packet.use_item.iuid		= p_ret_use_item[0][0].IUID;
					p_ack_packet.use_item.item_id	= p_ret_use_item[0][0].ITEM_ID;
					p_ack_packet.use_item.item_count= p_ret_use_item[0][0].ITEM_COUNT;

					p_ack_packet.gold			= p_ret_use_item[1][0].GOLD;
					p_ack_packet.cash			= p_ret_use_item[1][0].CASH;
					p_ack_packet.point_honor	= p_ret_use_item[1][0].POINT_HONOR;
					p_ack_packet.point_alliance	= p_ret_use_item[1][0].POINT_ALLIANCE;
					p_ack_packet.point_challenge= p_ret_use_item[1][0].POINT_CHALLENGE;
					
					// 획득 아이템 정보
					// console.log('p_ret_use_item[2]:', Object.keys(p_ret_use_item[2]));
					if (Object.keys(p_ret_use_item[2]).length > 0) {
						for (var cnt in p_ret_use_item[2]) {
							var get_item		= new PacketCommonData.Item();
							get_item.iuid		= p_ret_use_item[2][cnt].IUID;
							get_item.item_id	= p_ret_use_item[2][cnt].ITEM_ID;
							get_item.item_count	= p_ret_use_item[2][cnt].ITEM_COUNT;

							p_ack_packet.get_items.push(get_item);
						}
					} else {
						p_ack_packet.get_items = null;
					}

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());

					if (user_data.GOLD != p_ret_use_item[1][0].GOLD)
						console.log('GOLD', p_ret_use_item[1][0].GOLD);

					if (user_data.CASH != p_ret_use_item[1][0].CASH)
						console.log('CASH', p_ret_use_item[1][0].CASH);

					if (user_data.POINT_HONOR != p_ret_use_item[1][0].POINT_HONOR)
						console.log('POINT_HONOR', p_ret_use_item[1][0].POINT_HONOR);

					if (user_data.POINT_ALLIANCE != p_ret_use_item[1][0].POINT_ALLIANCE)
						console.log('POINT_ALLIANCE', p_ret_use_item[1][0].POINT_ALLIANCE);

					if (user_data.POINT_CHALLENGE != p_ret_use_item[1][0].POINT_CHALLENGE)
						console.log('POINT_CHALLENGE', p_ret_use_item[1][0].POINT_CHALLENGE);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqUseRandomBox - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqUseRandomBox - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqUseRandomBox - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;