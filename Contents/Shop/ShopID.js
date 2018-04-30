/********************************************************************
Title : ReqShopID
Date : 2016.01.18
Update : 2016.08.01
Desc : 상점 - 현재 시간 상점 ID 요청
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
	var RandomShopProcess = function (p_user, p_ret_shop, p_ack_cmd, p_ack_packet) {
		// console.log('----------------------- RandomShopProcess -----------------------')
		var shop_data = p_ret_shop.dataValues;

		if ( shop_data.SHOP_RANDOM_ID == 0 ) {
			console.log('SendPacketShopIDs - shop_data.SHOP_RANDOM_ID == 0');
			SendPacketShopIDs(p_user, p_ack_cmd, p_ack_packet, p_ret_shop);
		} else {			
			// 랜덤 상점 Close
			var close_time	= moment(shop_data.RANDOM_SHOP_OPEN_TIME).add(1, 'hours');
			var isAfter		= moment().isAfter(close_time);
			// console.log('moment(): %s, close_time: %s, close_time.isAfter:', Timer.inst.GetNowByStrDate(), Timer.inst.GetStrDate(close_time), isAfter);
			
			if ( isAfter ) {
				console.log('RandomShop open -> close - moment(): %s, close_time: %s', Timer.inst.GetNowByStrDate(), Timer.inst.GetStrDate(close_time));
				// GT_SHOP update
				p_ret_shop.updateAttributes({
					SHOP_RANDOM_ID : 0
					, RANDOM_SHOP_OPEN_TIME : null
				})
				.then(function (p_ret_shop_update) {
					SendPacketShopIDs(p_user, p_ack_cmd, p_ack_packet, p_ret_shop_update);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack);
				});
			} else {
				console.log('RandomShop is open - shop_id:%d, close_time: %s', shop_data.SHOP_RANDOM_ID, Timer.inst.GetStrDate(close_time));
				SendPacketShopIDs(p_user, p_ack_cmd, p_ack_packet, p_ret_shop);
			}
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	var SendPacketShopIDs = function (p_user, p_ack_cmd, p_ack_packet, p_ret_shop) {		
		var shop_data = ( typeof p_ret_shop.dataValues === 'undefined' ) ? p_ret_shop : p_ret_shop.dataValues;
		// console.log('SendPacketShopIDs shop_data', shop_data);
		p_ack_packet.normal_id				= shop_data.SHOP_NORMAL_ID;
		p_ack_packet.pvp_id					= shop_data.SHOP_PVP_ID;
		p_ack_packet.guild_id				= shop_data.SHOP_GUILD_ID;
		p_ack_packet.random_id				= shop_data.SHOP_RANDOM_ID;
		p_ack_packet.challenge_id			= shop_data.SHOP_CHALLENGE_ID;		
		p_ack_packet.random_open_unix_time	= ( shop_data.RANDOM_SHOP_OPEN_TIME != null ) ? Timer.inst.GetUnixTime(shop_data.RANDOM_SHOP_OPEN_TIME) : 0;

		Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
	}

	//------------------------------------------------------------------------------------------------------------------
	// Shop ID 들은 Logon때 정해져 User의 shop data에 로드 된다.
	inst.ReqShopIDs = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqShopIDs -', p_user.uuid, p_recv);

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

			// GT_DAILY_CONTENTS select
			GTMgr.inst.GetGTDailyContents().find({
				where: { UUID : p_user.uuid, EXIST_YN : true }
			})
			.then(function (p_ret_daily_contents) {
				// console.log('p_ret_daily_contents', p_ret_daily_contents.dataValues);
				// 샵 리셋 카운트 설정
				p_ack_packet.reset_count = p_ret_daily_contents.dataValues.SHOP_RESET_COUNT;

				// GT_SHOP select
				GTMgr.inst.GetGTShop().find({
					where: { UUID : p_user.uuid, EXIST_YN : true }
				})
				.then(function (p_ret_shop) {
					// console.log('first find', ( p_ret_shop != null ) ? p_ret_shop.dataValues : p_ret_shop);
					if ( p_ret_shop == null ) {
						// GT_SHOP - insert 일반 상점 설정
						GTMgr.inst.GetGTShop().create({
							  UUID :				p_user.uuid
							, SHOP_NORMAL_ID :		BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.NormalShop, 0)
							, SHOP_PVP_ID :			BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.PvpShop, 0)
							, SHOP_GUILD_ID :		BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.GuildShop, 0)
							, SHOP_CHALLENGE_ID :	BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.ChallengeShop, 0)
							, SHOP_RESET_TIME_ID :	BaseShopRe.inst.GetResetTimeID()
						})
						.then(function (p_ret_shop_create) {
							SendPacketShopIDs(p_user, p_ack_cmd, p_ack_packet, p_ret_shop_create);
						})
						.catch(function (p_error) {
							Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack);
						});
					} else {
						var shop_data = p_ret_shop.dataValues;
						// 샵 리셋 시간 update
						var reset_time_id = BaseShopRe.inst.GetResetTimeID();
						// console.log('!!!!!!!reset_time_id', reset_time_id);

						// 상점 ID 유지
						if ( reset_time_id == shop_data.SHOP_RESET_TIME_ID ) {
							console.log('Keep shop id', shop_data.SHOP_RESET_TIME_ID);
							RandomShopProcess(p_user, p_ret_shop, p_ack_cmd, p_ack_packet);
						} else {
							console.log('reset_time_id: %d != shop_data.SHOP_RESET_TIME_ID: %d', reset_time_id, shop_data.SHOP_RESET_TIME_ID);
							// GT_SHOP update - 상점 ID 모두 Reset
							p_ret_shop.updateAttributes({
								  SHOP_NORMAL_ID	:	BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.NormalShop, p_ret_shop.SHOP_NORMAL_ID)
								, SHOP_PVP_ID		:	BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.PvpShop, p_ret_shop.SHOP_PVP_ID)
								, SHOP_GUILD_ID		:	BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.GuildShop, p_ret_shop.SHOP_GUILD_ID)
								, SHOP_CHALLENGE_ID	:	BaseShopRe.inst.GetShopID(user_data.USER_LEVEL, DefineValues.inst.ChallengeShop, p_ret_shop.SHOP_CHALLENGE_ID)
								, SHOP_RESET_TIME_ID:	reset_time_id
							})
							.then(function (p_ret_shop_update) {
								RandomShopProcess(p_user, p_ret_shop_update, p_ack_cmd, p_ack_packet);
							})
							.catch(function (p_error) {
								Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack);
							});
						}
						// console.log('isNewRecord === false shop.GetResetTimeID() -', shop.GetResetTimeID());
						// console.log('shop normal: %d, pvp: %d, guild: %d, random: %d', shop.GetNormalID(), shop.GetPvpID(), shop.GetGuildID(), shop.GetRandomID());
					}
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopIDs - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopIDs - 2');
			});
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqShopIDs - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;