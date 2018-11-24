const Defines = require('BattleDefines');
const GlobalVar = require('globalvar');
const ResMapping = require("resmapping");
const BattleManager = require('BattleManager');
const BM = require('BulletMapping');
var ShaderUtils = require("ShaderUtils");
const weChatAPI = require("weChatAPI");

var FighterState = cc.Enum({
    StandingBy: 0,
    Normal: 1,
    Crazy: 2,
});

cc.Class({
    extends: cc.Node,

    ctor: function () {
        this.objectName = '';
        this.objectType = Defines.ObjectType.OBJ_INVALID;
        this.partObject = null;
        this.part = null;

        this.prop = [];
        for (let i = Defines.PropName.Life; i < Defines.PropName.Count; ++i) {
            this.prop.push(0);
        }

        this.lv = 1;

        this.hp = this.maxHp = this.prop[Defines.PropName.Life];

        this.lastCrazyCount = Defines.CRAZYCOUNT;
        this.lastSkillTime = 0;
        this.skillCD = Defines.SKILLCD;
        this.skillLevel = 0;
        this.state = FighterState.StandingBy;
        this.protectTime = 0;
        this.invincibleTime = 0;

        this.partData = {};
        this.partData.status = 0;
        this.partData.skillIDs = [];

        this.showType = 0;

        this.side = 0;
        this.pos = 0;

        this.shader=false;
        this.shaderRender=null;
        this.shaderStartTime=0;

        //this.motionNode=null;
    },

    reset: function () {
        this.lv = 1;
        this.hp = this.maxHp = this.prop[Defines.PropName.Life];
        this.lastCrazyCount = Defines.CRAZYCOUNT;
        this.lastSkillTime = 0;
        this.skillCD = 5;
        this.skillLevel = 0;
        this.state = FighterState.StandingBy;
        this.protectTime = 0;
        this.invincibleTime = 0;
    },

    getPart: function () {
        return this.part;
    },

    newPart: function (objectName, objectType, objectClass, showType, side, pos) {

        this.objectName = typeof objectName !== 'undefined' ? objectName : '';
        this.objectType = typeof objectType !== 'undefined' ? objectType : Defines.ObjectType.OBJ_INVALID;
        this.objectClass = typeof objectClass !== 'undefined' ? objectClass : '';
        this.side = typeof side !== 'undefined' ? side : 0;
        this.pos = typeof pos !== 'undefined' ? pos : 0;
        this.showType = typeof showType !== 'undefined' ? showType : 0;

        if (this.objectName == '' || this.objectType == Defines.ObjectType.OBJ_INVALID) {
            return false;
        }

        if (this.objectType == Defines.ObjectType.OBJ_HERO || this.objectType == Defines.ObjectType.OBJ_WINGMAN) {
            let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/' + objectName);
            if (prefab != null) {
                this.partObject = cc.instantiate(prefab);
                this.part = this.partObject.getComponent(this.objectClass);
                this.part.setObjectType(this.objectType);
                this.part.setDisPlayLoop(this.showType);
                this.addChild(this.partObject);
                if (this.objectType == Defines.ObjectType.OBJ_HERO) {
                    let index = objectName.lastIndexOf('_');
                    let id = objectName.substring(index + 1, objectName.length);
                    
                    this.partObject.setPosition(cc.v2(0, -65));
                    if(id=='710'){
                        this.partObject.setPosition(cc.v2(0, -35));
                    }
                    // if(id=='1810'){
                    //     this.partObject.setPosition(cc.v2(0, -65));
                    // }
                    // if(id=='1820'){
                    //     this.partObject.setPosition(cc.v2(0, -65));
                    // }
                }

                this.shaderRender=this.part.getSpine();

                if(this.objectType==Defines.ObjectType.OBJ_HERO && this.showType==0){
                    this.addMotionStreak('huoyan');
                }
            } else {
                return false;
            }
            return true;
        } else if (this.objectType == Defines.ObjectType.OBJ_ASSIST) {
            let itemData= GlobalVar.tblApi.getDataBySingleKey('TblItem', objectName);
            let path='';
            if(itemData.byColor!=6){
                path='cdnRes/itemicon/'+itemData.byType+'/'+itemData.byColor+'/'+objectName;
            }else{
                path='cdnRes/itemicon/'+itemData.byType+'/5/'+objectName;
            }
            this.partObject = new cc.Node();
            let sp = this.partObject.addComponent(cc.Sprite);
            sp.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, path);
            //sp.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/itemicon/' + objectName);
            this.addChild(this.partObject);
            this.shaderRender=sp;
        }
        return false;
    },

    setSkillIDs: function (arrayIDs) {
        this.partData.status = 1;
        this.partData.skillIDs = arrayIDs;
    },

    pauseAction() {
        if (this.partObject != null) {
            let spine = this.partObject.getComponent(sp.Skeleton);
            if (spine != null) {
                spine.paused = true;
            }
        }
    },

    resumeAction() {
        if (this.partObject != null) {
            let spine = this.partObject.getComponent(sp.Skeleton);
            if (spine != null) {
                spine.paused = false;
            }
        }
    },

    getCollider: function () {
        return this.partObject.getComponent(cc.BoxCollider);
    },

    getPointCollider:function(){
        if(this.partObject!=null & cc.isValid(this.partObject)){
            return this.partObject.getChildByName('point').getComponent(cc.BoxCollider);
        }
        return null;
    },

    openShader: function (open) {
        if(this.shaderRender==null){
            this.shader = false;
            this.shaderStartTime = 0;
            return;
        }

        this.shader = typeof open !== 'undefined' ? open : false;
        if (this.shader) {
            this.shaderStartTime = Date.now()-5000;
        }else{
            this.shaderStartTime = 0;
        }
    },

    update(dt) {
        if (!this.partObject) {
            return;
        }

        if (this.shader && !!this.shaderRender) {
            let time = (Date.now() - this.shaderStartTime) / 1000;
            ShaderUtils.setShader(this.shaderRender, "projective", time);
        }

        if (BattleManager.getInstance().isEditorFlag) {
            return;
        }

        if (this.showType == 0) {
            if (this.invincibleTime > 0) {
                this.invincibleTime -= dt;
            }
            if (this.protectTime > 0) {
                this.protectTime -= dt;
            }
            if (this.lastSkillTime <= 0) {
                if (this.skillLevel <= this.partData.skillIDs.length - 2 || this.partData.skillIDs.length <= 1) {
                    this.useNormalBullet();
                } else {
                    if (this.state == FighterState.Crazy && this.lastCrazyCount <= 0) {
                        this.skillLevelDown();
                    } else {
                        this.useSuperBullet();
                        this.lastCrazyCount--;
                    }
                }
            }
            this.lastSkillTime -= dt;
        }
    },

    useNormalBullet() {
        if (BattleManager.getInstance().isEditorFlag) {
            return;
        }

        if (this.state == FighterState.StandingBy && this.part != null) {
            this.part.transform();
        } else if (this.state == FighterState.Crazy && this.part != null) {
            this.part.crazyEnd();
        }

        this.state = FighterState.Normal;

        if (this.partData.status == 1) {
            let id = this.partData.skillIDs[this.skillLevel];
            let cd = this.useSkill(id);
            if (cd != -1) {
                this.lastSkillTime = this.skillCD = cd;
            }
        }
    },

    useSuperBullet() {
        if (BattleManager.getInstance().isEditorFlag) {
            return;
        }

        if (this.state == FighterState.Normal && this.part != null) {
            if(this.objectName.indexOf('Fighter/Fighter_')!=-1 && this.showType == 0){
                GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/baozou');
            }
            this.part.crazyStart();
        }

        this.state = FighterState.Crazy;

        if (this.partData.status == 1) {
            let id = this.partData.skillIDs[this.skillLevel];
            let cd = this.useSkill(id);
            if (cd != -1) {
                this.lastSkillTime = this.skillCD = cd;
            }
            return cd;
        }
        return -1;
    },

    useSkill(id) {
        let tblSkill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', id);
        if (!!tblSkill) {
            let func = BM.getSolution(tblSkill.dwSolution);
            if (!!func) {
                func(this, tblSkill.oVecBulletIDs);
                return tblSkill.dCD;
            } else {
                return -1;
            }
        }
        return -1;
    },

    skillLevelUp(plus) {
        let sl = this.partData.skillIDs.length;
        this.skillLevel = Math.min(sl - 1, this.skillLevel + plus);
        if (this.skillLevel < sl - 1 || this.skillLevel==0 && sl==1) {
            this.useNormalBullet();
        } else {
            let cd = this.useSuperBullet();
            this.lastCrazyCount = Defines.CRAZYCOUNT / cd + 1;
        }
    },

    skillLevelDown(minus) {
        if (this.skillLevel > 0) {
            if (typeof minus !== 'undefined') {
                this.skillLevel -= minus;
                this.skillLevel = this.skillLevel >= 0 ? this.skillLevel : 0;
            } else {
                --this.skillLevel;
            }
            this.useNormalBullet();
            this.lastCrazyCount = 0;
        }
    },

    addProtectTime(time) {
        this.protectTime = time;
    },

    addHP(plus) {
        plus = typeof plus !== 'undefined' ? plus : this.maxHp * 0.3;
        this.hp = Math.min(this.maxHp, this.hp + plus);
    },

    hitWithDamage(dmg,immediately) {
        immediately=typeof immediately!=='undefined'?immediately:false;
        
        if (this.invincibleTime > 0) {
            return;
        }

        if (this.protectTime > 0) {
            return;
        }

        if(immediately){
            this.hp = 0;
            // if (this.objectType == Defines.ObjectType.OBJ_HERO) {
            //     BattleManager.getInstance().result = 0;
            //     BattleManager.getInstance().gameState = Defines.GameResult.END;
            // }
            return;
        }

        // if (this.state == FighterState.Crazy) {
        //     return;
        // }

        //weChatAPI.deviceShock();
        BattleManager.getInstance().screenShake(1);

        this.invincibleTime = Defines.INVINCIBLE_TIME;
        this.runHurtEffect();

        if (this.hp > dmg) {
            this.hp -= dmg;
            require('HeroManager').getInstance().skillLevelDown();
        } else {
            this.hp = 0;
            // if (this.objectType == Defines.ObjectType.OBJ_HERO) {
            //     BattleManager.getInstance().result = 0;
            //     BattleManager.getInstance().gameState = Defines.GameResult.END;
            // }
        }
    },

    runHurtEffect() {
        let act = cc.sequence(cc.fadeTo(0.2, 64), cc.fadeTo(0.2, 255));
        this.runAction(cc.sequence(act.clone(), act.clone(), act.clone(), act.clone()));
    },

    addMotionStreak: function (res,color, fadeTime, minSeg, stroke, fastMode) {
        //if (this.motionNode == null) {
            res=typeof res!=='undefined'?res:'huoyan';
            let motionNode = this.addComponent(cc.MotionStreak);
            var self=this;
            GlobalVar.resManager().loadRes(ResMapping.ResType.Texture2D,'cdnRes/battlemodel/motionstreak/'+res, function (tex) {
                motionNode.texture=tex;
            });
            motionNode.fadeTime = typeof fadeTime !== 'undefined' ? fadeTime : 0.5;
            motionNode.minSeg = typeof minSeg !== 'undefined' ? minSeg : 1;
            motionNode.stroke = typeof stroke !== 'undefined' ? stroke : 30;
            motionNode.fastMode = typeof fastMode !== 'undefined' ? fastMode : false;
            motionNode.color = typeof color !== 'undefined' ? color : new cc.Color(255, 255, 255);
        //}
    },

    flyIntoScreen(callback) {
        GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/leave_battle');
        var self=this;
        if (!!callback) {
            this.runAction(
                cc.sequence(
                    cc.moveBy(1.0, cc.v2(0, 0.7 * cc.winSize.height)),
                    cc.callFunc(function(){
                        self.removeComponent(cc.MotionStreak);
                    }),
                    cc.moveBy(0.5, cc.v2(0, -0.3 * cc.winSize.height)),
                    cc.callFunc(callback)
                )
            );
        } else {
            this.runAction(
                cc.sequence(
                    cc.moveBy(1.0, cc.v2(0, 0.7 * cc.winSize.height)),
                    cc.callFunc(function(){
                        self.removeComponent(cc.MotionStreak);
                    }),
                    cc.moveBy(0.5, cc.v2(0, -0.3 * cc.winSize.height))
                )
            );
        }
    },

    flyOutOffScreen(callback) {
        if(this.objectType==Defines.ObjectType.OBJ_HERO && this.showType==0){
            this.addMotionStreak('huoyan');
            GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/leave_battle');
        }
        if (!!callback) {
            this.runAction(
                cc.sequence(
                    cc.delayTime(0.6),
                    cc.moveBy(1, cc.v2(0, cc.winSize.height)),
                    cc.callFunc(callback)
                )
            );
        } else {
            this.runAction(
                cc.sequence(
                    cc.delayTime(0.6),
                    cc.moveBy(1, cc.v2(0, cc.winSize.height)),
                )
            );
        }
    },

    selfDestroy: function (callback) {
        if (!!callback) {
            this.runAction(
                cc.sequence(
                    cc.delayTime(0.05),
                    cc.callFunc(callback),
                    cc.removeSelf(true),
                )
            );
        } else {
            this.runAction(
                cc.sequence(
                    cc.delayTime(0.05),
                    cc.removeSelf(true),
                )
            );
        }
    },
});