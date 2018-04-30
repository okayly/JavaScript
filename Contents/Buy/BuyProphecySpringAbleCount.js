/********************************************************************
Title : 
Date : 2017.01.11
Update : 
Desc : 
writer: dongsu
********************************************************************/
var GTMgr		= require('../../DB/GTMgr.js');

var Sender 		= require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqAbleCount = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d recv - ReqBuyProphecySpringAbleCount -', p_user.uuid, p_recv);

		var recv_chapter_id	= parseInt(p_recv.chapter_id);
		var recv_stage_id	= parseInt(p_recv.stage_id);

		// GT_USER select
		GTMgr.inst.GetGTUser().find({
			where : { UUID : p_user.uuid, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			if ( p_ret_user == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User in GT_USER');
				return;
			}
			var user_data = p_ret_user.dataValues;

			// 1. 캐쉬 확인.
			if ( user_data.CASH < 100 ) {
				Sender.inst.toPeer(user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCash());
				return;
			}

			// 2. 구매 스테이지 확인. 
			GTMgr.inst.GetGTStage().find({
				where : { UUID : p_user.uuid, CHAPTER_ID : recv_chapter_id, STAGE_ID : recv_stage_id }
			})
			.then(function (p_ret_stage) {
				if ( p_ret_stage == null ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find Stage in GT_STAGE');
					return;
				}

				var stage_data = p_ret_stage.dataValues;

				// 충전 가능 상태 확인. 
				if ( stage_data.ABLE_COUNT != 0 || stage_data.CHAPTER_TYPE != 6 ) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retNotEnoughCondition());
					return;
				}

				// 가능 횟수 업데이트. 
				p_ret_stage.updateAttributes({
					ABLE_COUNT: 3
				})
				.then(function (p_ret_stage_update) {
					
					// 3. 캐쉬 차감. 
					var ret_cash = user_data.CASH - 100;
					p_ret_user.updateAttributes({
						CASH : ret_cash
					})
					.then(function (p_ret_user_update) {

						// 결과 전송. 
						p_ack_packet.cash = ret_cash;
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
					})
					.catch(function (p_error) {
						Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAbleCount - 4');
					})
				})
				.catch(function (p_error) {
					Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAbleCount - 3');
				});
			})
			.catch(function (p_error) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAbleCount - 2');
			})
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqAbleCount - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;