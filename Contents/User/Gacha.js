/********************************************************************
Title : Gacha
Date : 2016.08.01
Update : 2016.11.21
Desc : 로그인 정보 - 가챠
writer: dongsu
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var BaseGachaRe = require('../../Data/Base/BaseGachaRe.js');

var PacketCommonData= require('../../Packets/PacketCommonData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqGacha = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqGacha -', p_user.uuid, p_recv);

		// GT_GACHA select - 1. 가챠 정보
		GTMgr.inst.GetGTGacha().findAll({
			where : { UUID : p_user.uuid, EXIST_YN : true }
			, order : 'GACHA_ID'
		})
		.then(function (p_ret_gacha) {
			for ( var cnt in p_ret_gacha ) {
				(function (cnt) {
					var data = p_ret_gacha[cnt].dataValues;

					var gacha_info						= new PacketCommonData.GachaInfo();
					gacha_info.gacha_id					= data.GACHA_ID;
					gacha_info.daily_gacha_count		= data.DAILY_GACHA_COUNT;
					gacha_info.total_gacha_count		= data.TOTAL_GACHA_COUNT;
					gacha_info.free_gacha_remain_time	= 0;

					var base_gacha = BaseGachaRe.inst.GetBaseGacha(data.GACHA_ID);
					if ( typeof base_gacha !== 'undefined' ) {
						if ( base_gacha.daily_free_exec_count != 0 ) {
							var temp_count = base_gacha.daily_free_exec_count - data.DAILY_GACHA_COUNT;
							if ( temp_count > 0 && base_gacha.daily_free_exec_count != temp_count ) {
								var delta_time = Timer.inst.GetDeltaTime(data.LAST_GACHA_DATE);
								// logger.info('UUID : %d 로그인 가챠 시간 계산 기준시 %s 결과  %d ', p_user.uuid, data.LAST_GACHA_DATE, delta_time);
								if ( delta_time <= base_gacha.free_exec_delay_time_for_sec ) {
									gacha_info.free_gacha_remain_time = base_gacha.free_exec_delay_time_for_sec - delta_time;		
								}	
							}
						}
					}

					p_ack_packet.gacha_info_list.push(gacha_info);
				})(cnt);
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqGacha');
		});
	};

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;