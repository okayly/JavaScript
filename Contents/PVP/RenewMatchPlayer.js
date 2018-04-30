/********************************************************************
Title : pvp info
Date : 2017.02.27
Desc : pvp 정보 전달. 
writer: dongsu
********************************************************************/
var PVPMatchMgr 	= require('./PVPMatchMgr.js');

var LoadPVP = require('../../DB/GTLoad/LoadGTPVP.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqFindMatchPlayer = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqFindMatchPlayer -', p_user.uuid, p_recv);

		let temp_map 		 = new Map();
		let recv_except_uuids = [0, 0, 0];
		if (Array.isArray(p_recv.except_uuids)){
			recv_except_uuids = p_recv.except_uuid_list;
		}

		LoadPVP.inst.GetPVP(p_user.uuid)
		.then(out_pvp => {
			let pvp_data 	= out_pvp.dataValues;
			let pvp_ell 	= pvp_data.ATTACK_ELL;

			return PVPMatchMgr.inst.GetMatchPlayer(p_user, pvp_ell, 1, p_recv.except_uuid_list, 0, temp_map);
		})
		.then( values => {
			temp_map.forEach(function (value, key) {
				p_ack_packet.match_player_list.push(value);
			})

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