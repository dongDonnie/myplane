const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const ResMapping = require("resmapping");
const GameServerProto = require("GameServerProto");
const ShaderUtils = require("ShaderUtils");
const GlobalFunc = require('GlobalFunctions');

cc.Class({
    extends: RootBase,

    properties: {
        spriteEquip: {
            default: null,
            type: cc.Sprite,
        },
        spineEffectFront: {
            default: null,
            type: sp.Skeleton,
        },
        spineEffectBack: {
            default: null,
            type: sp.Skeleton,
        },
        spriteContinue: {
            default: null,
            type: cc.Sprite,
        },
        labelTip: {
            default: null,
            type: cc.Label,
        },
        labelAddValue: {
            default: null,
            type: cc.Label,
        },
    },

    onLoad: function () {
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_EQUIP_QUALITY_UP_WND;
        this.beforeIcon = 0;
        this.afterIcon = 0;
        this.animeStartParam(0);
    },

    update: function (dt) {
        let time = (Date.now() - this.shaderStartTime) / 1000;
        // ShaderUtils.setShader(this.spriteEquip, "white", time);
    },

    setDefaultEquipt: function (beforeIcon, afterIcon, equipName, equipColor, callback) {
        this.beforeIcon = beforeIcon;
        this.afterIcon = afterIcon;
        this.labelAddValue.string = equipName;
        this.labelAddValue.node.color = GlobalFunc.getSystemColor(equipColor);
        this.callbackFunc = callback;
    },

    animeStartParam: function (param) {
        this.node.opacity = param;
    },

    animePlayCallBack: function (name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            this.spriteEquip.spriteFrame = "";
            this.spineEffectBack.node.active = false;
            this.spriteContinue.node.stopAllActions();
            this.spriteContinue.node.active = false;        
            // this.labelTip.node.active = false;
            // this.labelTip.node.y -= 75;
            this.labelAddValue.node.active = false;
            this.labelAddValue.node.y += 75;
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            this.registerEvent();
            this.initEquipQualityUpWnd();
        }
    },

    registerEvent: function () {
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SHOW_MAIL_LIST, this.showMailList, this);
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_SET_MAIL_READSTATUS, this.setMailReadStatus, this);
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_NEW_MAIL, this.addNewMail, this);
        // GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_DELETE_MAIL, this.deleteMail, this);
    },

    initEquipQualityUpWnd: function () {
        if (this.beforeIcon == 0) {
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView();
            return;
        }
        this.canClose = false;

        let self = this;
        let index = self.beforeIcon / 10 % 10 + 1;
        GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/itemiconBig/' + index + '/' + this.beforeIcon, function (frame) {
            self.spriteEquip.spriteFrame = frame;
            self.playQualityUpAnime();
        });
    },

    playQualityUpAnime: function () {
        let self = this;
        let effect1 = this.spineEffectFront;
        let effect2 = this.spineEffectBack;
        effect1.node.active = true;
        effect1.clearTracks();
        effect1.setAnimation(0, "animation", false);
        effect1.setCompleteListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName == "animation") {
                effect1.node.active = false;
                self.shaderStartTime = Date.now();
                // effect2.setAnimation(0, "animation", false);
            }
        });

        this.spriteEquip.node.runAction(cc.sequence(cc.scaleTo(0.7, 0.5), cc.callFunc(() => {
            let index = self.afterIcon / 10 % 10 + 1;
            GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/itemiconBig/' + index + '/' + self.afterIcon, function (frame) {
                self.spriteEquip.spriteFrame = frame;
                effect2.node.active = true;
                effect2.setAnimation(0, "animation", false);

                self.scheduleOnce(()=>{
                    self.showTextAnime();
                }, 1.8);
            });
        }), cc.scaleTo(0.25, 2), cc.scaleTo(0.2, 1)));

        effect2.setCompleteListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName == "animation") {
                self.callbackFunc();
                self.close();
            }
        });
    },

    showTextAnime: function () {
        this.spriteContinue.node.active = true;
        this.spriteContinue.node.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.7))));
        this.spineEffectBack.clearTracks();

        let self = this;
        
        // this.labelTip.node.active = true;
        // this.labelTip.node.scale = 0;
        // this.labelTip.node.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1), cc.moveBy(0.2, 0, 75)), cc.callFunc(()=>{
        //     self.canClose = true;
        // })));
        this.labelAddValue.node.active = true;
        this.labelAddValue.node.scale = 0;
        this.labelAddValue.node.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1), cc.moveBy(0.2, 0, 75)), cc.callFunc(()=>{
            self.canClose = true;
        })));

        if (GlobalVar.me().level == 3){
            let self = this;
            this.scheduleOnce(()=>{
                self.onTouchMain();
            }, 0.5);
        }
    },

    onTouchMain: function () {
        if (this.canClose){
            this.callbackFunc();
            this.close();
        }
    },

    enter: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

    escape: function (isRefresh) {
        if (isRefresh) {
            this._super(true);
        } else {
            this._super(false);
        }
    },

});