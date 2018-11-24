const GlobalVar = require("globalvar");
const config = require("config");
const BattleManager = require('BattleManager');
const Defines = require('BattleDefines');

var self = null;
var buttonArray = [
    '',
    '',
    'btnoCharpter',
    'spritePlanetModel0',
    'btnStartBattle',
    '',
    '',
    '',
    '',
    '',
    'button',//10
    'btnoGuazai',
    'nodeTouzhi',
    'ItemObject',
    'button',
    'btnoCharpter',//15
    'spritePlanetModel1',
    'btnStartBattle',
    'btnoSkill',//18
    '',
    '',
    'button',//21
    'btnoEquipment',
    'btnLevelUpOne',
    'btnoAdvance',
    'btnQualityUp',
    'button',//26
    'btnoCharpter',
    'spritePlanetModel2',
    'btnStartBattle',
    '',
    'button',//31
    'btnoPlane',
    'btnoAdvance',
    'btnoLevelUp',
    'button',
    'button',
    'btnoCharpter',
    'spritePlanetModel3',
    'btnStartBattle',//39
    '',
    '',
    '',
    '',
];
var labelArray = [
    '亲爱的指挥官,我是娜娜,欢迎来到我们的世界,请激活您的第一架战机',
    '',
    '点击闯关,让我们开始第一次旅程',
    '点击第一关,让敌人看看我们的实力!',
    '',
    '滑动战机,可进行移动',
    '战斗中会掉落这些道具',
    '子弹只有击中中心点时战机的生命值才会减少',
    '',
    '',
    '点击返回,我们去装备投掷炸弹',//10
    '获得了新的投掷炸弹，点击挂载',
    '',
    '点击装备投掷炸弹',
    '',
    '已经装备了投掷炸弹,让我们继续冒险',//15
    '',
    '',
    '释放【投掷】炸弹,可以清除全屏子弹,产生巨大威力',//18
    '',
    '',
    '获得了新装备,现在去配置装备',//21
    '',
    '',
    '',
    '',
    '强化成功，让我们开始下一场战斗',//26
    '',
    '',
    '',
    '',
    '现在，我们去升级战机',//31
    '',
    '',
    '',
    '战机升级成功，战力提升，现在去完成最后的考验。',
    '',
    '',
    '',
    '',
    '',
    '你已经成功通过了考验,是一名合格的指挥官了,加油,暴风要塞的未来就靠你了!',//41
    '',
    '',
    '',
    '',
    '',
    ''
];
var dialoguePosArray = [-200, 0, 0, 150, 150, 50, -200, -200, -200, -200, 30,
    150, 150, -200, -200, 0, 0, 0, 150, 150, 150,
    0, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const guide = cc.Class({
    extends: cc.Component,
    statics: {
        instance: null,
        getInstance: function () {
            if (guide.instance == null) {
                guide.instance = new guide();
            }
            return guide.instance;
        },
        destroyInstance() {
            if (guide.instance != null) {
                delete guide.instance;
                guide.instance = null;
            }
        }
    },

    ctor: function () {
        self = this;
        self.id = 0;
        self.step = 0;
        self.mapLoop = false;
        self.watchBlt = false;
    },

    enter: function () {
        var level = GlobalVar.me().getLevel();
        // config.NEED_GUIDE = false;
        if (level > 1 && self.id == 0)
            config.NEED_GUIDE = false;
        if (config.NEED_GUIDE) {
            this.enterMain();
        }
    },

    enterMain: function () {
        self.getSprite(0);
        self.id++;
        self.doNextStep();
    },

    getSprite: function (scenetype) {
        if (scenetype == 1) {
            self.introductionSprite = cc.find('Canvas/GuideNode/Introductions');
        }
        self.continueSprite = cc.find('Canvas/GuideNode/continue');
        self.continueSprite.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.7))));
        self.guideNode = cc.find('Canvas/GuideNode');
        self.maskSprite = cc.find('Canvas/GuideNode/GuideMask');
        self.fighterSprite = cc.find('Canvas/GuideNode/fighter');
        self.fingerSprite = cc.find('Canvas/GuideNode/finger');
        self.dialogueSprite = cc.find('Canvas/GuideNode/dialogue');
    },

    enterBattle: function () {
        self.getSprite(1);
        if (self.step == 5) {
            BattleManager.getInstance().gameState = Defines.GameResult.PAUSE;
            self.mapLoop = true;
            self.doNextStep();
        } else if (self.step == 18) {
            self.btnoSkill = self.seekNodeByName("btnoSkill");
            self.btnoSkill.active = false;
            self.scheduleOnce(() => {
                BattleManager.getInstance().gameState = Defines.GameResult.PAUSE;
                self.doNextStep();
            }, 4);
        } else if (self.step == 30 || self.step == 41) {
            self.guideNode.active = false;
        }
    },

    escape: function () {
        //var GuideNode = cc.find('Canvas/GuideNode');
        //self.window.destroy();
        // self.btnClone.destroy();
    },

    doNextStep: function () {
        self.initNode();
        setTimeout(() => {
            cc.log(self.step);
            self.showBtn();
        }, 100);
    },

    clickBtn: function (clickBtnName) {
        if (!config.NEED_GUIDE)
            return;
        var scenetype = GlobalVar.sceneManager().getCurrentSceneType();
        if (scenetype != 4 && scenetype != 5) return;
        if (clickBtnName == 'btnoPause') {
            cc.director.getScheduler().pauseTarget(self);
            return;
        } else if (clickBtnName == 'btnRecv') {
            self.step++;
            return;
        } else if (clickBtnName == 'btnoContinue') {
            setTimeout(() => {
                cc.director.getScheduler().resumeTarget(self);
            }, 3000);
            return;
        } else if ((clickBtnName == 'ItemObject' && self.step != 13) || clickBtnName == 'btnoSkill' || clickBtnName =='btnoAssist') return;

        var cbtn = cc.find('Canvas/GuideNode/btnClone');
        if (!!cbtn) {
            setTimeout(() => {
                cbtn.removeFromParent();
            }, 10);
            self.fingerSprite.actie = false;
        }
        if (self.step == 5 || self.step == 18 || self.step == 30 || self.step == 40) {
            return;
        } else if (self.step == 6) {
            BattleManager.getInstance().gameState = Defines.GameResult.RUNNING;
            self.mapLoop = false;
            self.scheduleOnce(() => {
                BattleManager.getInstance().gameState = Defines.GameResult.PAUSE;
                self.doNextStep();
            }, 5);
            return;
        } else if (self.step == 7) {
            BattleManager.getInstance().gameState = Defines.GameResult.RUNNING;
            self.scheduleOnce(() => {
                self.watchBlt = true;
            }, 4);
            return;
        } else if (self.step == 8) {
            BattleManager.getInstance().gameState = Defines.GameResult.RUNNING;
            self.step++;
            return;
        } else if (self.step == 19) {
            self.guideNode.active = false;
            BattleManager.getInstance().gameState = Defines.GameResult.RUNNING;
            self.btnoSkill.active = true;
            self.btnoSkill.x = -257.5;
            cc.find('Canvas/UINode/UIBattle').getComponent('UIBattle').onSkillClick();
            self.step++;
            return;
        } else if (self.step == 24 || self.step == 26) {
            self.maskSprite.opacity = 0;
            setTimeout(() => {
                self.maskSprite.opacity = 150;
                self.doNextStep();
            }, 3000);
            return;
        }

        self.doNextStep();
    },

    showLabel: function () {
        if (!self.dialogueSprite) return;
        var text = self.dialogueSprite.getChildByName('text');
        if (!text) return;
        var step = self.step;
        text.getComponent(cc.Label).string = labelArray[step];
        self.dialogueSprite.y = dialoguePosArray[step];

        self.dialogueSprite.active = labelArray[step] != '';
        self.dialogueSprite.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeIn(0.5)));
    },

    showSprite: function () {
        if (!self.fighterSprite || !self.fingerSprite) return;
        self.fingerSprite.zIndex = 100;
        var step = self.step;

        var touchStart = function () {
            self.guideNode.active = false;
            self.clickBtn();
        }
        // self.guideNode.active = true;
        //maskSprite
        if (step == 1) {
            self.maskSprite.active = false;
        } else if (step == 5) {
            self.maskSprite.active = true;
            self.maskSprite.opacity = 0;
        } else {
            self.maskSprite.active = true;
            self.maskSprite.opacity = 150;
        }
        if (step == 5 || step == 6 || step == 7) {
            self.maskSprite.once('touchend', touchStart, self);
        }

        //fighterSprite
        if (step == 0) {
            self.fighterSprite.active = true;
            self.fighterSprite.getComponent('PlaneObject').setDisPlayLoop(2);
        } else if (step == 5) {
            setTimeout(() => {
                self.fighterSprite.active = true;
            }, 1000);
        } else if (step == 7) {
            self.fighterSprite.active = true;
            self.fighterSprite.children[0].active = true;
            self.fighterSprite.children[1].active = false;
            self.fighterSprite.children[2].active = false;
            self.fighterSprite.scale = 2;
        } else {
            self.fighterSprite.active = false;
        }

        //fingerSprite
        if (step == 1 || step == 6 || step == 7 || step == 41) {
            // self.fingerSprite.active = false;
        } else {
            self.fingerSprite.opacity = 0;
            self.fingerSprite.active = true;
            self.fingerSprite.runAction(cc.sequence(cc.delayTime(1), cc.fadeIn(0.5)));
            if (step == 5) {
                self.fingerSprite.getComponent(cc.Animation).play('animeFinger2');
            } else {
                self.fingerSprite.getComponent(cc.Animation).play();
            }
        }

        //continueSprite
        if (step == 6 || step == 7 || step == 41) {
            self.continueSprite.active = true;
        } else {
            self.continueSprite.active = false;
        }

        //introductionSprite
        if (step == 6) {
            self.introductionSprite.opacity = 0;
            self.introductionSprite.active = true;
            self.introductionSprite.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeIn(0.5)));
        }

        //else
        if (step == 18) {
            self.btnClone.once('touchend', touchStart, self);
        }
        else if (step == 34) {
            setTimeout(() => {
                self.btnClone.once('touchstart', function () {
                    self.seekNodeByName('NormalEquipment').getComponent('NormalEquipment').levelUp();
                    self.clickBtn();
                }, self);
            }, 500);
        }

        if (step == 41) {
            var over = function () {
                self.guideNode.active = false;
                config.NEED_GUIDE = false;
            }
            self.maskSprite.once('touchend', over, self);
        }

        if (!!this.seekNodeByName('MaskBack'))
            this.seekNodeByName("MaskBack").active = false;
    },

    showBtn: function () {
        var step = self.step;
        self.cloneBtn(buttonArray[step]);

        if (step == 0) {
            var RecvCallback = function () {
                let WindowManager = require("windowmgr");
                WindowManager.getInstance().popView(false, null, false);
            }
            var callback = function () {
                let CommonWnd = require("CommonWnd");
                CommonWnd.showGetNewRareItemWnd(null, 0, 2, RecvCallback);
                self.cloneBtn('btnRecv');
            }
            cc.find('Canvas/GuideNode/fighter/btn_active').once('touchend', callback, this);
        }
    },

    cloneBtn: function (nodename) {
        if (self.step == 0 || self.step == 5 || self.step == 6 || self.step == 7 || self.step == 42) {
            self.showLabel();
            self.showSprite();
            self.step++;
        } else if (self.step==9||self.step == 20||self.step==30||self.step==40) {
            // self.step++;
        }
        if (nodename == '') return;
        var btn = self.seekNodeByName(nodename);
        if (btn == null) {
            setTimeout(() => {
                self.cloneBtn(nodename);
            }, 300);
            return;
        }

        self.showLabel();
        self.showSprite();

        self.btnClone = cc.instantiate(btn);
        self.guideNode.addChild(self.btnClone);
        self.btnClone.name = 'btnClone';
        self.btnClone.active = false;

        setTimeout(() => {
            self.btnClone.active = true;
            var pos0 = btn.parent.convertToWorldSpaceAR(btn);
            var pos1 = self.guideNode.convertToNodeSpaceAR(pos0);
            self.btnClone.setPosition(pos1);
            self.fingerSprite.setPosition(pos1);
            if (nodename == 'btnoSkill') {
                self.fingerSprite.setPosition(cc.v2(-257.5, pos1.y));
                self.btnClone.runAction(cc.sequence(cc.moveTo(0, cc.v2(-382.5, pos1.y)), cc.moveTo(0.2, cc.v2(-257.5, pos1.y))));
            }
        }, 300);

        for (const key in btn) {
            if (!self.btnClone.hasOwnProperty(key) && btn.hasOwnProperty(key)) {
                self.btnClone[key] = btn[key];
            }
        }
        // var objDeepCopy = function (source) {
        //     var sourceCopy = {};
        //     for (var item in source)
        //         sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
        //     return sourceCopy;
        // }
        // self.btnClone = objDeepCopy(btn);

        if (nodename.indexOf('spritePlanetModel') != -1) {
            var anime = self.seekNodeByName(self.btnClone, 'nodeSeletedAnimeModel');
            if (anime) {
                anime.getChildByName("spriteCircleAnime1").runAction(cc.repeatForever(cc.rotateBy(4, 360)));
                anime.getChildByName("spriteCircleAnime2").runAction(cc.repeatForever(cc.rotateBy(4, -360)));
                anime.getChildByName("spriteCircleAnime3").runAction(cc.repeatForever(cc.rotateBy(4, 360)));
            }
        }

        if (self.step == 13) {
            let path = 'cdnRes/itemicon/53/5/32460';
            self.btnClone.getChildByName('spriteItemIcon').getComponent("RemoteSprite").loadFrameFromLocalRes(path);
        }

        self.step++;
    },

    showQuit: function (target) {
        if (config.NEED_GUIDE) {
            target.node.getChildByName('btnoGiveUp').active = false;
            cc.director.getScheduler().pauseTarget(self);
        }
    },

    initNode: function () {
        self.guideNode.active = true;
        self.maskSprite.active = true;
        self.fighterSprite.active = false;
        self.dialogueSprite.active = false;
        self.dialogueSprite.opacity = 0;
        self.fingerSprite.active = false;
        self.fingerSprite.opacity = 0;
        if (!!self.introductionSprite) {
            self.introductionSprite.active = false;
        }
        if (!!this.seekNodeByName('MaskBack'))
            this.seekNodeByName("MaskBack").active = false;
    },

    seekNodeByName: function (root, name) {
        if (!root) {
            return null;
        }
        if (typeof name == 'undefined') {
            name = root;
            root = cc.find('Canvas');
        }
        if (root.name === name) {
            return root;
        }
        var arrayRootChildren = root.children;
        var length = arrayRootChildren.length;
        for (var i = 0; i < length; i++) {
            var child = arrayRootChildren[i];
            var res = self.seekNodeByName(child, name);
            if (res != null) {
                return res;
            }
        }
        return null;
    },

    update: function (dt) {
        if (self.mapLoop) {
            BattleManager.getInstance().managers[Defines.MgrType.SCENARIO].battleCampaignMode.mapUpdate(Defines.BATTLE_FRAME_SECOND);
        }
        if (self.watchBlt) {
            if (BattleManager.getInstance().managers[Defines.MgrType.ENTITY].entityMonBltList.length > 2) {
                self.watchBlt = false;
                self.scheduleOnce(() => {
                    BattleManager.getInstance().gameState = Defines.GameResult.PAUSE;
                    self.doNextStep();
                }, 0.5)
            }
        }
    },

});
