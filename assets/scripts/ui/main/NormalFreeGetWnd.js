const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const GlobalFunc = require('GlobalFunctions');
const i18n = require('LanguageData');
const CommonWnd = require("CommonWnd");
const ButtonObject = require("ButtonObject");
const GameServerProto = require("GameServerProto");
const weChatAPI = require("weChatAPI");
const WindowManager = require("windowmgr");

const BUTTON_TYPE_SHARE_ONLY = 1;
const BUTTON_TYPE_SHARE_PURCHASE = 2;

const SHARE_TYPE_GOLD = 1;
const SHARE_TYPE_DIAMOND = 2;

cc.Class({
    extends: RootBase,

    properties: {
        labelTitle: {
            default: null,
            type: cc.Label,
        },
        labelText: {
            default: null,
            type: cc.Label,
        },
        labelLeftTime: {
            default: null,
            type: cc.Label,
        },
        btnShare: {
            default: null,
            type: ButtonObject,
        },
        btnPurchase: {
            default: null,
            type: ButtonObject,
        },
        btnClose: {
            default: null,
            type: ButtonObject,
        },
        nodeBlock: {
            default: null,
            type: cc.BlockInputEvents,
        }
    },

    onLoad: function () {
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_FREE_GET_WND;
        this.animeStartParam(0, 0);
        this._shareType = 0; // 1为获取金币，2为获取钻石;
        this._purchaseMode = false;
        this.shareCallBack = null;
        this.purchaseCallBack = null;
        this.closeCallBack = null;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;

        if (paramOpacity == 0 || paramOpacity == 255) {
            this.nodeBlock.enabled = true;
        }
    },


    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            let shareType = this._shareType;
            let purchaseMode = this._purchaseMode;
            this._shareType = 0;
            this._purchaseMode = false;
            this.shareCallBack = null;
            this.purchaseCallBack = null;
            this.closeCallBack = null;
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, function () {
                if (purchaseMode){
                    WindowManager.getInstance().unLockBtn();
                    if (shareType == SHARE_TYPE_GOLD) {
                        // CommonWnd.showRichTreasureWnd();   //淘金界面打开需要有数据，故仍然用UImain的监听来打开淘金界面
                        GlobalVar.handlerManager().drawHandler.sendTreasureData();
                    } else if (shareType == SHARE_TYPE_DIAMOND) {
                        CommonWnd.showRechargeWnd();
                    }
                }
            }, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.nodeBlock.enabled = false;
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_FREE_GOLD, this.getFreeGold, this);
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GET_FREE_DIAMOND, this.getFreeDiamond, this);
        }
    },

    initWndByData: function (mode, title, text, leftTimeStr, leftShareTime, shareCallBack, purchaseCallBack, closeCallBack, shareName, purchaseName) {
        // this.viewName = name;
        // this.viewType = type;
        this.setBtnMode(mode);
        this.setTitle(title);
        this.setDialog(text);
        this.setLeftTime(leftTimeStr);
        this.setShareSwitch(leftShareTime);
        this.setBtnEvent(shareCallBack, purchaseCallBack, closeCallBack);
        this.setShareText(shareName);
        this.setPurchaseText(purchaseName);
    },

    initFreeGetWnd: function (errCode, shareCallBack, purchaseCallBack, closeCallBack) {
        let btnType = BUTTON_TYPE_SHARE_PURCHASE;
        let title = i18n.t("label.4000216");
        let text = "";
        let leftTimeStr = i18n.t("label.4000305");
        let shareName = i18n.t("label.4000303");
        let purchaseName = i18n.t("label.4000304");
        let curTime = 0;
        let maxTime = 0;
        let leftShareTime = 0;
        if (errCode == GameServerProto.PTERR_GOLD_LACK) {
            // 可获得金币
            this._shareType = SHARE_TYPE_GOLD;
            let canGetGold = GlobalFunc.getShareCanGetGold(GlobalVar.me().level);
            text = i18n.t("label.4000301").replace("%d", canGetGold);

            // 剩余次数状态
            curTime = GlobalVar.me().shareData.getFreeGoldCount();
            maxTime = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_TREASURE_GOLD_FREE_MAX).dValue;
            leftTimeStr = leftTimeStr.replace("%left", maxTime - curTime).replace("%max", maxTime);
        } else if (errCode == GameServerProto.PTERR_DIAMOND_LACK) {
            // 可获得钻石
            this._shareType = SHARE_TYPE_DIAMOND;
            let canGetDiamond = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_RCG_FREE_DIAMOND).dValue;
            text = i18n.t("label.4000302").replace("%d", canGetDiamond);

            // 剩余次数状态
            curTime = GlobalVar.me().shareData.getFreeDiamondCount();
            maxTime = GlobalVar.tblApi.getDataBySingleKey('TblParam', GameServerProto.PTPARAM_RCG_FREE_DIAMOND_MAX).dValue;
            leftTimeStr = leftTimeStr.replace("%left", maxTime - curTime).replace("%max", maxTime);

            // 隐藏购买按钮
            if (GlobalVar.srcSwitch()) {
                btnType = BUTTON_TYPE_SHARE_ONLY;
            }
        }
        leftShareTime = maxTime - curTime;
        this.initWndByData(btnType, title, text, leftTimeStr, leftShareTime, shareCallBack, purchaseCallBack, closeCallBack, shareName, purchaseName);
    },

    onBtnShareClick: function (event) {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME){
            if (!!this.shareCallBack){
                this.shareCallBack();
            }
            this.close();
            return;
        }
        let self = this;
        let shareSuccessCallback = function () {
            if (self._shareType == SHARE_TYPE_GOLD) {
                GlobalVar.handlerManager().shareHandler.sendGetFreeGoldReq();
            } else if (self._shareType == SHARE_TYPE_DIAMOND) {
                GlobalVar.handlerManager().shareHandler.sendGetFreeDiamondReq();
            }
        };

        let materials = GlobalVar.materials[1];
        let ranNum = Math.floor(Math.random()*materials.length);
        weChatAPI.shareNormal(materials[ranNum], shareSuccessCallback);
    },

    onBtnPurchaseClick: function (event) {
        if (!!this.purchaseCallBack) {
            this.purchaseCallBack();
        }
        this._purchaseMode = true;
        this.close();
    },

    onBtnClose: function (event) {
        if (!!this.closeCallBack) {
            this.closeCallBack();
        }
        this.close();
    },

    getFreeGold: function (event) {
        GlobalVar.comMsg.showMsg("分享成功");
        if (!!this.shareCallBack){
            this.shareCallBack();
        }
        this.close();
    },

    getFreeDiamond: function (event) {
        GlobalVar.comMsg.showMsg("分享成功");
        if (!!this.shareCallBack){
            this.shareCallBack();
        }
        this.close();
    },

    setTitle: function (text) {
        if (typeof text !== 'undefined' && text != "") {
            this.labelTitle.string = text;
        }
    },

    setDialog: function (text) {
        if (typeof text !== 'undefined' && text != "") {
            this.labelText.string = text;
        }
    },

    setLeftTime: function (text) {
        if (typeof text !== 'undefined' && text != "") {
            this.labelLeftTime.string = text;
        }
    },

    setBtnEvent: function (closeCallBack, shareCallBack, purchaseCallBack) {
        if (typeof closeCallBack !== 'undefined' && closeCallBack != null) {
            this.closeCallBack = closeCallBack;
        } else {
            this.closeCallBack = null;
        }

        if (typeof shareCallBack !== 'undefined' && shareCallBack != null) {
            this.shareCallBack = shareCallBack;
        } else {
            this.shareCallBack = null;
        }

        if (typeof purchaseCallBack !== 'undefined' && purchaseCallBack != null) {
            this.purchaseCallBack = purchaseCallBack;
        } else {
            this.purchaseCallBack = null;
        }
    },

    setShareSwitch: function (shareState) {
        if (shareState == 0) {
            this.btnShare.node.getComponent(cc.Button).interactable = false;
        } else {
            this.btnShare.node.getComponent(cc.Button).interactable = true;
        }
    },

    setShareText: function (text) {
        if (typeof text !== 'undefined' && text != "") {
            this.btnShare.setText(text);
        }
    },

    setPurchaseText: function (text) {
        if (typeof text !== 'undefined' && text != "") {
            this.btnPurchase.setText(text);
        }
    },

    setBtnMode: function (mode) {
        if (mode == BUTTON_TYPE_SHARE_PURCHASE) {
            this.btnShare.node.x = -140;
            this.labelLeftTime.node.x = -140;
            this.btnPurchase.node.x = 140;
            this.btnPurchase.node.active = true;
        } else if (mode == BUTTON_TYPE_SHARE_ONLY) {
            this.btnShare.node.x = 0;
            this.labelLeftTime.node.x = 0;
            this.btnPurchase.node.active = false;
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