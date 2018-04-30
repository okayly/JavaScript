/********************************************************************
Title : BT_RandombBox
Date : 2016.02.03
Update : 2017.03.28
Desc : BT 로드 - 랜덤박스
writer: jong wook
********************************************************************/
var BaseRandomBoxRe = require('../../Data/Base/BaseRandomBoxRe.js');

(function (exports) {
	// public
	var inst = {};

	// NotReward			0	보상 없음
	// ItemReward			1	아이템 보상
	// GoldReward			2	골드 보상
	// CashReward			3	캐쉬 보상
	// HonorPointReward		4	명예 포인트 보상
	// AlliancePointReward	5	길드 포인트 보상
	// ChallengePointReward	6	PVP 포인트 보상
	// StaminaReward		7	스테미너 보상
	// AccountExpReward		8	계정 경험치 보상

	//------------------------------------------------------------------------------------------------------------------
	inst.LoadRandomBox = function (p_bt_random_box) {
		logger.debug('*** Start LoadRandomBox ***');
		return new Promise(function (resolve, reject) {
			// BT_RANDOM_BOX select
			return p_bt_random_box.findAll()
			.then( p_ret_random_box => {
				return Promise.all(p_ret_random_box.map(row => {
					// console.log('row -', row.dataValues);
					let data = row.dataValues;

					let random_box_group = BaseRandomBoxRe.inst.GetRandomBoxGroup(data.RANDOMBOX_GROUP_ID);
					if (typeof random_box_group === 'undefined') {
						random_box_group = new BaseRandomBoxRe.inst.RandomBoxGroup();
						random_box_group.box_group_id = data.RANDOMBOX_GROUP_ID;
					}

					let box	= new BaseRandomBoxRe.inst.Box();
					box.box_id		= data.RANDOMBOX_ID;
					box.rate		= data.RATE;
					box.reward_type	= data.REWARD_TYPE;
					box.item_id		= data.ITEM_ID;
					box.min_value	= data.MIN_VALUE;
					box.max_value	= data.MAX_VALUE;
					random_box_group.AddBox(data.RANDOMBOX_ID, data.RATE, box);

					BaseRandomBoxRe.inst.AddRandomBoxGroup(data.RANDOMBOX_GROUP_ID, random_box_group);
				}))
				.then(function() {
					console.log('=== Finish LoadRandomBox ===');
					resolve();
				})
				.catch(p_error => { reject(p_error); });				
			})
			.catch(p_error => {
				logger.error('Error Load RandomBox!!!!');
				reject(p_error); 
			});
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;
