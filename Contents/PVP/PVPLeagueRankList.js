/********************************************************************
Title : pvp info
Date : 2017.02.27
Desc : pvp 정보 전달. 
writer: dongsu
********************************************************************/

var PVPMatchMgr 	= require('./PVPMatchMgr.js');
var LoadPVP 		= require('../../DB/GTLoad/LoadGTPVP.js');
var Sender 		= require('../../App/Sender.js');
var PacketCommonData 	= require('../../Packets/PacketCommonData.js');


(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqPvpLeagueRankList = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqPvpLeagueRankList -', p_user.uuid, p_recv);

		var recv_league_id		= parseInt(p_recv.league_id);

		LoadPVP.inst.GetPVPByLeague(recv_league_id)
		.then(values => {

			values.map(row => {
				let user_data = row;
				let rank_user = new PacketCommonData.RankUser();

				rank_user.uuid 		= user_data.UUID;
				rank_user.user_level 		= user_data.USER_LEVEL;
				rank_user.user_nick 		= user_data.NICK;
				rank_user.pvp_point 		= user_data.PVP_ELO;
				rank_user.battle_power 	= user_data.BATTLE_POWER;
				rank_user.user_icon 		= user_data.ICON;
				rank_user.guild_name 	= user_data.GUILD_NAME;
				p_ack_packet.rank_user_list.push(rank_user);
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