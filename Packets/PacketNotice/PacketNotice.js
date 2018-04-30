/********************************************************************
Title : PacketNotice
Date : 2016.07.27
Udpate : 2016.08.03
Desc : 패킷 정의 - Notice(알람)
writer : donsu
********************************************************************/
var PacketNoticeData = require('./PacketNoticeData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Notice packet command init ****');

		fp.readFile('./Packets/PacketNotice/PacketNoticeCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};
	
	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdEvtLoseRankMatch	= function() { return packet_cmd.Evt.LoseRankMatch; }
	inst.cmdEvtMissionUpdate	= function() { return packet_cmd.Evt.MissionUpdate; }
	inst.cmdEvtAllowGuildJoin	= function() { return packet_cmd.Evt.AllowGuildJoin; }
	inst.cmdEvtBanAtGuild		= function() { return packet_cmd.Evt.BanAtGuild; }
	inst.cmdEvtChangeAuth		= function() { return packet_cmd.Evt.ChangeAuth; }
	inst.cmdEvtFriendRequest	= function() { return packet_cmd.Evt.FriendRequest; }
	inst.cmdEvtFriendAccept		= function() { return packet_cmd.Evt.FriendAccept; }
	inst.cmdEvtFriendRecvStamina= function() { return packet_cmd.Evt.FriendRecvStamina; }
	inst.cmdEvtFriendDelete		= function() { return packet_cmd.Evt.FriendDelete; }
	inst.cmdEvtRandomShopOpen	= function() { return packet_cmd.Evt.RandomShopOpen; }
	inst.cmdEvtGuildSkillUp		= function() { return packet_cmd.Evt.GuildSkillUp; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketEvtLoseRankMatch		= function() { return new PacketNoticeData.EvtLoseRankMatch(); }
	inst.GetPacketEvtMissionUpdate		= function() { return new PacketNoticeData.EvtMissionUpdate(); }
	inst.GetPacketEvtAllowGuildJoin		= function() { return new PacketNoticeData.EvtAllowGuildJoin(); }
	inst.GetPacketEvtBanAtGuild			= function() { return new PacketNoticeData.EvtBanAtGuild(); }
	inst.GetPakcetEvtChangeAuth			= function() { return new PacketNoticeData.EvtChangeAuth(); }
	inst.GetPakcetEvtFriendRequest		= function() { return new PacketNoticeData.EvtFriendRequest(); }
	inst.GetPakcetEvtFriendAccept		= function() { return new PacketNoticeData.EvtFriendAccept(); }
	inst.GetPakcetEvtFriendRecvStamina	= function() { return new PacketNoticeData.EvtFriendRecvStamina(); }
	inst.GetPakcetEvtFriendDelete		= function() { return new PacketNoticeData.EvtFriendDelete(); }
	inst.GetPakcetEvtRandomShopOpne		= function() { return new PacketNoticeData.EvtRandomShopOpne(); }
	inst.GetPakcetEvtGuildSkillUp		= function() { return new PacketNoticeData.EvtGuildSkillUp(); }
	
	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;