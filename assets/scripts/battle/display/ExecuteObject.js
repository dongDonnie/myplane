const EntityManager = require('EntityManager')
const BaseObject = require('BaseObject')

cc.Class({
    extends: BaseObject,

    properties: {
        anime: {
            default: null,
            type: cc.Animation
        },
        selfEntity:{
            default:null,
            visible:false
        },
    },

    onLoad: function () {

    },

    setEntity: function (entity) {
        this.selfEntity = typeof entity !== 'undefined' ? entity : null;
    },

    animePlay: function (index) {
        switch (index) {
            case 0:
                this.anime.play();
                break;
            case 1:
                this.anime.pause();
                break;
            case 2:
                this.anime.resume();
                break;
        }
    },

    animePlayCallBack: function (name) {
        if (name == "Complete") {
            if (!!this.selfEntity) {
                this.selfEntity.isDead = true;
            }
        } else if (name == "Start") {

        } else if (name == "Process") {
            // let bmg=require('BattleManager').getInstance();
            // bmg.screenShake();
            // let collision = bmg.collision;
            // for (let i of EntityManager.getInstance().entityMonsterList) {
            //     let dmgMsg=collision.collisionMonsterWithHeroSkill(this.selfEntity);
            //     i.hitWithDamage(dmgMsg.dmg,true);
            //     if(i.isDead){
            //         i.setClearBulletWhenDead(true);
            //     }
            //     dmgMsg.pos = i.getPosition();
            //     i.flyDamageMsg(dmgMsg.dmg, dmgMsg.critical, dmgMsg.pos, true,true);
            //     //bmg.flyDamageMsg(dmgMsg.dmg, dmgMsg.critical, dmgMsg.pos, true,true);
            // }
            // EntityManager.getInstance().deleteAllMonsterBullets(true);
        }
    }
});