const BaseEntity = require('BaseEntity')
const Defines = require('BattleDefines')
const BattleManager = require('BattleManager')
const ScenarioManager = require('ScenarioManager')
const ResMapping = require("resmapping")
const GlobalVar = require('globalvar')
const weChatAPI = require("weChatAPI")

cc.Class({
    extends: BaseEntity,

    properties: {
        monsterID: 0,

        automaticSkill: false,
        curSkillAciton: 1,
        autoCurTime: 0,

        invincibleTime: 0,
        collisionSwitch: true,
        dropCrystal: true,
        deathShock: true,
        dropBuff: true,
        closeDeathBomb: false,
        canDrop: false,
        immediatelyKill: false,
        clearBulletWhenDead: false,
        isKill:true,

        monsterHpBar: null,

        deathType: 0,
        deathModeCallBack: null,

        flyCurTime: 0,
        flyMsgTime1: 0,
        flyMsgTime2: 0,
        flyMsgTime3: 0,
    },

    ctor() {
        //this.entityManager = require('EntityManager');
        //this.scenarioManager = require('ScenarioManager').getInstance();
        this.solution = require('BulletSolutions');
    },

    initEntity() {
        this._super();

        this.monsterID = 0;
        this.lv = 0;
        this.tbl = null;

        this.automaticSkill = false;
        this.curSkillAciton = 0;
        this.curSkillCD = -1;
        this.autoCurTime = 0;

        this.invincibleTime = 0;
        this.collisionSwitch = true;

        this.resetHover();
        this.setMonsterHpBar();
    },

    reset: function () {
        this._super();
        this.invincibleTime = 0;
        this.collisionSwitch = true;
        this.automaticSkill = false;
        this.dropCrystal = true;
        this.deathShock = true;
        this.closeDeathBomb = false;
        this.dropBuff = true;
        this.canDrop = false;
        this.immediatelyKill = false;
        this.clearBulletWhenDead = false;
        this.isKill=true;
        this.deathType = 0;
        this.deathModeCallBack = null;
        this.flyCurTime = 0;
        this.flyMsgTime1 = 0;
        this.flyMsgTime2 = 0;
        this.flyMsgTime3 = 0;
    },

    resetHover() {
        this.atrb.hover = {};
        this.atrb.hover.position = cc.v2(0, 0);
        this.atrb.hover.status = 0;
        this.atrb.hover.duration = 0;
        this.atrb.hover.range = 0;
        this.atrb.hover.ttl = 0;
    },

    update(dt) {
        this._super(dt);
        this.updateHover(dt);
        this.autoUseSkill(dt);

        if (this.invincibleTime > 0) {
            this.invincibleTime -= dt;
            if (this.invincibleTime < 0) {
                this.invincibleTime = 0;
            }
        }

        this.flyCurTime += dt;
    },

    updateHover(dt) {
        if (this.atrb.hover.status == 1 && this.atrb.hover.ttl-- <= 0) {
            let v = 8 * this.atrb.hover.range / this.atrb.hover.duration;

            this.setSpeed(cc.v2(0, v));
            this.setSpeedAcc(cc.v2(0, -4 * v / this.atrb.hover.duration));
            this.atrb.hover.ttl = Math.floor(this.atrb.hover.duration / 2 * Defines.BATTLE_FPS + 0.5);
            this.atrb.hover.status = 2;

        } else if (this.atrb.hover.status == 2 && this.atrb.hover.ttl-- <= 0) {
            let v = 8 * this.atrb.hover.range / this.atrb.hover.duration;

            this.setSpeed(cc.v2(0, -v));
            this.setSpeedAcc(cc.v2(0, 4 * v / this.atrb.hover.duration));
            this.atrb.hover.ttl = Math.ceil(this.atrb.hover.duration / 2 * Defines.BATTLE_FPS - 0.5);
            this.atrb.hover.status = 1;
        }
    },

    hover(range, duration) {
        if (range < 5) {
            return;
        }

        this.atrb.hover.range = range;
        this.atrb.hover.position = this.getPosition();
        this.atrb.hover.status = 1;
        this.atrb.hover.duration = duration;

        let v = 8 * range / duration;
        this.setSpeed(cc.v2(0, -v));
        this.setSpeedAcc(cc.v2(0, 4 * v / duration));
        this.atrb.hover.ttl = Math.floor(duration / 2 * Defines.BATTLE_FPS + 0.5);
    },

    hoverStop() {
        this.atrb.hover.status = 0;
    },

    autoUseSkill(dt) {
        if (this.automaticSkill && !this.isDead) {
            this.autoCurTime += dt;
            if (this.autoCurTime >= this.curSkillCD && this.automaticSkill) {
                this.autoCurTime = 0;
                if (this.tbl.strAction != '') {
                    let actArray = this.tbl.strAction.split("|");
                    if (this.curSkillAciton < actArray.length) {
                        let ai = require('AIInterface');
                        let steps = actArray[this.curSkillAciton].split(";");
                        ai.setMonsterLoopAction(this, steps[0]);
                        ai.playAction(this, steps[1], false);
                    }
                }
                this.useSkill(this.tbl.oVecSkillIDs[this.curSkillAciton]);
                this.curSkillAciton++;
                if (this.curSkillAciton >= this.tbl.oVecSkillIDs.length) {
                    this.curSkillAciton = 0;
                }
                this.autoSkillSwitch(this.automaticSkill, false);
            }
        }
    },

    autoSkillSwitch(open, immediately) {
        open = typeof open !== 'undefined' ? open : false;
        immediately = typeof immediately !== 'undefined' ? immediately : true;
        this.automaticSkill = open;
        if (open) {
            let tblSkill = GlobalVar.tblApi.getDataBySingleKey('TblBattleSkill', this.tbl.oVecSkillIDs[this.curSkillAciton]);
            if (!tblSkill) {
                this.curSkillCD = -1;
            } else {
                this.curSkillCD = tblSkill.dCD;
            }
            if (immediately) {
                this.autoCurTime = this.curSkillCD;
            } else {
                this.autoCurTime = 0;
            }
        } else {
            this.autoCurTime = 0;
        }
    },

    hitWithDamage: function (dmg,noSub) {
        noSub=typeof noSub!=='undefined'?noSub:true;
        if (this.invincibleTime <= 0) {
            if(!noSub){
                if (this.tbl.dwType >= 4 && dmg > this.maxHp * 0.01) {
                    dmg = this.maxHp * 0.01;
                }else if(this.tbl.dwType == 3 && dmg > this.maxHp * 0.02){
                    dmg = this.maxHp * 0.02;
                }else if(this.tbl.dwType == 2 && dmg > this.maxHp * 0.03){
                    dmg = this.maxHp * 0.03;
                }
            }
            this._super(dmg);
            if (this.tbl.dwType == 2 || this.tbl.dwType == 3) {
                if (this.hp < this.maxHp && this.monsterHpBar != null) {
                    this.monsterHpBar.active = true;
                    let percent = this.hp / this.maxHp;
                    this.monsterHpBar.getComponent(cc.ProgressBar).progress = percent;
                }
            }
            if (BattleManager.getInstance().isEndlessFlag) {
                ScenarioManager.getInstance().tryDropItem(1, this);
            }
            if (this.hp <= 0) {
                if (this.heroManager.planeEntity.state == 2) {
                    this.clearBulletWhenDead = true;
                }
                this.canDrop = true;
            }
        }else{
            return 0;
        }
        return dmg;
    },

    setMonster(monsterID, lv) {
        this.monsterID = monsterID;
        this.lv = lv;
        this.tbl = GlobalVar.tblApi.getDataBySingleKey('TblBattleMonster', monsterID);

        let level = 1;
        if (BattleManager.getInstance().isEndlessFlag) {
            level = 1;
        } else if (BattleManager.getInstance().isCampaignFlag) {
            level = 2;
        }

        let tblLvMonster = GlobalVar.tblApi.getDataByMultiKey('TblBattleLevelMonster', level, this.lv);
        if (!tblLvMonster) {
            tblLvMonster = GlobalVar.tblApi.getDataByMultiKey('TblBattleLevelMonster', this.tbl.dwLevelMonsterID, level == 1 ? 150 : 300);
            this.lv = level == 1 ? 150 : 300;
        }
        if (!tblLvMonster) {
            tblLvMonster = GlobalVar.tblApi.getDataByMultiKey('TblBattleLevelMonster', this.tbl.dwLevelMonsterID, level == 1 ? 150 : 300);
            this.lv = level == 1 ? 150 : 300;
        }
        if (tblLvMonster) {
            let tblProp = null;
            switch (this.tbl.dwType) {
                case 1:
                    tblProp = tblLvMonster.oVecAttribute1;
                    break;
                case 2:
                    tblProp = tblLvMonster.oVecAttribute2;
                    break;
                case 3:
                    tblProp = tblLvMonster.oVecAttribute3;
                    break;
                case 4:
                    tblProp = tblLvMonster.oVecAttribute4;
                    break;
                case 5:
                    tblProp = tblLvMonster.oVecAttribute5;
                    break;
                case 6:
                    tblProp = tblLvMonster.oVecAttribute6;
                    break;
            }
            if (tblProp) {
                for (let p of tblProp) {
                    this.prop[p.wKey] = p.dValue;
                }
            }
            this.maxHp = this.hp = this.prop[Defines.PropName.Life];
        }
        if (this.tbl.dwType == 4 || this.tbl.dwType == 5) {
            this.prop[Defines.PropName.CollisionDamage] = tblLvMonster.CollisionParam2;
            BattleManager.getInstance().setBossHpBar(this);
        } else {
            this.prop[Defines.PropName.CollisionDamage] = tblLvMonster.CollisionParam1;
        }

        this.setDeathType(this.tbl.byDeathMode);
    },

    newObject() {
        this.baseObject = this.poolManager.getInstance().getObject(Defines.PoolType.MONSTER, this.objectName);
        if (this.baseObject == null) {
            let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/Monster/' + this.objectName);
            if (prefab != null) {
                this.baseObject = cc.instantiate(prefab);
            }
        }
        if (this.baseObject != null) {
            this.addChild(this.baseObject, 1);
        } else {
            return -1;
        }
        if (this.tbl.oVecAnchorsPos.length == 2) {
            this.setAnchor(this.tbl.oVecAnchorsPos[0], this.tbl.oVecAnchorsPos[1]);
            //this.baseObject.setPosition(this.tbl.oVecAnchorsPos[0],this.tbl.oVecAnchorsPos[1]);
        }
        //this.setScale(this.tbl.dScale, this.scaleY < 0 ? -this.tbl.dScale : this.tbl.dScale);
        this.baseObject.setScale(this.tbl.dScale,this.baseObject.scaleY<0?-this.tbl.dScale : this.tbl.dScale);
        if (this.tbl.dwType == 2 || this.tbl.dwType == 3) {
            if (this.baseObject != null && this.monsterHpBar != null) {
                let size = this.getCollider().size;
                let offset = this.getCollider().offset;
                //let bar = this.monsterHpBar.getChildByName("bar");
                // if (size.width * 0.94 < bar.getContentSize().width) {
                //     bar.setContentSize(size.width * 0.94, bar.getContentSize().height);
                //     this.monsterHpBar.setContentSize(size.width, this.monsterHpBar.getContentSize().height);
                // }
                //bar.x = (-0.5 * bar.getContentSize().width);
                this.monsterHpBar.setPosition(0, this.baseObject.getPosition().y-0.5 * size.height);
                this.monsterHpBar.getComponent(cc.ProgressBar).progress = 1;
                //this.monsterHpBar.active=true;
            }
        } else {
            if (this.monsterHpBar != null) {
                this.monsterHpBar.active = false;
            }
        }
        let z = this._super();
        return z;
    },

    deleteObject: function () {
        //this.automaticSkill = false;
        let size = this.getCollider().size;
        this._super();
        if (this.tbl.strDieEffect != '' && !this.closeDeathBomb) {
            let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/' + this.tbl.strDieEffect);
            if (prefab != null) {
                let Bomb = cc.instantiate(prefab);
                let s = Math.max(Math.max(size.width / Bomb.width, size.height / Bomb.height), 1.5);
                Bomb.setScale(s);
                BattleManager.getInstance().displayContainer.addChild(Bomb, Defines.Z.KILL);
                Bomb.runAction(cc.sequence(cc.delayTime(0.4), cc.removeSelf(true)));
                Bomb.setPosition(this.getPosition());

                if (this.tbl.dwType >= 2 && this.tbl.dwType <= 6) {
                    GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/explode_boss');
                } else if(this.tbl.dwType == 1){
                    GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/explode_small');
                }
            }
        }

        if (this.tbl.dwType >= 2 && this.tbl.dwType <= 5 && this.dropCrystal && this.canDrop) {
            this.solution.solution_crystal(this.tbl.dwType, this.getPosition());
        }
        if (this.tbl.dwType >= 2 && this.tbl.dwType <= 6 && this.deathShock) {
            BattleManager.getInstance().screenShake(1);
            weChatAPI.deviceShock();
        }
    },

    flyDamageMsg(dmg, critical, pos, big, immediately) {
        immediately = typeof immediately !== 'undefined' ? immediately : false;
        if (dmg == 0) {
            if (this.flyCurTime - this.flyMsgTime1 >= 0.1 || immediately) {
                var self = this;
                GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/battle/_text_resist', function (frame) {
                    let node = new cc.Node();
                    let sp = node.addComponent(cc.Sprite);
                    sp.spriteFrame = frame;
                    node.scale = 1.0;
                    node.opacity = 230;
                    node.setPosition(pos);
                    BattleManager.getInstance().displayContainer.addChild(node, Defines.Z.FLYDAMAGEMSG);
                    self.flyFadeAction(node, critical, big);
                });
                if (!immediately) {
                    this.flyMsgTime1 = this.flyCurTime;
                }
            }
        } else {
            if (critical) {
                if (this.flyCurTime - this.flyMsgTime3 >= 0.1 || immediately) {
                    var self = this;
                    GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/FlyDamageMsgCritical', function (prefab) {
                        if (prefab != null) {
                            let node = cc.instantiate(prefab);
                            let lbl = node.getComponent(cc.Label);
                            lbl.string = dmg;
                            node.setPosition(pos);
                            BattleManager.getInstance().displayContainer.addChild(node, Defines.Z.FLYDAMAGEMSG);
                            self.flyFadeAction(node, critical, big);
                        }
                    });
                }
                if (!immediately) {
                    this.flyMsgTime3 = this.flyCurTime;
                }
            } else {
                if (this.flyCurTime - this.flyMsgTime2 >= 0.1 || immediately) {
                    var self = this;
                    GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/FlyDamageMsg', function (prefab) {
                        if (prefab != null) {
                            let node = cc.instantiate(prefab);
                            let lbl = node.getComponent(cc.Label);
                            lbl.string = dmg;
                            node.setPosition(pos);
                            BattleManager.getInstance().displayContainer.addChild(node, Defines.Z.FLYDAMAGEMSG);
                            self.flyFadeAction(node, critical, big);
                        }
                    });
                    if (!immediately) {
                        this.flyMsgTime2 = this.flyCurTime;
                    }
                }
            }


        }
    },

    flyFadeAction(node, critical, big) {
        let oldPos = node.getPosition();

        let exScale = 1.6;

        if (big) {
            exScale = 2.1;
        }

        if (critical) {
            node.scale = 0.0;
        } else {
            node.scale = exScale;
        }

        let scaleLarge = cc.scaleTo(0.1 * exScale, 2.5 * exScale);
        let scaleSmall = cc.scaleTo(0.08 * exScale, 0.5 * exScale);
        let scaleBack = cc.scaleTo(0.08 * exScale, exScale);
        let seq = cc.sequence(scaleLarge, scaleSmall, scaleBack);

        let move = cc.moveTo(0.6, oldPos.add(cc.v2(20, 50)));
        let fadeOut = cc.fadeOut(0.6);
        let spawn = cc.spawn(move, fadeOut);

        let tSeq = null;
        if (critical) {
            tSeq = cc.sequence(seq, spawn);
        } else {
            tSeq = spawn;
        }
        node.runAction(cc.sequence(tSeq, cc.removeSelf(true)));
    },


    deathMode: function (callback) {
        if (this.monsterHpBar != null) {
            this.monsterHpBar.active = false;
        }
        this.collisionSwitch = false;
        switch (this.deathType) {
            case 0:
                if (!!callback) {
                    callback(this);
                }
                break;
            case 1:
                if (!!callback) {
                    this.deathModeCallBack = callback;
                }
                this.createBombAnime(this.getPosition());
                break;
            case 2:
                if (!!callback) {
                    this.createRotatoScaleAnime(callback);
                }
                break;
        }
    },

    createBombAnime: function (pos) {
        BattleManager.getInstance().endGameAnimeCount = 0;
        let size = BattleManager.getInstance().displayContainer.getContentSize();
        pos = typeof pos !== 'undefined' ? pos : cc.v2(0.5 * size.width, 0.5 * size.height);
        var self = this;
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/lBomb', function (prefab) {
            let bomb = cc.instantiate(prefab);
            BattleManager.getInstance().displayContainer.addChild(bomb, 20, '555');
            bomb.setPosition(pos);
            self.endCount = 7;
            self.playBombAnime();
        });
    },
    playBombAnime: function () {
        let bomb = BattleManager.getInstance().displayContainer.getChildByName('555');
        bomb.setPosition(this.getPosition().add(cc.v2((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200)));
        bomb.getComponent(cc.Animation).play();
        GlobalVar.soundManager().playEffect('cdnRes/audio/battle/effect/explode_boss');

        this.endCount--;
        if (this.endCount >= 0) {
            setTimeout(this.playBombAnime.bind(this), 350);
        } else {
            bomb.destroy();
            if (!!this.deathModeCallBack) {
                this.deathModeCallBack(this);
            }
            BattleManager.getInstance().endGameAnimeCount--;
        }
    },
    createRotatoScaleAnime: function (callback) {
        var action = cc.spawn(cc.scaleTo(1, 0.8), cc.rotateBy(1, 720));
        var self = this;
        this.runAction(cc.sequence(action, cc.callFunc(function () {
            callback(self);
        })));
    },

    setMonsterHpBar: function () {
        if (this.monsterHpBar == null) {
            var self=this;
            GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/MonsterHp',function(prefab){
                if (prefab != null) {
                    self.monsterHpBar = cc.instantiate(prefab);
                    self.addChild(self.monsterHpBar, 5);
                    self.monsterHpBar.active = false;
                }
            });
        }
    },

    checkOut: function (dt) {
        this.curtime += dt;
        let pos = this.getPosition();

        let size = BattleManager.getInstance().displayContainer.getContentSize()

        if (BattleManager.getInstance().allScreen) {
            size.height -= 130;
        } else {
            size.height -= 47;
        }

        if (this.isShow) {
            if (pos.y > size.height + Defines.OUT_SIDE || pos.x < -Defines.OUT_SIDE || pos.y < -Defines.OUT_SIDE || pos.x > size.width + Defines.OUT_SIDE) {
                if (!this.hold) {
                    this.isDead = true;
                    this.deathShock = false;
                    this.closeDeathBomb=true;
                } else {
                    this.isShow = false;
                }
            }
        } else {
            if (pos.y < size.height && pos.x > 0 && pos.y > 0 && pos.x < size.width) {
                this.isShow = true;
            }
            if (this.curtime >= 1.44) {
                this.isShow = true;
            }
            if (pos.y > size.height + Defines.FORCE_DESTORY || pos.y < -Defines.FORCE_DESTORY || pos.x > size.width + Defines.FORCE_DESTORY || pos.x < -Defines.FORCE_DESTORY) {
                if (!this.hold) {
                    this.isShow = true;
                    this.isDead = true;
                    this.deathShock = false;
                    this.closeDeathBomb=true;
                }
            }
        }
    },

    setCollisionSwitch: function (open) {
        this.collisionSwitch = typeof open !== 'undefined' ? open : true;
    },

    getCollisionSwitch: function (open) {
        return this.collisionSwitch;
    },

    getShow: function () {
        return this.isShow;
    },

    addInvincibleTime: function (second) {
        this.invincibleTime = typeof second !== 'undefined' ? second : 0;
    },

    getCurHpPer: function () {
        if (this.maxHp != 0) {
            return Math.floor(this.hp / this.maxHp * 100);
        } else {
            return 0;
        }
    },

    setDropCrystal: function (drop) {
        this.dropCrystal = typeof drop !== 'undefined' ? drop : true;
    },
    getDropCrystal: function () {
        return this.dropCrystal;
    },

    setDeathShock: function (shock) {
        this.deathShock = typeof shock !== 'undefined' ? shock : true;
    },
    getDeathShock: function () {
        return this.deathShock;
    },

    setDropBuff: function (drop) {
        this.dropBuff = typeof drop !== 'undefined' ? drop : true;
    },
    getDropBuff: function () {
        return this.dropBuff;
    },

    setCloseDeathBomb: function (close) {
        this.closeDeathBomb = typeof close !== 'undefined' ? close : false;
    },
    getCloseDeathBomb: function () {
        return this.closeDeathBomb;
    },

    setKill: function (kill) {
        this.immediatelyKill = typeof kill !== 'undefined' ? kill : false;
    },
    getKill: function () {
        return this.immediatelyKill;
    },

    setClearBulletWhenDead: function (clear) {
        this.clearBulletWhenDead = typeof clear !== 'undefined' ? clear : false;
    },
    getClearBulletWHenDead: function () {
        return this.clearBulletWhenDead;
    },

    setDeathType: function (type) {
        this.deathType = typeof type !== 'undefined' ? type : 0;
    },
    getDeathType: function () {
        return this.deathType;
    },

    setIsKill:function(not){
        this.isKill=typeof not !=='undefined'?not:true;
    },
});