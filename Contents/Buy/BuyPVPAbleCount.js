/********************************************************************
Title : pvp info
Date : 2017.02.27
Desc : pvp 정보 전달. 
writer: dongsu
********************************************************************/

var mkDB		= require('../../DB/mkDB.js');
var LoadPVP 		= require('../../DB/GTLoad/LoadGTPVP.js');
var LoadUser 		= require('../../DB/GTLoad/LoadGTUser.js');
var Sender 		= require('../../App/Sender.js');
// var PacketCommonData 	= require('../../Packets/PacketCommonData.js');


(function (exports) {
	// private 변수

	// public
	var inst = {};

	var UpdateUserInfo = function(p_tran, p_ret_user, p_ret_cash) {
		return new Promise((resolve, reject) => {
			p_ret_user.updateAttributes({
				CASH : p_ret_cash
			}, { transaction : p_tran })
			.then( p_ret => {
				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'UpdateUserInfo']); })
		});
	}

	var UpdataUserPvPInfo = function(p_tran, p_ret_user_pvp, p_ret_pvp_able_count) {
		return new Promise((resolve, reject) => {
			p_ret_user_pvp.updateAttributes({
				ABLE_PLAY_COUNT : p_ret_pvp_able_count
			}, { transaction : p_tran })
			.then( p_ret => {
				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'UpdataUserPvPInfo']); })
		});
	}

	var ProcessTransaction = function(p_user_data, p_pvp_data, p_ack_packet) {
		return new Promise((resolve, reject) => {
			return mkDB.inst.GetSequelize().transaction(function (out_tran) {
				let tran 		= out_tran;
				let ret_cash 		= p_user_data.dataValues.CASH - 5;
				let ret_able_count 	= p_pvp_data.dataValues.ABLE_PLAY_COUNT + 1;

				return Promise.all([ 	UpdateUserInfo(tran, p_user_data, ret_cash),
							UpdataUserPvPInfo(tran, p_pvp_data, ret_able_count)])
				.then( values => {

					p_ack_packet.result_cash 			= ret_cash;
					p_ack_packet.remain_pvp_play_count 	= ret_able_count;

					tran.commit();
					resolve(values);
				})
				.catch(p_error => { 
					tran.rollback();
					reject([p_error, 'ProcessTransaction']); 
				})
			})
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqBuyPvpAbleCount = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqPvpGroupRankList -', p_user.uuid, p_recv);

		Promise.all([	LoadUser.inst.SelectUser(p_user.uuid),
				LoadPVP.inst.GetPVP(p_user.uuid)])
		.then( values => {
			let user_data 	= values[0].dataValues;
			let pvp_data 	= values[1].dataValues;

			if ( user_data.CASH < 5 ) {
				throw ([ PacketRet.inst.retNotEnoughCash(), 'retNotEnoughCash']);
			}

			if ( pvp_data.ABLE_PLAY_COUNT >= 10 ) {
				throw ([ PacketRet.inst.retAlreadyMax(), 'retAlreadyMax']);
			}

			return ProcessTransaction(values[0], values[1], p_ack_packet);
		})
		.then( values => {
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