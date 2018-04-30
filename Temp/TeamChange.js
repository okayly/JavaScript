/********************************************************************
Title : Team
Date : 2015.09.24
Update : 2016.08.01
Desc : 팀 변경
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var DefineValues = require('../../Common/DefineValues.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqChangeTeam = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {		
		logger.info('UUID : %d, recv - ReqChangeTeam -', p_user.uuid, p_recv);

		var recv_mode			= parseInt(p_recv.game_mode);
		var recv_base_hero_list	= p_recv.slot_hero_ids;
		var recv_tag_hero_list	= p_recv.tag_slot_hero_ids;

		var check_count = 0;
		for ( var temp_count = 0; temp_count < DefineValues.inst.MaxBaseTeamSlotCount(); temp_count++ ) {
			if (recv_base_hero_list[temp_count] != 0) {
				check_count++;
			}
		}

		console.log('ReqChangeTeam check_count', check_count);

		// if ( check_count >= DefineValues.inst.MaxBaseTeamSlotCount() ) {
		// 	Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Full Set Team Slot');
		// 	return;
		// }

		// 슬롯의 영웅이 테그에 등록 될 순 없다. 
		// var hero_slot = new HashMap();
		// for ( var hc = 0; hc < DefineValues.inst.MaxBaseTeamSlotCount(); hc++ ) {
		// 	if (recv_base_hero_list[hc] != 0) {
		// 		if ( hero_slot.search(recv_base_hero_list[hc]) == null ) {
		// 			hero_slot.set(hc, recv_base_hero_list[hc]);
		// 		} else {
		// 			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Exist Same Hero');
		// 			return;
		// 		}	
		// 	} else {
		// 		hero_slot.set(hc, recv_base_hero_list[hc]);
		// 	}
		// }

		// var tag_hero_slot = new HashMap();
		// for ( var thc = 0; thc < DefineValues.inst.MaxTagTeamSlotCount(); thc++ ) {
		// 	if (recv_tag_hero_list[thc] != 0) {
		// 		if ( hero_slot.search(recv_tag_hero_list[thc]) == null && tag_hero_slot.search(recv_tag_hero_list[thc]) == null ) {
		// 			tag_hero_slot.set(thc, recv_tag_hero_list[thc]);
		// 		} else {
		// 			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Exist Same Hero');
		// 			return;
		// 		}	
		// 	} else {
		// 		tag_hero_slot.set(thc, recv_tag_hero_list[thc]);
		// 	}
		// }

		// GT_TEAM select
		GTMgr.inst.GetGTTeam().find({
			where: { UUID: p_user.uuid, GAME_MODE : recv_mode, EXIST_YN : true }
		})
		.then(function (p_ret_team) {
			if (p_ret_team) {
				// GT_TEAM update
				p_ret_team.updateAttributes({
					SLOT1 : (recv_base_hero_list[0] == undefined) ? 0 : recv_base_hero_list[0],
					SLOT2 : (recv_base_hero_list[1] == undefined) ? 0 : recv_base_hero_list[1],
					SLOT3 : (recv_base_hero_list[2] == undefined) ? 0 : recv_base_hero_list[2],
					SLOT4 : (recv_base_hero_list[3] == undefined) ? 0 : recv_base_hero_list[3],
					SLOT5 : (recv_base_hero_list[4] == undefined) ? 0 : recv_base_hero_list[4],
					SLOT6 : (recv_base_hero_list[5] == undefined) ? 0 : recv_base_hero_list[5],

					TAG_SLOT1 : (recv_tag_hero_list == null || recv_tag_hero_list[0] == undefined) ? 0 : recv_tag_hero_list[0],
					TAG_SLOT2 : (recv_tag_hero_list == null || recv_tag_hero_list[1] == undefined) ? 0 : recv_tag_hero_list[1],
					TAG_SLOT3 : (recv_tag_hero_list == null || recv_tag_hero_list[2] == undefined) ? 0 : recv_tag_hero_list[2],
				})
				.then(function (p_ret_team_update) {
					p_ack_packet.game_mode = p_ret_team_update.GAME_MODE;
					p_ack_packet.slot_hero_ids.push(p_ret_team_update.SLOT1);
					p_ack_packet.slot_hero_ids.push(p_ret_team_update.SLOT2);
					p_ack_packet.slot_hero_ids.push(p_ret_team_update.SLOT3);
					p_ack_packet.slot_hero_ids.push(p_ret_team_update.SLOT4);
					p_ack_packet.slot_hero_ids.push(p_ret_team_update.SLOT5);
					p_ack_packet.slot_hero_ids.push(p_ret_team_update.SLOT6);

					p_ack_packet.tag_slot_hero_ids.push(p_ret_team_update.TAG_SLOT1);
					p_ack_packet.tag_slot_hero_ids.push(p_ret_team_update.TAG_SLOT2);
					p_ack_packet.tag_slot_hero_ids.push(p_ret_team_update.TAG_SLOT3);

					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqChangeTeam - 2');
				});	
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqChangeTeam - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqChangeBattlePower = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqChangeBattlePower -', p_user.uuid, p_recv);

		if ( p_recv.team_battle_power_list.length == 0 ) {
			logger.error('team_battle_power none', p_recv.team_battle_power_list);
			return;
		}

		var game_mode_list = [];
		for ( var cnt in p_recv.team_battle_power_list ) {
			game_mode_list.push(p_recv.team_battle_power_list[cnt].game_mode);
		}

		// GT_TEAM select
		GTMgr.inst.GetGTTeam().findAll({
			where: { UUID: p_user.uuid, EXIST_YN: true, GAME_MODE: game_mode_list }
		})
		.then(function (p_ret_team) {
			for ( var cnt_team in p_ret_team ) {
				// GT_TEAM update
				if ( p_recv.team_battle_power_list[cnt_team].battle_power == NaN || p_recv.team_battle_power_list[cnt_team].battle_power == undefined ) {
					logger.error('Worng battle_power', p_recv.team_battle_power_list[cnt_team].battle_power);
					continue;
				}

				// GT_TEAM update
				p_ret_team[cnt_team].updateAttributes({
					BATTLE_POWER: p_recv.team_battle_power_list[cnt_team].battle_power
				})
				.then(function (p_ret_team_update) {
					logger.info('Change BattlePower', p_ret_team_update.dataValues.GAME_MODE, p_ret_team_update.BATTLE_POWER);
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'ReqChangeBattlePower - 2 cnt', cnt_team);
				});
			}
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'ReqChangeBattlePower - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;