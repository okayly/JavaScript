/********************************************************************
Title : Packet dist - DarkDungeon
Date : 2016.12.12
Desc : 어둠의 던전
writer: jongwook
********************************************************************/
var UserMgr = require('../../Data/Game/UserMgr.js');

var PacketDarkDungeon = require('../../Packets/PacketDarkDungeon/PacketDarkDungeon.js');

var DarkDungeon				= require('../../Contents/DarkDungeon/DarkDungeon.js');
var DarkDungeonCreate		= require('../../Contents/DarkDungeon/DarkDungeonCreate.js');
var DarkDungeonChapter		= require('../../Contents/DarkDungeon/DarkDungeonChapter.js');
var DarkDungeonBattleStart	= require('../../Contents/DarkDungeon/DarkDungeonBattleStart.js');
var DarkDungeonBattleFinish	= require('../../Contents/DarkDungeon/DarkDungeonBattleFinish.js');
var DarkDungeonChapterReset	= require('../../Contents/DarkDungeon/DarkDungeonChapterReset.js');
var DarkDungeonReward		= require('../../Contents/DarkDungeon/DarkDungeonReward.js');
var DarkDungeonNextStage	= require('../../Contents/DarkDungeon/DarkDungeonNextStage.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.Dist = function (p_cmd, p_socket, p_packet) {
		var recv = JSON.parse(p_packet);
		if (recv == null) {
			logger.error('Error Packet Convert - cmd is:', p_cmd);
			return;
		}

		var user = UserMgr.inst.GetUserbySocket(p_socket.id);
		if (user == undefined) {
			logger.error('Error Packet Not Find: %s, User Socket ID:', p_cmd, p_socket.id);
			return;
		}

		if ( recv.packet_srl == user.GetPacketBuf().packet_srl ) {
			logger.info('UUID : %d, PacketSrl : %d Already Recv Packet Request', user.uuid, recv.packet_srl);
			p_socket.emit(user.GetPacketBuf().packet_cmd, JSON.stringify(user.GetPacketBuf().packet_data));
			return;
		}
			
		// 분배. 
		var ack_cmd = undefined;
		var ack_packet = undefined;

		try {
			switch(p_cmd) {
				case PacketDarkDungeon.inst.cmdReqDarkDungeonCreate() :
					ack_cmd 	= PacketDarkDungeon.inst.cmdAckDarkDungeonCreate();
					ack_packet	= PacketDarkDungeon.inst.GetPacketAckDarkDungeonCreate();
					ack_packet.packet_srl = recv.packet_srl;
					DarkDungeonCreate.inst.ReqDarkDungeonCreate(user, recv, ack_cmd, ack_packet);
				break;

				case PacketDarkDungeon.inst.cmdReqDarkDungeon() :
					ack_cmd 	= PacketDarkDungeon.inst.cmdAckDarkDungeon();
					ack_packet	= PacketDarkDungeon.inst.GetPacketAckDarkDungeon();
					ack_packet.packet_srl = recv.packet_srl;
					DarkDungeon.inst.ReqDarkDungeon(user, recv, ack_cmd, ack_packet);
				break;

				case PacketDarkDungeon.inst.cmdReqDarkDungeonChapter() :
					ack_cmd 	= PacketDarkDungeon.inst.cmdAckDarkDungeonChapter();
					ack_packet	= PacketDarkDungeon.inst.GetPacketAckDarkDungeonChapter();
					ack_packet.packet_srl = recv.packet_srl;
					DarkDungeonChapter.inst.ReqDarkDungeonChapter(user, recv, ack_cmd, ack_packet);
				break;

				case PacketDarkDungeon.inst.cmdReqDarkDungeonBattleStart() :
					ack_cmd 	= PacketDarkDungeon.inst.cmdAckDarkDungeonBattleStart();
					ack_packet	= PacketDarkDungeon.inst.GetPacketAckDarkDungeonBattleStart();
					ack_packet.packet_srl = recv.packet_srl;
					DarkDungeonBattleStart.inst.ReqDarkDungeonBattleStart(user, recv, ack_cmd, ack_packet);
				break;

				case PacketDarkDungeon.inst.cmdReqDarkDungeonBattleFinish() :
					ack_cmd 	= PacketDarkDungeon.inst.cmdAckDarkDungeonBattleFinish();
					ack_packet	= PacketDarkDungeon.inst.GetPacketAckDarkDungeonBattleFinish();
					ack_packet.packet_srl = recv.packet_srl;
					DarkDungeonBattleFinish.inst.ReqDarkDungeonBattleFinish(user, recv, ack_cmd, ack_packet);
				break;

				case PacketDarkDungeon.inst.cmdReqDarkDungeonChapterReset() :
					ack_cmd 	= PacketDarkDungeon.inst.cmdAckDarkDungeonChapterReset();
					ack_packet	= PacketDarkDungeon.inst.GetPacketAckDarkDungeonChapterReset();
					ack_packet.packet_srl = recv.packet_srl;
					DarkDungeonChapterReset.inst.ReqDarkDungeonChapterReset(user, recv, ack_cmd, ack_packet);
				break;

				case PacketDarkDungeon.inst.cmdReqDarkDungeonReward() :
					ack_cmd 	= PacketDarkDungeon.inst.cmdAckDarkDungeonReward();
					ack_packet	= PacketDarkDungeon.inst.GetPacketAckDarkDungeonReward();
					ack_packet.packet_srl = recv.packet_srl;
					DarkDungeonReward.inst.ReqDarkDungeonReward(user, recv, ack_cmd, ack_packet);
				break;

				case PacketDarkDungeon.inst.cmdReqDarkDungeonNextStage() :
					ack_cmd 	= PacketDarkDungeon.inst.cmdAckDarkDungeonNextStage();
					ack_packet	= PacketDarkDungeon.inst.GetPacketAckDarkDungeonNextStage();
					ack_packet.packet_srl = recv.packet_srl;
					DarkDungeonNextStage.inst.ReqDarkDungeonNextStage(user, recv, ack_cmd, ack_packet);
				break;
				
				default :
					logger.error('Error Packet Dist! cmd:', p_cmd);
				break;
			}
		} catch (p_error) {
			err_report.inst.SendReportExecption(user.uuid, user.account, ack_cmd, p_error.stack);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;