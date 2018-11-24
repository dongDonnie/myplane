const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const GlobalVar = require('globalvar')
const EventMsgID = require("eventmsgid");
const GlobalFunc = require('GlobalFunctions');
const i18n = require('LanguageData');
const CommonWnd = require("CommonWnd");

cc.Class({
    extends: RootBase,

    properties: {
        labelTitle: {
            default: null,
            type: cc.Label
        },
        labelText: {
            default: null,
            type: cc.Label
        },
        jumpPrefabName: {
            default: "",
            visible: false,
        },
        viewName: {
            default: "",
            visible: false,
        },
        viewType: {
            default: "",
            visible: false,
        },
        confirmCallBack: {
            default: null,
            visible: false,
        },
        cancelCallBack: {
            default: null,
            visible: false,
        },
        closeCallBack: {
            default: null,
            visible: false,
        },
        clickIndex: {
            default: -1,
            visible: false,
        },
        itemShowVec: {
            default: null,
            visible: false,
        },
    },

    onLoad: function () {
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_COMMON_WND;
        this.animeStartParam(0, 0);
        this.itemShowVec = null;
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },
    

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            let confirm = this.node.getChildByName("btnConfirm");
            let cancel = this.node.getChildByName("btnCancel");
            cancel.getComponent("RemoteSprite").setFrame(0);
            confirm.getComponent("RemoteSprite").setFrame(0);
            confirm.getComponent(cc.Widget).bottom = 40;
            cancel.getComponent(cc.Widget).bottom = 40;
            confirm.getComponent(cc.Widget).updateAlignment();
            cancel.getComponent(cc.Widget).updateAlignment();
            confirm.getComponent("ButtonObject").setText("确定");
            cancel.getComponent("ButtonObject").setText("取消");
            confirm.x = 0;
            cancel.x = 0;
            confirm.active = false;
            cancel.active = false;
            confirm.getComponent(cc.Button).interactable = true;
            cancel.getComponent(cc.Button).interactable = true;
            this.selectContent(0);

            if (this.clickIndex == 0) {
                // if (this.confirmCallBack) {
                //     this.confirmCallBack(this.viewName, this.viewType);
                // }
                var type = this.jumpPrefabName;
                var confirmCallBack = this.confirmCallBack;
                var viewName = this.viewName;
                var viewType = this.viewType;
                WindowManager.getInstance().popView(false, function () {
                    if (type != "") {
                        WindowManager.getInstance().pushView(type);
                    }
                    if (confirmCallBack){
                        confirmCallBack(viewName, viewType);
                    }
                }, false);
            } else if (this.clickIndex == 1) {
                // if (this.cancelCallBack) {
                //     this.cancelCallBack(this.viewName, this.viewType);
                // }
                var cancelCallBack = this.cancelCallBack;
                var viewName = this.viewName;
                var viewType = this.viewType;
                WindowManager.getInstance().popView(false, function () {
                    if (cancelCallBack){
                        cancelCallBack(viewName, viewType);
                    }
                }, false);
            } else if (this.clickIndex == 2) {
                // if (this.closeCallBack) {
                //     this.closeCallBack(this.viewName, this.viewType);
                // }
                var closeCallBack = this.closeCallBack;
                var viewName = this.viewName;
                var viewType = this.viewType;
                WindowManager.getInstance().popView(false, function () {
                    if (closeCallBack){
                        closeCallBack(viewName, viewType);
                    }
                }, false);
            }
            this.clickIndex = -1;
        } else if (name == "Enter") {
            this._super("Enter");
            this.initCommomView();
        }
    },

    setItemShowVec: function (itemMustIDVec, itemProbIDVec) {
        this.itemShowVec = {};
        this.itemShowVec.itemMustIDVec = itemMustIDVec;
        this.itemShowVec.itemProbIDVec = itemProbIDVec;
    },

    initCommomView() {
        if (this.itemShowVec!=null){
            this.setDrawBoxPreviewItem(this.itemShowVec.itemMustIDVec, this.itemShowVec.itemProbIDVec);
        }
    },

    confirm: function () {
        this.animePlay(0);
        if (this.confirmCallBack) {
            this.confirmCallBack(this.viewName, this.viewType);
        }

        var type = this.jumpPrefabName;
        WindowManager.getInstance().popView(true, function () {
            if (type != "") {
                WindowManager.getInstance().pushView(type);
            }
        }, false);
    },

    cancel: function () {
        this.animePlay(0);
        if (this.closeCallBack) {
            this.cancelCallBack(this.viewName, this.viewType);
        }
    },

    close: function () {
        this.animePlay(0);
        if (this.closeCallBack) {
            this.closeCallBack(this.viewName, this.viewType);
        }
    },

    btnCLick: function (event, index) {
        this.clickIndex = typeof index !== 'undefined' ? index : -1;
        if (this.clickIndex != -1) {
            this.animePlay(0);
        }
    },

    setContent: function (mode, name, type, title, text, closeCallBack, confirmCallBack, cancelCallBack, prefabName, confirmName, cancelName) {
        this.viewName = name;
        this.viewType = type;
        this.setBtnMode(mode);
        this.setTitle(title);
        this.setDialog(text);
        this.setBtnEvent(closeCallBack, confirmCallBack, cancelCallBack);
        this.setJumpPrefab(prefabName);
        this.setConfirmText(confirmName);
        this.setCancelText(cancelName);
        this.node.height = 320;
    },

    selectContent(contentMode) {
        let contents = this.node.getChildByName("nodeContents");
        for (let i = 0; i < contents.children.length; i++) {
            if (i == contentMode) {
                contents.children[i].active = true;
            } else {
                contents.children[i].active = false;
            }
        }
        this.node.getComponent("RemoteSprite").setFrame(0);
        this.node.getChildByName("labelTitle").active = true;
    },

    setDrawConfirmContent: function (name, type, title, text, drawMode, ticketsEnough, diamondEnough, pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, confirmName, cancelName) {
        let CONTENT_TEXT = 0, CONTENT_DRAWINFO = 1, CONTENT_BOXPREVIEW = 2, CONTENT_SP_BUY = 3;
        let contentMode = CONTENT_DRAWINFO;
        this.selectContent(contentMode);

        this.setDrawTip(drawMode, text, ticketsEnough, diamondEnough);
        this.setContent(3, name, type, title, "", pFunCloseCallback, pFunConfirmCallback, pFunCancelCallback, "", confirmName, cancelName);
    },

    setBuySpContent: function (name, type, title, closeCallBack, confirmCallBack, cancelCallBack, confirmName, cancelName) {
        let CONTENT_TEXT = 0, CONTENT_DRAWINFO = 1, CONTENT_BOXPREVIEW = 2, CONTENT_SP_BUY = 3;
        let contentMode = CONTENT_SP_BUY;
        this.selectContent(contentMode);

        confirmCallBack = this.setBuySpTip(confirmCallBack);
        this.setContent(4, name, type, title, "", closeCallBack, confirmCallBack, cancelCallBack, "", confirmName, cancelName);
        this.node.height = 500;
    },

    setResetQuestContent: function (name, type, title, resetDesc, diamondCost, closeCallBack, confirmCallBack, cancelCallBack, confirmName, cancelName) {
        let CONTENT_TEXT = 0, CONTENT_DRAWINFO = 1, CONTENT_BOXPREVIEW = 2, CONTENT_SP_BUY = 3, CONTENT_QUESTRESET = 4;
        let contentMode = CONTENT_QUESTRESET = 4;
        this.selectContent(contentMode);

        this.setResetQuestTip(resetDesc, diamondCost);
        this.setContent(4, name, type, title, "", closeCallBack, confirmCallBack, cancelCallBack, "", confirmName, cancelName);
        this.node.height = 400;
    },

    setItemBoxContent: function (name, type, title, condition, vecItems, closeCallBack, confirmCallBack, cancelCallBack, confirmName, cancelName) {
        let CONTENT_TEXT = 0, CONTENT_DRAWINFO = 1, CONTENT_BOXPREVIEW = 2, CONTENT_SP_BUY = 3;
        let contentMode = CONTENT_BOXPREVIEW;
        this.selectContent(contentMode);

        this.setTreasureBoxItem(condition, vecItems);
        this.setContent(5, name, type, title, "", closeCallBack, confirmCallBack, cancelCallBack, "", confirmName, cancelName);
        this.node.height = 400;
    },

    setDrawBoxPreviewContent: function (name, type, title, closeCallBack, confirmCallBack, cancelCallBack) {
        let CONTENT_DRAWBOXVIEW = 5;
        let contentMode = CONTENT_DRAWBOXVIEW;
        this.selectContent(contentMode);

        this.setContent(0, name, type, title, "", closeCallBack, confirmCallBack, cancelCallBack, "", "", "");
        this.node.height = 820;
    },

    setDrawTip: function (drawMode, text, ticketsEnough, diamondEnough) {
        let nodeDraw = this.node.getChildByName("nodeContents").getChildByName("nodeDrawInfo");

        nodeDraw.getChildByName("labelText").getComponent(cc.Label).string = text;

        let diamond = nodeDraw.getChildByName("spriteDiamond");
        let diamondCost = diamond.getChildByName("labelDiamondCost");
        let ticket = nodeDraw.getChildByName("spriteTicket");
        let ticketCost = ticket.getChildByName("labelTicketCost");
        if (ticketsEnough) {
            ticket.getComponent("RemoteSprite").setFrame(1);
            diamond.active = false;
        } else {
            if (diamondEnough) {
                diamondCost.color = new cc.color(255, 255, 255);
            } else {
                diamondCost.color = new cc.color(255, 0, 0);
                this.confirmCallBack = this.showDiamondNotEnoughMsg
            }
        }
        if (drawMode === 1) {
            diamondCost.getComponent(cc.Label).string = 188;
            ticketCost.getComponent(cc.Label).string = 1;
        } else if (drawMode === 10) {
            diamondCost.getComponent(cc.Label).string = 1680;
            ticketCost.getComponent(cc.Label).string = 10;
        }
    },

    setBuySpTip: function (confirmCallBack) {
        let nodeBuySp = this.node.getChildByName("nodeContents").getChildByName("nodeBuySp");

        let spData = GlobalVar.me().getSpData();
        let vipLevel = GlobalVar.me().getVipLevel();
        let buyTimes = spData.BuyTimes;
        let spBuyTblData = GlobalVar.tblApi.getDataBySingleKey("TblSpBuy", buyTimes + 1);
        let spBuyTimesLimit = GlobalVar.tblApi.getDataBySingleKey("TblSpVip", vipLevel).byBuySpTimes;
        let diamondCost = 0, leftBuyTimes = 0
        nodeBuySp.getChildByName("labelBuySpCount").getComponent(cc.Label).string = spBuyTblData.wGetSp;
        nodeBuySp.getChildByName("labelDiamondCost").getComponent(cc.Label).string = diamondCost = spBuyTblData.nDiamondCost;
        nodeBuySp.getChildByName("labelLeftBuyLimit").getComponent(cc.Label).string = leftBuyTimes = spBuyTimesLimit - buyTimes;

        confirmCallBack = function () {
            let userHaveDiamond = GlobalVar.me().getDiamond();
            if (userHaveDiamond < diamondCost) {
                // GlobalVar.comMsg.showMsg(i18n.t('label.4000221'))
                CommonWnd.showNormalFreeGetWnd(GameServerProto.PTERR_DIAMOND_LACK);
                return;
            }

            if (leftBuyTimes <= 0) {
                GlobalVar.comMsg.showMsg(i18n.t('label.4000228'))
                return;
            }
            GlobalVar.handlerManager().spHandler.sendSpBuyReq();
        };

        return confirmCallBack;
    },

    setResetQuestTip: function (resetDesc, diamondCost) {
        this.node.getComponent("RemoteSprite").setFrame(1);
        this.node.getChildByName("labelTitle").active = false;

        let confirm = this.node.getChildByName("btnConfirm");
        let cancel = this.node.getChildByName("btnCancel");
        confirm.y=(confirm.y + 20);
        cancel.y=(cancel.y + 20);

        let nodeReset = this.node.getChildByName("nodeContents").getChildByName("nodeQuestReset");
        nodeReset.getChildByName("labelResetDesc").getComponent(cc.Label).string = resetDesc;
        nodeReset.getChildByName("labelDiamondCost").getComponent(cc.Label).string = diamondCost;
    },

    setTreasureBoxItem: function (condition, vecItems) {
        let nodePreview = this.node.getChildByName("nodeContents").getChildByName("nodeBoxPreview");
        let nodeLayout = nodePreview.getChildByName("nodeLayout");
        let model = nodePreview.getChildByName("nodeItem");
        for (let i = 0; i<nodeLayout.children.length; i++){
            nodeLayout.children[i].destroy();
        }
        nodeLayout.removeAllChildren();
        for (let i = 0; i < vecItems.length; i++) {
            let nodeItem = cc.instantiate(model);
            let item = nodeItem.getChildByName("ItemObject").getComponent("ItemObject");
            let itemData = item.updateItem(vecItems[i].wItemID, vecItems[i].nCount);
            nodeItem.getChildByName("labelName").getComponent(cc.Label).string = itemData.strName;
            nodeItem.getChildByName("labelName").color = GlobalFunc.getCCColorByQuality(itemData.wQuality);
            item.setClick(true, 2);
            nodeLayout.addChild(nodeItem);
        }
        nodeLayout.getComponent(cc.Layout).updateLayout();
        this.node.getChildByName("btnConfirm").getComponent(cc.Button).interactable = condition;
    },

    setDrawBoxPreviewItem(itemMustIDVec, itemProbIDVec) {
        let nodeDrawBoxView = this.node.getChildByName("nodeContents").getChildByName("nodeDrawBoxView");
        let itemMustContent = nodeDrawBoxView.getChildByName("scrollviewItemMust").getComponent(cc.ScrollView).content;
        let itemProbContent = nodeDrawBoxView.getChildByName("scrollviewItemProb").getComponent(cc.ScrollView).content;
        let itemModel = nodeDrawBoxView.getChildByName("itemObjectModel");
        for (let i = 0; i<itemMustContent.children.length; i++){
            itemMustContent.children[i].destroy();
        }
        itemMustContent.removeAllChildren();
        for (let i = 0; i < itemMustIDVec.length; i++) {
            let nodeItem = cc.instantiate(itemModel);
            // nodeItem.opacity = 255;
            nodeItem.y = -itemMustContent.height/2
            let itemObj = nodeItem.getChildByName("ItemObject").getComponent("ItemObject");
            let itemData = itemObj.updateItem(itemMustIDVec[i]);
            let labelName = nodeItem.getChildByName("labelName").getComponent(cc.Label)
            labelName.string = itemData.strName;
            labelName.node.color = GlobalFunc.getCCColorByQuality(itemData.wQuality);
            itemObj.setClick(true, 2);
            itemMustContent.addChild(nodeItem);
        }
        for (let i = 0; i<itemProbContent.children.length; i++){
            itemProbContent.children[i].destroy();
        }
        itemProbContent.removeAllChildren();
        for (let i = 0; i < itemProbIDVec.length; i++) {
            let nodeItem = cc.instantiate(itemModel);
            let itemObj = nodeItem.getChildByName("ItemObject").getComponent("ItemObject");
            let itemData = itemObj.updateItem(itemProbIDVec[i]);
            let labelName = nodeItem.getChildByName("labelName").getComponent(cc.Label)
            labelName.string = itemData.strName;
            labelName.node.color = GlobalFunc.getCCColorByQuality(itemData.wQuality);
            itemObj.setClick(true, 2);
            itemProbContent.addChild(nodeItem);
        }
        itemMustContent.getComponent(cc.Layout).updateLayout();
        itemProbContent.getComponent(cc.Layout).updateLayout();
    },

    showDiamondNotEnoughMsg() {
        GlobalVar.comMsg.showMsg(i18n.t('label.4000221'));
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

    setConfirmText: function (text) {
        this.node.getChildByName("btnConfirm").getComponent("ButtonObject").setText(text);
    },

    setCancelText: function (text) {
        this.node.getChildByName("btnCancel").getComponent("ButtonObject").setText(text);
    },

    setBtnMode: function (mode) {
        let confirm = this.node.getChildByName("btnConfirm");
        let cancel = this.node.getChildByName("btnCancel");
        if (mode == 5) {
            confirm.active = true;
            // confirm.getComponent("RemoteSprite").setFrame(2);
            cancel.active = false;
        } else if (mode == 4) {
            confirm.active = true;
            confirm.x = confirm.width;
            confirm.getComponent("RemoteSprite").setFrame(1);
            cancel.active = true;
            cancel.x = -cancel.width;
            cancel.getComponent("RemoteSprite").setFrame(2);
            confirm.getComponent(cc.Widget).bottom = 80;
            cancel.getComponent(cc.Widget).bottom = 80;
            confirm.getComponent(cc.Widget).updateAlignment();
            cancel.getComponent(cc.Widget).updateAlignment();

        } else if (mode == 3) {
            confirm.active = true;
            confirm.x = confirm.width;
            cancel.active = true;
            cancel.x = -cancel.width;
        } else if (mode == 2) {
            confirm.active = true;
            confirm.x = confirm.width;
            cancel.active = true;
            cancel.x = -cancel.width;
        } else if (mode == 1) {
            confirm.active = true;
            confirm.x = 0;
        } else {
            confirm.active = false;
            cancel.active = false;
        }
    },

    setBtnEvent: function (closeCallBack, confirmCallBack, cancelCallBack) {
        if (typeof closeCallBack !== 'undefined' && closeCallBack != null) {
            this.closeCallBack = closeCallBack;
        } else {
            this.closeCallBack = null;
        }

        if (typeof confirmCallBack !== 'undefined' && confirmCallBack != null) {
            this.confirmCallBack = confirmCallBack;
        } else {
            this.confirmCallBack = null;
        }

        if (typeof cancelCallBack !== 'undefined' && cancelCallBack != null) {
            this.cancelCallBack = cancelCallBack;
        } else {
            this.cancelCallBack = null;
        }
    },

    setJumpPrefab: function (prefabName) {
        prefabName = typeof prefabName !== 'undefined' ? prefabName : "";
        this.jumpPrefabName = prefabName;
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