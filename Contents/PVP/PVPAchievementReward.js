// /********************************************************************
// Title : pvp info
// Date : 2017.02.27
// Desc : pvp 정보 전달. 
// writer: dongsu
// ********************************************************************/
var mkDB = require('../../DB/mkDB.js');

var LoadPVP 		= require('../../DB/GTLoad/LoadGTPVP.js');
var LoadUser 		= require('../../DB/GTLoad/LoadGTUser.js');
var BasePVP 		= require('../../Data/Base/BasePVP.js');
var Sender 		= require('../../App/Sender.js');

(function (exports) {
	// private 변수

	// public
	var inst = {};

	var UpdateUserInfo = function(p_tran, p_ret_user, p_ret_cash, p_ret_honor_point) {
		return new Promise((resolve, reject) => {
			p_ret_user.updateAttributes({
				CASH : p_ret_cash,
				POINT_HONOR : p_ret_honor_point
			}, { transaction : p_tran })
			.then( p_ret => {
				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'UpdateUserInfo']); })
		});
	}

	var UpdataUserPvPInfo = function(p_tran, p_ret_user_pvp, p_ret_gain_achievement_reward_id) {
		return new Promise((resolve, reject) => {
			p_ret_user_pvp.updateAttributes({
				GAIN_ACHIEVEMENT_REWARD : p_ret_gain_achievement_reward_id
			}, { transaction : p_tran })
			.then( p_ret => {
				resolve(p_ret);
			})
			.catch(p_error => { reject([p_error, 'UpdataUserPvPInfo']); })
		});
	}

	var ProcessTransaction = function(p_user_data, p_pvp_data, p_base_league, p_ack_packet) {
		return new Promise((resolve, reject) => {
			return mkDB.inst.GetSequelize().transaction(function (out_tran) {
				let tran 	= out_tran;
				let ret_cash 	= p_user_data.dataValues.CASH + p_base_league.achievement_cash;
				let ret_honor 	= p_user_data.dataValues.POINT_HONOR + p_base_league.achievement_homor_point;

				return Promise.all([ 	UpdateUserInfo(tran, p_user_data, ret_cash, ret_honor),
							UpdataUserPvPInfo(tran, p_pvp_data, p_base_league.league_id)])
				.then( values => {
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
	inst.ReqPvpAchievementReward = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('UUID : %d, recv - ReqPvpAchievementReward -', p_user.uuid, p_recv);

		var recv_league_id 		= parseInt(p_recv.league_id);

		Promise.all([ 	LoadUser.inst.SelectUser(p_user.uuid),
				LoadPVP.inst.GetPVP(p_user.uuid)])
		.then( values => {

			let user_data 	= values[0];
			let pvp_data 	= values[1];


			if ( pvp_data.dataValues.GAIN_ACHIEVEMENT_REWARD >= recv_league_id ) {
				throw ([PacketRet.inst.retAlreadyRewardPayment(), 'retAlreadyRewardPayment']);
			}

			if ( pvp_data.dataValues.MAX_LEAGUE_ID < recv_league_id ) {
				throw ([PacketRet.inst.retNotEnoughCondition(), 'retNotEnoughCondition']);	
			}

			let base_pvp 	= BasePVP.inst.GetLeague(recv_league_id);
			if ( base_pvp == undefined ) {
				throw ([PacketRet.inst.retFail(), 'Not Find League']);
			}

			return ProcessTransaction(user_data, pvp_data, base_pvp);
		})
		.then(values => {
			let ret_user_data 	= values[0].dataValues;

			p_ack_packet.league_id 	= recv_league_id;
			p_ack_packet.point_honor 	= ret_user_data.POINT_HONOR;
			p_ack_packet.cash 		= ret_user_data.CASH;

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