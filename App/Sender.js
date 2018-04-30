/********************************************************************
Title : Sender
Date : 2015.09.23
Update : 2016.11.21
Desc : 클라이언트에 패킷 전송
writer: jongwook
********************************************************************/
var UserMgr	= require('../Data/Game/UserMgr.js');
var GTMgr 	= require('../DB/GTMgr.js');

(function (exports) {
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.toPeer = function(p_user, p_cmd, p_data, p_result) {
		// console.log('arguments', arguments);
		p_data.result = p_result;
		p_user.SetPacketBuf(p_cmd, p_data);
		p_user.GetSocket().emit(p_cmd, JSON.stringify(p_data));

		if ( p_result == PacketRet.inst.retSuccess() ) {
			logger.info('UUID : %d, Send to Peer - data:\n', p_user.uuid, p_data, p_cmd);
		} else {
			var log_string;
			for( var cnt = 4; cnt < arguments.length; cnt++ ) {
				log_string = (cnt == 4) ? arguments[cnt] : log_string + ' ' + ( typeof arguments[cnt] === 'undefined' ? '' : arguments[cnt] );
			}
			
			if ( p_result == PacketRet.inst.retFail() ) {
				var str_msg = 'UUID : ' + p_user.uuid + ' Account : ' + p_user.account + ' Ack Cmd : ' + p_cmd + ' Error Log Msg - ' + log_string;
				err_report.inst.SendReport(str_msg);
				logger.error(str_msg);
			} else {
				logger.info('UUID :', p_user.uuid, 'Ack Cmd :', p_cmd, 'RetCode :', p_result, 'False Log Msg - ', log_string);
			}
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.toPeerSocket = function(p_socket, p_cmd, p_data, p_result) {
		p_data.result = p_result;
		p_socket.emit(p_cmd, JSON.stringify(p_data));

		if ( p_result == PacketRet.inst.retSuccess() ) {
			logger.info('Send to Peer Socket id : %s - data :\n', p_socket.id, p_data, p_cmd);
		} else {
			var log_string;
			for( var cnt = 4; cnt < arguments.length; cnt++ ) {
				log_string = (cnt == 4) ? arguments[cnt] : log_string + ' ' + ( typeof arguments[cnt] === 'undefined' ? '' : arguments[cnt] );
			}

			if ( p_result == PacketRet.inst.retFail() ) {
				var str_msg = 'Socket ID : ' + p_socket.id + ' Ack Cmd : ' + p_cmd + ' Error Log Msg - ' + log_string;
				err_report.inst.SendReport(str_msg);
				logger.error(str_msg);
			} else {
				logger.info('Socket id :', p_socket.id, 'Ack Cmd :', p_cmd, 'RetCode :', p_result, 'False Log Msg -', log_string);
			}
		}		
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.toPeerError = function(p_user) {
		var ret_string = undefined;
		for( var cnt = 1; cnt < arguments.length; cnt++ ) {
			ret_string = (cnt == 1) ? arguments[cnt] : ret_string + ' ' + arguments[cnt];
		}

		logger.info('UUID :', p_user.uuid, 'toPeerError - data :', ret_string);
		p_user.GetSocket().emit('RecvError', JSON.stringify(ret_string));
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.toTargetPeer = function(p_uuid, p_cmd, p_data) {
		var target_user = UserMgr.inst.GetUser(p_uuid);
		if ( typeof target_user != 'undefined' ) {
			var user_socket = target_user.GetSocket();
			if ( typeof user_socket != 'undefined' && user_socket != 0 ) {
				user_socket.emit(p_cmd, JSON.stringify(p_data));
				logger.info('UUID :', p_uuid, 'toTargetPeer - data :\n', p_data, p_cmd);
			} else {
				logger.info('UUID :', p_uuid, 'toTargetPeer No user socket - data :\n', p_data, p_cmd);
			}
		} else {
			logger.info('UUID :', p_uuid, 'toTargetPeer No target user - data :\n', p_data, p_cmd);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	// 그룹에 전송.
	inst.toGroup = function() {}

	//------------------------------------------------------------------------------------------------------------------
	// 길드에 전송.
	inst.toGuild = function(p_guild_id, p_not_send_uuid, p_cmd, p_data) {
		GTMgr.inst.GetGTGuildMember().findAll({
			where : { GUILD_ID : p_guild_id, EXIST_YN : true }
		})
		.then(function (p_ret_guild_member_list) {

			for (var cnt in p_ret_guild_member_list) {

				var target_uuid = p_ret_guild_member_list[cnt].dataValues.UUID;
				if ( target_uuid != p_not_send_uuid ) {
					var target_user = UserMgr.inst.GetUser(target_uuid);
					if ( typeof target_user != 'undefined' ) {
						var user_socket = target_user.GetSocket();
						if ( typeof user_socket != 'undefined' && user_socket != 0 ) {
							user_socket.emit(p_cmd, JSON.stringify(p_data));
							logger.info('UUID :', target_uuid, 'toGuild - data :\n', p_data, p_cmd);
						} else {
							logger.info('UUID :', target_uuid, 'toGuild No user socket - data :\n', p_data, p_cmd);
						}
					}
				}
			}
		})
	}

	//------------------------------------------------------------------------------------------------------------------
	// 전체에 전송.
	inst.toBroadcast = function(p_cmd, p_data) {
		UserMgr.inst.GetAllUser().forEach(function(value, key) {
			value.GetSocket().emit(p_cmd, JSON.stringify(p_data));
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	// Duck 전용
	inst.toDuck = function(p_socket, p_uuid, p_ack_cmd, p_ack_packet, p_evt_cmd, p_evt_packet) {
		// console.log('p_socket', p_socket);
		// Web에 보내기
		if ( p_ack_cmd != null && p_ack_packet != null ) {
			p_socket.emit(p_ack_cmd, JSON.stringify(p_ack_packet));
			logger.info('Send to Duck Web - data :\n', p_ack_packet, p_ack_cmd);
		}

		// 로그인해 있는 유저에게 보내기
		if ( p_evt_cmd != null && p_evt_packet != null ) {
			var target_user = UserMgr.inst.GetUser(p_uuid);
			// console.log('UUID: %d, target_user', p_uuid, target_user);
			if ( typeof target_user !== 'undefined' ) {
				var user_socket = target_user.GetSocket();
				if ( typeof user_socket == 'undefined' || user_socket == 0 ) {
					logger.info('UUID :', p_uuid, 'No login User - data :\n', p_evt_packet, p_evt_cmd);
				} else {
					user_socket.emit(p_evt_cmd, JSON.stringify(p_evt_packet));
					logger.info('Send to Duck User - data :\n', p_evt_packet, p_evt_cmd);
				}
			}
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
	
})(exports || global);
(exports || global).inst;
