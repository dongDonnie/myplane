
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const GameServerProto = require("GameServerProto");
const EventMsgID = require("eventmsgid");
const CommonWnd = require("CommonWnd");

cc.Class({
    extends: RootBase,

    properties: {
        labelTitle: {
            default: null,
            type: cc.Label,
        },
        richText: {
            default: null,
            type: cc.RichText,
        },
        scrollViewAttach: {
            default: null,
            type: cc.ScrollView,
        },
        btnRecv: {
            default: null,
            type: cc.Button,
        },
        itemPrefabs: {
            default: null,
            type: cc.Prefab,
        },
    },

    onLoad: function () {
        this.typeName = WndTypeDefine.WindowType.E_DT_DETAILMAIL_VIEW;

        this.animeStartParam(0, 0);
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            let getItem = this.data.Attachments;
            for (let i = 0; i<getItem.length; i++){
                getItem[i].Count = getItem.ItemCount;
            }
            let showItem = this.showItem;
            WindowManager.getInstance().popView(false, function () {
                if (showItem){
                    CommonWnd.showTreasuerExploit(getItem);
                }
            }, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            this.waitForClose = false;
            this.showItem = false;
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_RECV_MAIL_REWARD, this.closeWindow, this);
            this.setAttachments();
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

    updateMailDetail: function (data) {
        this.data = data;
        this.labelTitle.string = data.Subject;
        this.richText.string = data.Content;

        this.mailWithOutAttachSendReadSeq();
        // this.setAttachments();
    },

    mailWithOutAttachSendReadSeq: function () {
        let MAIL_NOT_READ = 0, MAIL_READED = 1;
        let MAIL_WITHOUT_ATTACH = 0, MAIL_WITH_ATTACH = 1;
        if (this.data.ReadStatus == MAIL_NOT_READ) {
            if (this.data.Attachments.length == MAIL_WITHOUT_ATTACH) {
                this.btnRecv.interactable = false;
                this.scrollViewAttach.node.active = false;
                GlobalVar.handlerManager().mailHandler.sendReadMailReq(this.data.MailID);
            }else{
                this.btnRecv.interactable = true;
                this.scrollViewAttach.node.active = true;
            }
        } else if (this.data.ReadStatus == MAIL_READED) {
            this.btnRecv.interactable = false;
            this.scrollViewAttach.node.active = false;
        }
    },

    setAttachments: function () {
        this.scrollViewAttach.content.removeAllChildren();
        let attachs = this.data.Attachments;
        for (let i = 0; i < attachs.length; i++) {
            let itemObj = cc.instantiate(this.itemPrefabs);
            itemObj.getComponent("ItemObject").updateItem(attachs[i].ItemID, attachs[i].ItemCount);
            // itemObj.getComponent("ItemObject").setAllVisible(false);
            itemObj.getComponent("ItemObject").setClick(true, 2);
            this.scrollViewAttach.content.addChild(itemObj);
        }
        this.scrollViewAttach.scrollToLeft(0.2);
        this.scrollViewAttach.content.getComponent(cc.Layout).updateLayout();
    },

    onBtnRecvMail: function () {
        //带附件的邮件，领取附件才算是已读
        this.btnRecv.enabled = false;
        this.btnRecv.node.color = cc.color(160, 160, 160);
        GlobalVar.handlerManager().mailHandler.sendReadMailReq(this.data.MailID);
        this.waitForClose = true;
    },

    closeWindow: function () {
        if (this.waitForClose){
            this.showItem = true;
            this.close();
        }
    },

});
