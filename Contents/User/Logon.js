/********************************************************************
Title : Logon
Date : 2016.07.14
Update : 2017.03.29
Desc : 로그인 정보 - 로그온
writer: dongsu
********************************************************************/
var mkDB				= require('../../DB/mkDB.js');
var GTMgr				= require('../../DB/GTMgr.js');
var UserMgr				= require('../../Data/Game/UserMgr.js');
var DailyContentsMgr	= require('../DailyContents/DailyContentsMgr.js');

var DefineValues= require('../../Common/DefineValues.js');
var UserData	= require('../../Data/Game/UserData.js');

var Sender	= require('../../App/Sender.js');
var Timer	= require('../../Utils/Timer.js');

(function (exports) {
	// public
	var inst = {};

	// private

	//------------------------------------------------------------------------------------------------------------------
	// 유저 생성
	var ProcessCreateUser = function(p_socket, p_account, p_ack_cmd, p_ack_packet) {
		mkDB.inst.GetSequelize().query('call sp_create_user(?);', 
				null, 
				{ raw: true, type: 'SELECT' }, 
				[ p_account ]
		)
		.then(function (p_ret_user) {
			console.log('ProcessCreateUser - p_ret_user', p_ret_user);
			if ( Object.keys(p_ret_user).length <= 0 ) {
				Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Find User In Table');
				return;
			}

			// GameData - 유저
			var user = new UserData.User();
			user.CreateUser(p_socket, p_ret_user[0][0].UUID, p_ret_user[0][0].ACCOUNT);
			UserMgr.inst.AddUser(user); // user manager 에 추가.

			p_ack_packet.uuid					= p_ret_user[0][0].UUID;
			p_ack_packet.last_login_unix_time	= Timer.inst.GetUnixTime(p_ret_user[0][0].LAST_LOGIN_DATE);
			p_ack_packet.is_new_day				= true;

			// socket 때문에 user가 필요하다.
			Sender.inst.toPeer(user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch ( function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqLogon - 3');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqLogon = function (p_socket, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('ACCOUNT : %s, recv - ReqLogon -', p_recv.account, p_recv);

		// GT_USER select 1. 유저 정보 확인. 
		GTMgr.inst.GetGTUser().find({
			where : { ACCOUNT : p_recv.account, EXIST_YN : true }
		})
		.then(function (p_ret_user) {
			// console.log('ReqLogon - p_ret_user', p_ret_user);
			if ( p_ret_user == null ) {
				// 1-2. 없다.
				// 1-2-1. 생성.
				ProcessCreateUser(p_socket, p_recv.account, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
			} else {
				// 일일 컨턴츠 기능
				var is_new_day = Timer.inst.IsNewDay(p_ret_user.LAST_LOGIN_DATE);
				if ( is_new_day == true ) {
					DailyContentsMgr.inst.NewDay(p_ret_user);
				}

				// GT_USER update - LAST_LOGIN_DATE
				p_ret_user.updateAttributes({
					LAST_LOGIN_DATE: Timer.inst.GetNowByStrDate()
				})
				.then(function (p_ret_user_update) {
					var user_update_data = p_ret_user_update.dataValues;
					// console.log('user_update_data', user_update_data);
					// 1-1. 있다. 
					// GameData - 유저
					var user = new UserData.User();
					user.CreateUser(p_socket, user_update_data.UUID, user_update_data.ACCOUNT);
					UserMgr.inst.AddUser(user); // user manager 에 추가.

					p_ack_packet.uuid					= user_update_data.UUID;
					p_ack_packet.last_login_unix_time	= Timer.inst.GetUnixTime(user_update_data.LAST_LOGIN_DATE);
					p_ack_packet.is_new_day				= is_new_day;

					// socket 때문에 user가 필요하다.
					Sender.inst.toPeer(user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
				})
				.catch(function (p_error) {
					Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqLogon - 2');
				});
			}
		})
		.catch(function (p_error) {
			Sender.inst.toPeerSocket(p_socket, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error, 'Error ReqLogon - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ReqVersion = function (p_socket, p_recv, p_ack_cmd, p_ack_packet) {
		logger.debug('recv - ReqVersion', p_recv);

		// GT_VERSION
		GTMgr.inst.GetGTVersion().findAll()
		.then(function (p_ret_version) {
			if ( p_ret_version == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'No Version');
				return;
			}

			p_ack_packet.app_version	= p_ret_version.dataValues.APP_VERSION;
			p_ack_packet.data_version	= p_ret_version.dataValues.DATA_VERSION;

			Sender.inst.toPeer(user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), p_error.stack, 'Error ReqVersion - 1');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;