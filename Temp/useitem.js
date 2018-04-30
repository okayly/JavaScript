/********************************************************************
Title : UseItem
Date : 2016.02.03
Update : 2017.04.07
Desc : 아이템 사용
writer: jongwook
********************************************************************/
var GTMgr	= require('../../DB/GTMgr.js');

var DefineValues= require('../../Common/DefineValues.js');
var BaseItemRe	= require('../../Data/Base/BaseItemRe.js');

var PacketCommonData= require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');
var moment	= require('moment');

(function (exports) {
	// private 변수
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	inst.ReqUseItem = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqUseItem -', p_user.uuid, p_recv);

		var recv_iuid = parseInt(p_recv.iuid);

		// GT_INVENTORY select
		GTMgr.inst.GetGTInventory().find({
			where : { UUID : p_user.uuid, IUID : recv_iuid, EXIST_YN : true }
		})
		.then(function (p_ret_inventory) {
			if ( p_ret_inventory == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_INVENTORY');
				return;
			}
			var item_data = p_ret_inventory.dataValues;

			var ret_item_count = item_data.ITEM_COUNT - 1;
			if ( ret_item_count < 0 ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retIncorrectUseCount(), 'IUID', recv_iuid, 'Use ItemID', item_data.ITEM_ID);
				return;
			}

			var item_base = BaseItemRe.inst.GetItem(item_data.ITEM_ID);
			if ( typeof item_base === 'undefined' ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Item In Base');
				return;
			}

			// Category1 확인 - 소비(1)
			if ( item_base.category1 != DefineValues.inst.FirstCategoryConsumption ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Match Item Type cate 1 Need Category', DefineValues.inst.FirstCategoryConsumption, 'Item Category', item_base.category1);
				return;
			}

			// Category2 확인 - 재화아이템(5)
			if ( item_base.category2 != DefineValues.inst.SecondCategoryMoneyByConsumption ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Match Item Type cate 2 Need Category', DefineValues.inst.SecondCategoryMoneyByConsumption, 'Item Category', item_base.category2);
				return;
			}			

			p_ret_inventory['ITEM_COUNT'] = ret_item_count;
			p_ret_inventory['EXIST_YN'] = (ret_item_count > 0) ? true : false;

			// GT_INVENTORY update
			p_ret_inventory.save()
			.then(function (p_ret_inventory_update) {
				// Packet
				p_ack_packet.use_item			= new PacketCommonData.Item();
				p_ack_packet.use_item.iuid		= p_ret_inventory_update.IUID;
				p_ack_packet.use_item.item_id	= p_ret_inventory_update.ITEM_ID;
				p_ack_packet.use_item.item_count= p_ret_inventory_update.ITEM_COUNT;

				// GT_USER select
				GTMgr.inst.GetGTUser().find({
					where : { UUID : p_user.uuid, EXIST_YN : true }
				})
				.then(function (p_ret_user) {
					if ( p_ret_user == null ) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In GT_USER');
						return;
					}

					var user_data = p_ret_user.dataValues;
					var ret_remain_time = 0;

					switch ( item_base.effect1_id ) {
						case DefineValues.inst.GoldReward :
							p_ret_user['GOLD'] = user_data.GOLD + item_base.effect1_value1;
							break;

						case DefineValues.inst.CashReward :
							p_ret_user['CASH'] = user_data.CASH + item_base.effect1_value1;
							break;

						case DefineValues.inst.HonorPointReward :
							p_ret_user['POINT_HONOR'] = user_data.POINT_HONOR + item_base.effect1_value1;
							break;

						case DefineValues.inst.AlliancePointReward :
							p_ret_user['POINT_ALLIANCE'] = user_data.POINT_ALLIANCE + item_base.effect1_value1;
							break;

						case DefineValues.inst.ChallengePointReward :
							p_ret_user['POINT_CHALLENGE'] = user_data.POINT_CHALLENGE + item_base.effect1_value1;
							break;

						case DefineValues.inst.StaminaReward : {
								var ret_stamina = user_data.STAMINA + item_base.effect1_value1;
								// 스태미너 남은 시간 계산 - TODO : 이거 뺄수 있지 않을까?
								var now_date = moment();
								var diff_sec = (user_data.LAST_STAMINA_CHANGE_DATE != null) ? Timer.inst.GetDeltaTimeByBetweenDate(now_date, user_data.LAST_STAMINA_CHANGE_DATE) : 0;
								// Max 까지 남은 시간 계산.
								ret_remain_time = Timer.inst.CalcRemainTime(DefineValues.inst.StaminaRecoverTime, ret_stamina, user_data.MAX_STAMINA, diff_sec);

								p_ret_user['STAMINA'] = ret_stamina;
							}
							break;

						default:
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Match Item Effect');
							return;
					}

					// GT_USER update
					p_ret_user.save()
					.then(function (p_ret_update) {
						p_ack_packet.gold				= p_ret_update.dataValues.GOLD;
						p_ack_packet.cash				= p_ret_update.dataValues.CASH;
						p_ack_packet.point_honor		= p_ret_update.dataValues.POINT_HONOR;
						p_ack_packet.point_alliance		= p_ret_update.dataValues.POINT_ALLIANCE;
						p_ack_packet.point_challenge	= p_ret_update.dataValues.POINT_CHALLENGE;
						p_ack_packet.stamina			= p_ret_update.dataValues.STAMINA;
						p_ack_packet.stamina_remain_time= ret_remain_time;

						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqUseItem - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqUseItem - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqUseItem - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqUseItem - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;