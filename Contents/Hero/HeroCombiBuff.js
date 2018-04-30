/********************************************************************
Title : HeroCombiBuff
Date : 2017.03.29
Update : 2017.03.29
Desc : 영웅 수집 버프
writer: jongwook
********************************************************************/
var mkDB = require('../../DB/mkDB.js');
var GTMgr = require('../../DB/GTMgr.js');

var Sender = require('../../App/Sender.js');
var Timer = require('../../Utils/Timer.js');

(function (exports) {
	// private 변수
	var inst = {};
	
	//------------------------------------------------------------------------------------------------------------------
	var GetCombiBuff = function(p_uuid, p_buff_id) {
		return new Promise(function (resolve, reject) {
			// GT_HERO_COMBI_BUFF
			GTMgr.inst.GetGTHeroCombiBuff().find({
				where : { UUID : p_uuid, BUFF_ID : p_buff_id, EXIST_YN : true }
			})
			.then(p_ret_buff => { resolve(p_ret_buff); })
			.catch(p_error => { reject(p_error); });
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetCombiBuff = function(p_ret_combi, p_uuid, p_buff_id, p_buff_level, p_t) {
		return new Promise(function (resolve, reject) {
			if ( p_ret_combi == null ) {
				// GT_HERO_COMBI_BUFF insert
				GTMgr.inst.GetGTHeroCombiBuff().create({
					UUID : p_uuid,
					BUFF_ID : p_buff_id,
					BUFF_LEVEL : p_buff_level,
					REG_DATE : Timer.inst.GetNowByStrDate()
				}, { transaction : p_t })
				.then(p_ret_combi_insert => { resolve(p_ret_combi_insert); })
				.catch(p_error => { reject(p_error); });
			} else {
				if ( p_ret_combi.dataValues.BUFF_LEVEL == p_buff_level ) {
					resolve(p_ret_combi);
				} else {
					// GT_HERO_COMBI_BUFF update
					p_ret_combi.updateAttributes({
						BUFF_LEVEL : p_buff_level
					}, { transaction : p_t })
					.then(p_ret_combi_update => { resolve(p_ret_combi_update); })
					.catch(p_error => { reject(p_error); });
				}
			}
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	var SetTransaction = function(p_value, p_uuid, p_buff_id, p_buff_level) {
		return new Promise(function (resolve, reject) {
			let ret_combi = p_value;

			// start transaction
			mkDB.inst.GetSequelize().transaction(function (transaction) {
				// console.log('SetTransaction');
				let t = transaction;

				SetCombiBuff(ret_combi, p_uuid, p_buff_id, p_buff_level, t)				
				.then(value => {
					// console.log('value', value);
					t.commit();

					resolve(value);
				})
				.catch(p_error => {
					if (t)
						t.rollback();

					reject(p_error);
				})
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 수집 버프
	inst.ReqHeroCombiBuff = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqCombiBuff -', p_user.uuid, p_recv);

		var recv_buff_id = parseInt(p_recv.buff_id);
		var recv_buff_level = parseInt(p_recv.buff_level);

		GetCombiBuff(p_user.uuid, recv_buff_id)
		.then(value => {
			return SetTransaction(value, p_user.uuid, recv_buff_id, recv_buff_level);
		})
		.then(value => {
			let ret_combi = value;

			p_ack_packet.buff_id	= ret_combi.dataValues.BUFF_ID;
			p_ack_packet.buff_level	= ret_combi.dataValues.BUFF_LEVEL;

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(p_error => {
			if ( Array.isArray(p_error) )
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, p_error[0], p_error[1], p_error[2], p_error[3], p_error[4]);
			else
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;