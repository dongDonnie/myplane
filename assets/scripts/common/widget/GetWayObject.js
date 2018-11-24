const UIBase = require("uibase");
const GlobalVar = require("globalvar")
const GameServerProto = require("GameServerProto");
const WndTypeDefine = require("wndtypedefine");
const CommonWnd = require("CommonWnd");
const WindowManager = require("windowmgr");
const i18n = require('LanguageData');
var GetWayObject = cc.Class({
    extends: UIBase,

    ctor: function () {
        this.iconFrameStack = [];
        this.iconFrameStack[0] = {
            local: "cdnRes/daily/dailyicon_power.png",
            url: ""
        };
        this.iconFrameStack[1] = {
            local: "cdnRes/itemicon/99/1.png",
            url: ""
        };
        this.iconFrameStack[2] = {
            local: "cdnRes/itemicon/99/2.png",
            url: ""
        };
        this.iconFrameStack[3] = {
            local: "cdnRes/itemicon/99/3.png",
            url: ""
        };
        this.iconFrameStack[4] = {
            local: "cdnRes/itemicon/99/4.png",
            url: ""
        };
        this.iconFrameStack[5] = {
            local: "cdnRes/dailyicon/dailyicon_shop.png",
            url: ""
        };
        this.iconFrameStack[710] = {
            local: "cdnRes/membericon/710.png",
            url: ""
        };
        this.iconFrameStack[720] = {
            local: "cdnRes/membericon/720.png",
            url: ""
        };
        this.iconFrameStack[730] = {
            local: "cdnRes/membericon/730.png",
            url: ""
        };
        this.iconFrameStack[740] = {
            local: "cdnRes/membericon/740.png",
            url: ""
        };
        this.iconFrameStack[750] = {
            local: "cdnRes/membericon/750.png",
            url: ""
        };
        this.iconFrameStack[760] = {
            local: "cdnRes/membericon/760.png",
            url: ""
        };
        this.iconFrameStack[770] = {
            local: "cdnRes/membericon/770.png",
            url: ""
        };
        this.iconFrameStack[780] = {
            local: "cdnRes/membericon/780.png",
            url: ""
        };
        this.iconFrameStack[790] = {
            local: "cdnRes/membericon/790.png",
            url: ""
        };
        this.iconFrameStack[800] = {
            local: "cdnRes/membericon/800.png",
            url: ""
        };
    },

    properties: {
        spriteIcon: {
            default: null,
            type: cc.Sprite
        },
        labelName: {
            default: null,
            type: cc.Label
        },
        labelText: {
            default: null,
            type: cc.Label
        },
        btnGo: {
            default: null,
            type: cc.Button
        },
        getwayID: {
            default: 0,
            visible: false,
        },
        getwayData: {
            default: null,
            visible: false,
        },
    },

    onLoad: function () {
        i18n.init('zh');
    },

    updateGetWay: function (id, param1, param2) {
        id = typeof id !== 'undefined' ? id : -1;
        this.getwayID = id;
        this.param1 = param1;
        this.param2 = param2;
        if (id != -1) {
            this.getwayData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', id);
        } else {
            this.getwayData = null;
        }
        if (this.getwayData != null) {
            this.setSpriteIcon(this.getwayData.wIcon);
            this.setLabelName(this.getwayData.strName);

            if (this.getwayID == 22){
                let strTips = "通关【%chapterID-%campaignID %campName】掉落";
                strTips = strTips.replace("%chapterID", param1).replace("%campaignID", param2);
                let campTblID = GlobalVar.tblApi.getDataBySingleKey('TblChapter', GameServerProto.PT_CAMPTYPE_MAIN)[param1 - 1].oVecCampaigns[param2 - 1]
                let campName = GlobalVar.tblApi.getDataBySingleKey('TblCampaign', campTblID).strCampaignName;
                strTips = strTips.replace("%campName", campName);
                this.setLabelText(strTips);
            }else{
                this.setLabelText(this.getwayData.strTipsString);
            }
        } else {
            this.setSpriteIcon();
            this.setLabelName();
            this.setLabelText();
        }
    },

    setSpriteIcon: function (icon) {
        let path = "";
        if (typeof this.iconFrameStack[icon] !== 'undefined') {
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                path = this.iconFrameStack[icon].url;
            } else {
                path = this.iconFrameStack[icon].local;
            }
        } else {
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                path = this.iconFrameStack[0].url;
            } else {
                path = this.iconFrameStack[0].local;
            }
        }
        this.spriteIcon.getComponent("RemoteSprite").loadFrame(path);
    },

    setLabelName: function (text) {
        if (typeof text !== 'undefined') {
            this.labelName.string = text;
        } else {
            this.labelName.string = i18n.t('label.4000225');
        }
    },

    setLabelText: function (text) {
        if (typeof text !== 'undefined') {
            this.labelText.string = text;
        } else {
            this.labelText.string = i18n.t('label.4000226');
        }
    },

    setJumpCallback: function (callback) {
        this._jumpGoCallback = callback;
    },

    jumpGo: function () {
        let self = this;
        switch (this.getwayID) {
            case WndTypeDefine.WindowSystemID.E_DT_NORMAL_STORE_WND:              //弹出商店窗口
                let systemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_STORE);
                if (systemData && GlobalVar.me().level < systemData.wOpenLevel) {
                    GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", systemData.wOpenLevel || 0).replace("%d", systemData.strName));
                    WindowManager.getInstance().lockBtn();
                    return;
                }

                GlobalVar.eventManager().removeListenerWithTarget(this);
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showStoreWithParam(1);
                }, false, false);
                break;
            case WndTypeDefine.WindowSystemID.E_DT_NORMALDRAW_VIEW:               //弹出十连抽窗口
                GlobalVar.eventManager().removeListenerWithTarget(this);
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showDrawView();
                }, false, false);
                break;
            case WndTypeDefine.WindowSystemID.E_DT_ENDLESS_CHALLENGE_VIEW:        //无尽挑战
                let endlessSystemData = GlobalVar.tblApi.getDataBySingleKey('TblSystem', GameServerProto.PT_SYSTEM_ENDLESS);
                if (GlobalVar.me().level < endlessSystemData.wOpenLevel){
                    GlobalVar.comMsg.showMsg(i18n.t('label.4000258').replace("%d", endlessSystemData.wOpenLevel).replace("%d", endlessSystemData.strName));
                    WindowManager.getInstance().lockBtn();
                    return;
                }

                GlobalVar.eventManager().removeListenerWithTarget(this);
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showEndlessView();
                }, false, false);
                break;
            case WndTypeDefine.WindowSystemID.E_DT_NORMAL_QUESTLIST_VIEW:
                GlobalVar.eventManager().removeListenerWithTarget(this);
                let chapterDataList = GlobalVar.tblApi.getDataBySingleKey('TblChapter', GameServerProto.PT_CAMPTYPE_MAIN);
                let playerChapterData = GlobalVar.me().campData.getChapterData(GameServerProto.PT_CAMPTYPE_MAIN, self.param1);
                let campData = playerChapterData[self.param2 - 1];
                let campaignList = chapterDataList[self.param1 - 1].oVecCampaigns;
                let planetData = GlobalVar.tblApi.getDataBySingleKey('TblCampaign', campaignList[self.param2 - 1]);


                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showQuestInfoWnd(campData, planetData);
                }, false, false);
                break;
            // case WndTypeDefine.WindowSystemID.E_DT_NORMAL_RICHTREASURE_WND:       //淘金
            //     GlobalVar.eventManager().removeListenerWithTarget(this);
            //     WindowManager.getInstance().popView(false, function () {
            //         GlobalVar.handlerManager().drawHandler.sendTreasureData();
            //     }, false, false);
            //     break;
            default:
                // this.unLockBtn();
                break;
        }
    },
});