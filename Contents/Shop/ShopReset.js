/********************************************************************
Title : ShopReset
Date : 2016.01.18
Update : 2016.11.21
Desc : 상점 - 리셋, 리셋 횟수
writer: jongwook
********************************************************************/
var GTMgr	= require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var BaseShopRe	= require('../../Data/Base/BaseShopRe.js')

var Sender	= require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};	

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqShopReset = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqShopReset -', p_user.uuid, p_recv);

		// 샵 타입 설정 - 1:normal, 2:random, 3:pvp, 4:guild, 5:challenge
		var shop_type = parseInt(p_recv.shop_type);
		if ( shop_type == DefineValues.inst.RandomShop ) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotResetRandomShop());
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

			// GT_DAILY_CONTENTS select
			GTMgr.inst.GetGTDailyContents().find({
				where : { UUID : user_data.UUID, EXIST_YN : true }
			})
			.then(function (p_ret_daily) {
				// console.log('p_ret_daily', p_ret_daily.dataValues);
				var reset_count = p_ret_daily.dataValues.SHOP_RESET_COUNT + 1;
				var reset_cost_base = BaseShopRe.inst.GetShopResetCost(reset_count);
				if ( typeof reset_cost_base === 'undefined' ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Rest Cost In Base');
					return;
				}

				if ( user_data.CASH < reset_cost_base.need_cash ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash(), 'Need', reset_cost_base.need_cash, 'Current', user_data.CASH);
					return;
				}

				// GT_DAILY_CONTENTS update
				p_ret_daily.updateAttributes({
					SHOP_RESET_COUNT : reset_count
				})
				.then(function (p_ret_daily_update) {
					console.log('p_ret_daily_update', p_ret_daily_update.dataValues);
					// GT_SHOP select
					GTMgr.inst.GetGTShop().find({
						where : { UUID : p_user.uuid, EXIST_YN : true }
					})
					.then(function (p_ret_shop) {
						if ( p_ret_shop == null ) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Get User Shop Info');
							return;
						}
						var shop_data = p_ret_shop.dataValues;

						var normal_shop_id		= (shop_type == DefineValues.inst.NormalShop)		? BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.NormalShop, shop_data.SHOP_NORMAL_ID)			: shop_data.SHOP_NORMAL_ID;
						var pvp_shop_id			= (shop_type == DefineValues.inst.PvpShop)		? BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.PvpShop, shop_data.SHOP_PVP_ID)				: shop_data.SHOP_PVP_ID;
						var guild_shop_id		= (shop_type == DefineValues.inst.GuildShop)		? BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.GuildShop, shop_data.SHOP_GUILD_ID)			: shop_data.SHOP_GUILD_ID;
						var challenge_shop_id	= (shop_type == DefineValues.inst.ChallengeShop)	? BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.ChallengeShop, shop_data.SHOP_CHALLENGE_ID)	: shop_data.SHOP_CHALLENGE_ID;

						// GT_SHOP update
						p_ret_shop.updateAttributes({
							SHOP_NORMAL_ID		: normal_shop_id,
							SHOP_PVP_ID			: pvp_shop_id,
							SHOP_GUILD_ID		: guild_shop_id,
							SHOP_CHALLENGE_ID	: challenge_shop_id
						})
						.then(function (p_ret_shop_update) {
							logger.info('normal_shop_id: %d, pvp_shop_id: %d, guild_shop_id: %d, challenge_shop_id: %d', normal_shop_id, pvp_shop_id, guild_shop_id, challenge_shop_id);
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopReset - 6');
						});

						// GT_USER update
						p_ret_user.updateAttributes({
							CASH : user_data.CASH - reset_cost_base.need_cash
						})
						.then(function(p_ret_update_user) {
							switch (shop_type) {
								case DefineValues.inst.NormalShop		: p_ack_packet.shop_id = normal_shop_id;	break;
								case DefineValues.inst.PvpShop		: p_ack_packet.shop_id = pvp_shop_id;		break;
								case DefineValues.inst.GuildShop		: p_ack_packet.shop_id = guild_shop_id;		break;
								case DefineValues.inst.ChallengeShop	: p_ack_packet.shop_id = challenge_shop_id;	break;
							}
							p_ack_packet.cash		= p_ret_update_user.dataValues.CASH;
							p_ack_packet.reset_count= p_ret_daily_update.dataValues.SHOP_RESET_COUNT;

							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopReset - 5');
						});
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopReset - 4');
					});
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopReset - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopReset - 2');
			});
		})
		.catch(function (p_error){
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopReset - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqShopResetCount = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqShopResetCount -', p_user.uuid, p_recv);

		// GT_DAILY_CONTENTS select - 샵 타입 설정 - 1:normal, 2:random, 3:pvp, 4:guild, 5:challenge
		GTMgr.inst.GetGTDailyContents().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_daily) {
			if ( p_ret_daily == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Daily in GT_DAILY_CONTENTS');
				return;
			}
			var daily_data = p_ret_daily.dataValues;

			p_ack_packet.reset_count = daily_data.SHOP_RESET_COUNT;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;