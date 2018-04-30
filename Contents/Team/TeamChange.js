/********************************************************************
Title : Team
Date : 2015.09.24
Update : 2017.04.03
Desc : 팀 변경
writer: dongsu
********************************************************************/
var mkDB 		= require('../../DB/mkDB.js');
var GTMgr		= require('../../DB/GTMgr.js');

var LoadHero 	= require('../../DB/GTLoad/LoadGTHero.js');

var Sender 		= require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	var InsertTeam = function(p_uuid, p_team_id, p_slot_info, p_battle_power) {
		return new Promise((resolve, reject) => {
			return mkDB.inst.GetSequelize().transaction(function (out_tran) {
				GTMgr.inst.GetGTTeam().create({
					UUID : p_uuid,
					TEAM_ID : p_team_id,
					SLOT1 : (p_slot_info[0] == undefined) ? 0 : p_slot_info[0],
					SLOT2 : (p_slot_info[1] == undefined) ? 0 : p_slot_info[1],
					SLOT3 : (p_slot_info[2] == undefined) ? 0 : p_slot_info[2],
					SLOT4 : (p_slot_info[3] == undefined) ? 0 : p_slot_info[3],
					BATTLE_POWER : p_battle_power
				}, { transaction : out_tran })
				.then( p_ret => {
					out_tran.commit();
					resolve(p_ret);
				})
				.catch(p_error => { 
					out_tran.rollback();
					reject([p_error, 'InsertTeam']); 
				})
			})
		});
	}

	var UpdateTeam = function(p_ret_team, p_slot_info, p_battle_power) {
		return new Promise((resolve, reject) => {
			return mkDB.inst.GetSequelize().transaction(function (out_tran) {
				// console.log('확인용 - p_ret_team : ', p_ret_team);
				// console.log('확인용 - p_slot_info : ', p_slot_info);


				p_ret_team.updateAttributes({
					SLOT1 : (p_slot_info[0] == undefined) ? 0 : p_slot_info[0],
					SLOT2 : (p_slot_info[1] == undefined) ? 0 : p_slot_info[1],
					SLOT3 : (p_slot_info[2] == undefined) ? 0 : p_slot_info[2],
					SLOT4 : (p_slot_info[3] == undefined) ? 0 : p_slot_info[3],
					BATTLE_POWER : p_battle_power
				}, { transaction : out_tran})
				.then( p_ret => {
					out_tran.commit();
					resolve(p_ret);
				})
				.catch(p_error => { 
					out_tran.rollback();
					reject([p_error, 'UpdateTeam']); 
				})
			})	
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqChangeTeam = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {		
		logger.info('UUID : %d, recv - ReqChangeTeam -', p_user.uuid, p_recv);

		var recv_team_id		= parseInt(p_recv.team_id);
		var recv_battle_power 	= parseInt(p_recv.battle_power);
		var recv_hero_id_list		= p_recv.hero_id_list;

		LoadHero.inst.SelectTeam(p_user.uuid, recv_team_id)
		.then( p_ret => {
			let is_new = false;
			if ( p_ret == null ) {
				return InsertTeam(p_user.uuid, recv_team_id, recv_hero_id_list, recv_battle_power);
			}

			return UpdateTeam(p_ret, recv_hero_id_list, recv_battle_power);
			
		})
		.then( value => {
			p_ack_packet.team_id = value.dataValues.TEAM_ID;
			p_ack_packet.hero_id_list.push(value.dataValues.SLOT1);
			p_ack_packet.hero_id_list.push(value.dataValues.SLOT2);
			p_ack_packet.hero_id_list.push(value.dataValues.SLOT3);
			p_ack_packet.hero_id_list.push(value.dataValues.SLOT4);

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		})
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;