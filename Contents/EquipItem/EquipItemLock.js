/********************************************************************
Title : EquipItemLock
Date : 2017.02.08
Update : 2017.02.08
Desc : 장비 아이템 잠금
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 장비 장착
	inst.ReqEquipItemLock = function(p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqEquipItemLock -', p_user.uuid, p_recv);

		var recv_iuid = p_recv.iuid;
		var recv_is_lock = ( p_recv.is_lock == true || p_recv.is_lock == 'true') ? true : false;

		// 1. 장비 얻기
		var getEquipItem = function() {
			return new Promise(function (resolve, reject) {
				console.log('1. getEquipItem');

				// GT_INVENTORY select
				GTMgr.inst.GetGTInventory().find({
					where : { UUID : p_user.uuid, IUID : recv_iuid, EXIST_YN : true }
				})
				.then(p_item => {
					resolve(p_item);
				})
				.catch(p_error => { reject(p_error); });
			});
		}

		// 2. 장비 잠금 설정
		var setLock = function(p_ret_item) {
			return new Promise(function (resolve, reject) {
				console.log('2. setLock');

				// GT_INVENTORY update
				p_ret_item.updateAttributes({ IS_LOCK : recv_is_lock })
				.then(p_item => {
					resolve(p_item);
				})
				.catch(p_error => { reject(p_error); });
			});
		}
		
		// Promise GO!
		getEquipItem()
		.then(p_get_item => { return setLock(p_get_item); })
		.then(p_set_item => {
			let item_data = p_set_item.dataValues;

			p_ack_packet.iuid = item_data.IUID;
			p_ack_packet.is_lock = ( item_data.IS_LOCK == 1 ) ? true : false;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			console.log('Promise Error', p_error);

			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;