/********************************************************************
Title : Team
Date : 2016.07.14
Udpate : 2016.11.23
Desc : 로그인 정보 - 팀
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
	inst.ReqTeam = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqInventory -', p_user.uuid, p_recv);

		var recv_team_id = parseInt(p_recv.team_id);

		// GT_TEAM select
		GTMgr.inst.GetGTTeam().findAll({
			where : { UUID : p_user.uuid, EXIST_YN : true },
			order : 'TEAM_ID'
		})
		.then(function (p_ret_team) {
			for( var cnt in p_ret_team ) {
				(function (cnt) {
					var data = p_ret_team[cnt].dataValues;

					// Packet
					var packet_team = new PacketCommonData.TeamInfo();
					packet_team.team_id = data.TEAM_ID;
					packet_team.hero_id_list.push(data.SLOT1);
					packet_team.hero_id_list.push(data.SLOT2);
					packet_team.hero_id_list.push(data.SLOT3);
					packet_team.hero_id_list.push(data.SLOT4);

					p_ack_packet.team_list.push(packet_team);
				})(cnt);
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqTeam - 1');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;