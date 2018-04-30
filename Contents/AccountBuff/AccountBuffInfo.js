/********************************************************************
Title : 계정 버프
Date : 2016.03.14
Update : 2017.01.03
Desc : 계정 버프 정보
writer: jong wook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var PacketCommonData = require('../../Packets/PacketCommonData.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 계정 버프 정보 요청
	inst.ReqAccountBuffInfo = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqAccountBuffInfo -', p_user.uuid, p_recv);

		// GT_USER select
		GTMgr.inst.GetGTAccountBuff().findAll({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_buff_list) {
			var total_use_gold		= 0;
			var total_use_item_count= 0;

			if ( p_ret_buff_list == null || Object.keys(p_ret_buff_list).length <= 0 ) {
				p_ack_packet.account_buff_list = null;
			} else {
				for ( var cnt_buff in p_ret_buff_list ) {
					(function (cnt_buff) {
						var buff_data = p_ret_buff_list[cnt_buff];

						var account_buff				= new PacketCommonData.AccountBuff();
						account_buff.account_buff_id	= buff_data.ACCOUNT_BUFF_ID;
						account_buff.account_buff_level	= buff_data.ACCOUNT_BUFF_LEVEL;

						p_ack_packet.account_buff_list.push(account_buff);
					})(cnt_buff);
				}				
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAccountBuffInfo - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;