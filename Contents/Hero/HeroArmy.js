/********************************************************************
Title : HeroArmy
Date : 2016.12.13
Update : 2016.12.13
Desc : 영웅 부대 정보
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var BaseArmy = require('../../Data/Base/BaseArmy.js');

var PacketHero = require('../../Packets/PacketHero/PacketHero.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 부대스킬
	inst.ReqHeroArmySkill = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqHeroArmySkill -', p_user.uuid, p_recv);

		var recv_hero_id = parseInt(p_recv.hero_id);

		// GT_HERO_SKILL select
		GTMgr.inst.GetGTHero().find({
			where : { UUID : p_user.uuid, HERO_ID : recv_hero_id, EXIST_YN : true }
		})
		.then(function (p_ret_hero) {
			if ( p_ret_hero == null ) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Not Exist Hero Data in GT_HERO hero_id', recv_hero_id);
				return;
			}
			var hero_data = p_ret_hero.dataValues;

			var army_skill				= PacketHero.inst.GetPacketArmySkill();
			army_skill.army_skill_id	= hero_data.ARMY_SKILL_ID;
			army_skill.skill_level		= hero_data.ARMY_SKILL_LEVEL;

			p_ack_packet.hero_id = hero_data.HERO_ID;
			p_ack_packet.army_skill_list.push(army_skill);

			// 슬롯 부대 스킬일 있다면 거기서 정보를 갖고 와야지 - GT_HERO_ARMY_SKILL 이런 데서?

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Error ReqHeroArmySkill');
		});
	}

	//------------------------------------------------------------------------------------------------------------------
	exports.inst = inst;

})(exports || global);
(exports || global).inst;