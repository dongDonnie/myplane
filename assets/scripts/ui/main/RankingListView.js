
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");
const GlobalFunc = require('GlobalFunctions')
const weChatAPI = require("weChatAPI");

const TYPE_RANKING_QUEST = 0, TYPE_RANKING_ENDLESS = 1;
const POWER_RANKING = 0, QUEST_RANKING = 1, ENDLESS_RANKING = 2, FRIENDS_RANKING = 3, WORLD_RANKING = 4;

cc.Class({
    extends: RootBase,

    properties: {
        spriteRankTypeList: {
            default: [],
            type: [cc.Sprite]
        },
        spriteRankingContent: {
            default: null,
            type: cc.Sprite,
        },
        curRankingType: 0,
        rankingDataBgModel: {
            default: null,
            type: cc.Node,
        },
        rankingDataContent: {
            default: null,
            type: cc.Node,
        },
        pageIndex: {
            default: 0,
            visible: false
        },
        pageCount: {
            default: 0,
            visivle: false
        },
        texture2D: {
            default: null,
            visible: false,
        },
    },

    onLoad: function () {
        this.typeName = WndTypeDefine.WindowType.E_DT_RANKINGLIST_VIEW;
        this.animeStartParam(0);
        if (GlobalFunc.isAllScreen() && !this.fixViewComplete) {
            this.fixViewComplete = true;
            this.fixView();
        }
        this.texture2D = new cc.Texture2D();
    },

    animeStartParam(num) {
        this.node.opacity = num;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
        } else if (name == "Enter") {
            this._super("Enter")
            this.showRanking();
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

    fixView: function () {
        let bottomWidget = this.node.getChildByName("nodeBottom").getComponent(cc.Widget);
        bottomWidget.bottom += 80;
        bottomWidget.updateAlignment();

        let centerWidget = this.node.getChildByName("nodeCenter").getComponent(cc.Widget);
        centerWidget.bottom += 80;
        centerWidget.updateAlignment();
    },

    setPageCount: function (pageCount) {
        this.pageCount = pageCount;

        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            // console.log("not in wechat, return");
            return;
        }
    },

    setRankingType: function (rankingType) {
        this.rankingType = rankingType;
        if (typeof rankingType == "undefined") {
            rankingType = TYPE_RANKING_ENDLESS;
        }
        if (rankingType == TYPE_RANKING_QUEST) {
            this.spriteRankTypeList[POWER_RANKING].node.active = true;
            this.spriteRankTypeList[QUEST_RANKING].node.active = true;
            this.spriteRankTypeList[ENDLESS_RANKING].node.active = true;
            this.spriteRankTypeList[FRIENDS_RANKING].node.active = false;
            this.spriteRankTypeList[WORLD_RANKING].node.active = false;

            this.curRankingType = POWER_RANKING;
        } else if (rankingType == TYPE_RANKING_ENDLESS) {
            this.spriteRankTypeList[POWER_RANKING].node.active = false;
            this.spriteRankTypeList[QUEST_RANKING].node.active = false;
            this.spriteRankTypeList[ENDLESS_RANKING].node.active = false;
            this.spriteRankTypeList[FRIENDS_RANKING].node.active = true;
            this.spriteRankTypeList[WORLD_RANKING].node.active = true;

            this.curRankingType = FRIENDS_RANKING;
        }
    },

    showRanking: function () {
        this.addRankingDataBg();
        this.sendGetRankingListReq(this.pageIndex, this.pageCount);
    },

    addRankingDataBg: function () {
        let contentHeight = this.rankingDataContent.height;
        let modelHeight = this.rankingDataBgModel.height;
        let top = 20, space = 30;
        // console.log("contentHeight = ", contentHeight, "  modelHeight = ", modelHeight, "  top = ", top, "  space = ", space);
        let dataCount = Math.floor((contentHeight - top + space) / (modelHeight + space));
        this.setPageCount(dataCount);
        // console.log("dataCount = ", dataCount);
        // for (let i = 0; i < dataCount; i++) {
        //     let node = cc.instantiate(this.rankingDataBgModel)
        //     node.active = true;
        //     node.x=(-1000);
        //     this.rankingDataContent.addChild(node);
        //     node.runAction(cc.sequence(cc.delayTime(0.05*i), cc.moveBy(0.15,1100,0),cc.moveBy(0.05,-100,0)));
        // }
    },

    onBtnRaningType: function (event, type) {
        type = parseInt(type);
        if (this.curRankingType === type) {
            return;
        } else {
            this.curRankingType = type;
            for (let i = 0; i < this.spriteRankTypeList.length; i++) {
                if (i === type) {
                    this.spriteRankTypeList[i].setFrame(1)
                    this.sendGetRankingListReq(this.pageIndex, this.pageCount);
                } else {
                    this.spriteRankTypeList[i].setFrame(0);
                }
            }
        }
    },

    onBtnChangePage: function (event, changeType) {
        changeType = parseInt(changeType)
        this.sendChangeRankingPageReq(changeType)
    },

    sendGetRankingListReq: function (pageIndex, pageCount) {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            // console.log("not in wechat, return");
            return;
        }

        switch (this.curRankingType) {
            case POWER_RANKING:

                break;
            case QUEST_RANKING:

                break;
            case ENDLESS_RANKING:

                break;
            case FRIENDS_RANKING:
                this.spriteRankingContent.node.active = true;
                this.rankingDataContent.active = false;
                weChatAPI.requestEndlessFriendRanking(pageIndex, pageCount);
                let self = this;
                let openDataContext = wx.getOpenDataContext();
                let sharedCanvas = openDataContext.canvas;
                this.schedule(function () {
                    self.texture2D.initWithElement(sharedCanvas);
                    self.texture2D.handleLoadedTexture();
                    let sf = new cc.SpriteFrame(self.texture2D);
                    // console.log(sf);
                    self.spriteRankingContent.spriteFrame = sf;
                }, 0.3, 5);
                break;
            case WORLD_RANKING:
                this.spriteRankingContent.node.active = false;
                this.rankingDataContent.removeAllChildren();
                this.rankingDataContent.active = true;
                weChatAPI.requestEndlessWorldRanking(GlobalVar.me().selServerID, GlobalVar.me().roleID, pageIndex, pageCount, this.setRankingData)
                for (let i = 0; i < this.pageCount; i++) {
                    let node = cc.instantiate(this.rankingDataBgModel)
                    node.active = true;
                    node.x = (-1000);
                    this.rankingDataContent.addChild(node);
                    node.runAction(cc.sequence(cc.delayTime(0.05 * i), cc.moveBy(0.15, 1100, 0), cc.moveBy(0.05, -100, 0)));
                }
                break;
            default:
                // console.log("error, please check rankingListView");
                break;
        }

        // console.log("send getRankingList req success");
    },

    setRankingData: function (data) {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@get the rankingList data:", data);
    },

    sendChangeRankingPageReq: function (changeType) {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            // console.log("not in wechat, return");
            return;
        }

        let PREVIOUS_PAGE = 0, NEXT_PAGE = 1;
        let curPage = this.pageIndex;
        switch (changeType) {
            case PREVIOUS_PAGE:
                curPage -= 1;
                break;
            case NEXT_PAGE:
                curPage += 1;
                break;
            default:
                // console.log("error, please check rankingListView");
                break;
        }

        if (curPage < 1) {
            curPage = 1;
        }
        if (curPage != this.pageIndex) {
            this.sendGetRankingListReq(curPage, this.pageCount)
        }

        // console.log("send changePage req success");
    },

});