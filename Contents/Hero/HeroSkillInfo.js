/********************************************************************
Title : HeroSkillInfo
Date : 2015.12.10
Update : 2016.08.01
Desc : 영웅 스킬 정보
writer: jongwook
********************************************************************/
var GTMgr = require('../../DB/GTMgr.js');

var PacketHero = require('../../Packets/PacketHero/PacketHero.js');

var Sender = require('../../App/Sender.js');

(function (exports) {
	// private 변수
	var inst = {};

	//------------------------------------------------------------------------------------------------------------------
	// 영웅 스킬 정보
	inst.ReqHeroSkills = function (p_user, p_recv, p_ack_cmd, p_ack_packet) {
		logger.info('UUID : %d, recv - ReqHeroSkills -', p_user.uuid, p_recv);

		var hero_id = parseInt(p_recv.hero_id);

		// GT_HERO_SKILL select
		GTMgr.inst.GetGTHeroSkill().findAll({
			where : { UUID : p_user.uuid, HERO_ID : hero_id, EXIST_YN : true }
		})
		.then(function (p_ret_hero_skill) {
			// console.log('p_ret_hero_skill', p_ret_hero_skill);
			if (p_ret_hero_skill == null) {
				Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'No HeroSkill in GT_HERO_SKILL');
				return;
			}

			p_ack_packet.hero_id = hero_id;

			for (var cnt in p_ret_hero_skill) {
				var packet_skill		= PacketHero.inst.GetPacketSkill();
				packet_skill.skill_id	= p_ret_hero_skill[cnt].dataValues.SKILL_ID;
				packet_skill.skill_level= p_ret_hero_skill[cnt].dataValues.SKILL_LEVEL;

				p_ack_packet.skills.push(packet_skill);
			}

			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retSuccess());
		})
		.catch(function (p_error) {
			Sender.inst.toPeer(p_user, p_ack_cmd, p_ack_packet, PacketRet.inst.retFail(), 'Error ReqHeroSkills');
		});
	}

	exports.inst = inst;

})(exports || global);
(exports || global).inst;