/********************************************************************
Title : UserMgr
Date : 2015.12.01
Update : 2016.08.30
Desc : 유저 관리 매니저
writer: dongsu
********************************************************************/


(function (exports) {
	// private
	var user_list_by_uuid = new HashMap();
	var user_list_by_socket_id = new HashMap();

	var wait_user_list = new HashMap(); // key : uuid, value : UserData
	
	// public
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	inst.AddUser = function (user) {
		logger.log('★★★★★ user_list_by_socket_id:', user_list_by_socket_id);
		
		user_list_by_uuid.set(user.uuid, user);
		user_list_by_socket_id.set(user.socket.id, user.uuid);

		logger.info('★★★★★ uuid : %d, socket_id : %s 로그인.', user.uuid, user.socket.id);

		user_list_by_socket_id.forEach(function (value, key) {
			logger.info('★★★★★ AddUser 접속 리스트 uuid : %d, socket id :', value, key);
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.DelUser = function (socket_id, remoteAddress, reason) {

		if ( user_list_by_socket_id.has(socket_id) == true ) {
			var uuid = user_list_by_socket_id.get(socket_id);

			logger.info('★★★★★ 정리 이전 user_list_by_socket_id Size : %d, user_list_by_uuid Size : %d',  user_list_by_socket_id.count(), user_list_by_uuid.count());
			logger.info('★★★★★ uuid : %d, socket_id : %s, socket ip : %s, reason : %s 로그아웃.', uuid, socket_id, remoteAddress, reason);

			var target_user = user_list_by_uuid.get(uuid);
			if ( target_user != undefined ) {
				target_user.InitSocket();
				target_user.SetLogoutTime();

				logger.info('확인용. %s, %d ', target_user.logout_time, target_user.GetDeltaTime());
			}

			// 기존 리스트에서 정리
			user_list_by_socket_id.remove(socket_id);
			user_list_by_socket_id.forEach(function (value, key) {
				logger.info('★★★★★ DelUser 접속 리스트 uuid : %d, socket id : %s', value, key);
			});

			logger.info('★★★★★ 정리 이후 user_list_by_socket_id Size : %d, user_list_by_uuid Size : %d',  user_list_by_socket_id.count(), user_list_by_uuid.count());	
		} else {
			logger.info('DelUser 해당 아이디를 확인 할 수 없다. Socket ID : %s', socket_id);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.GetUser = function (uuid) {
		return (user_list_by_uuid.has(uuid) == true) ? user_list_by_uuid.get(uuid) : undefined;
	}

	//--------------------------------------------------------------------------------------------------------------------
	inst.GetAllUser = function () { return user_list_by_uuid; }

	//--------------------------------------------------------------------------------------------------------------------
	inst.GetUserbySocket = function (p_socket_id) {
		if ( user_list_by_socket_id.has(p_socket_id) == true ) {
			var uuid = user_list_by_socket_id.get(p_socket_id);
			return user_list_by_uuid.get(uuid);
		}		
		return undefined;
	}

	//--------------------------------------------------------------------------------------------------------------------
	inst.IsExistUser = function (socket_id) {
		return user_list_by_socket_id.has(socket_id);
	}

	//--------------------------------------------------------------------------------------------------------------------
	inst.GetUserCount = function() {
		return user_list_by_uuid.count();
	}

	//--------------------------------------------------------------------------------------------------------------------
	inst.ProcessClearLogoutUser = function() {
		setInterval(function() {
			user_list_by_uuid.forEach(function (value, key) {
				var logout_delta_time = value.GetDeltaTime();
				// logger.info('확인용. 콜백에서 %s, %d ', value.logout_time, logout_delta_time);
				if ( logout_delta_time != undefined && logout_delta_time >= 900 ) {
					logger.info('UUID : %d, 장기 미접속으로 접속 리스트에서 삭제. ', key);
					user_list_by_uuid.remove(key);
				}
			})
		}, 900000); 
	}

	//------------------------------------------------------------------------------------------------------------------
	inst.ProcessReconnect = function(p_uuid, p_socket) {
		var target_user = user_list_by_uuid.get(p_uuid);
		if ( target_user != undefined ) {
			user_list_by_socket_id.remove(target_user.socket.id);
			target_user.InitLogoutTime();
			target_user.SetSocket(p_socket);
			user_list_by_socket_id.set(p_socket.id, p_uuid );

			logger.info('UUID : %d, Socket ID : %s 재접속 성공.', p_uuid, p_socket.id);

			return true;
		}

		logger.info('UUID : %d, Socket ID : %s 재접속 실패. 유저 리스트에서 확인 할 수 없다.', p_uuid, p_socket.id);

		return false;
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;
})(exports || global);
(exports || global).inst;