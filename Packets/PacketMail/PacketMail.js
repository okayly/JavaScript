/********************************************************************
Title : PacketMail
Date : 2016.02.23
Update : 2016.11.22
Desc : 패킷 정의 - 우편
writer: jongwook
********************************************************************/
var PacketMailData = require('./PacketMailData.js');

var fp = require('fs');

(function (exports) {
	// private 변수
	var packet_cmd;

	// public 변수.
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadPacketCommand = function () {
		logger.debug('**** Mail packet command init ****');

		fp.readFile('./Packets/PacketMail/PacketMailCmd.json', 'utf8', function (err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			packet_cmd = JSON.parse(data);
		});
	};
	
	//-----------------------------------------------------------------------------------------------------------
	// Content
	inst.cmdReqMailReadInfo		= function () { return packet_cmd.Req.ReadInfos; }
	inst.cmdAckMailReadInfo		= function () { return packet_cmd.Ack.ReadInfos; }
	inst.cmdReqMailList			= function () { return packet_cmd.Req.MailList; }
	inst.cmdAckMailList			= function () { return packet_cmd.Ack.MailList; }
	inst.cmdReqMailRead			= function () { return packet_cmd.Req.MailRead; }
	inst.cmdAckMailRead			= function () { return packet_cmd.Ack.MailRead; }
	inst.cmdReqMailReward		= function () { return packet_cmd.Req.MailReward; }
	inst.cmdAckMailReward		= function () { return packet_cmd.Ack.MailReward; }
	inst.cmdReqMailRewardAll	= function () { return packet_cmd.Req.MailRewardAll; }
	inst.cmdAckMailRewardAll	= function () { return packet_cmd.Ack.MailRewardAll; }
	inst.cmdReqMailSend			= function () { return packet_cmd.Req.MailSend; }
	inst.cmdAckMailSend			= function () { return packet_cmd.Ack.MailSend; }

	//-----------------------------------------------------------------------------------------------------------
	// Packet Data
	inst.GetPacketAckMailReadInfo	= function () { return new PacketMailData.AckMailReadInfo(); }
	inst.GetPacketAckMailList		= function () { return new PacketMailData.AckMailList(); }
	inst.GetPacketAckMailRead		= function () { return new PacketMailData.AckMailRead(); }
	inst.GetPacketAckMailReward		= function () { return new PacketMailData.AckMailReward(); }
	inst.GetPacketAckMailRewardAll	= function () { return new PacketMailData.AckMailRewardAll(); }
	inst.GetPacketAckMailSend		= function () { return new PacketMailData.AckMailSend(); }

	//-----------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;