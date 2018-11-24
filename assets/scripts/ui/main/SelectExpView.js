const GlobalVar = require("globalvar");
const WindowManager = require("windowmgr");
const WndTypeDefine = require("wndtypedefine");
const RootBase = require("RootBase");
const i18n = require('LanguageData');
const GlobalFunc = require('GlobalFunctions');
const EventMsgID = require("eventmsgid");

cc.Class({
    extends: RootBase,

    properties: {
        choosingCallback:{
            default:null,
            visible:false,
        }
    },

    onLoad: function () {
        this.typeName = WndTypeDefine.WindowType.E_DT_SELECTEXPVIEW_WND;
        this.animeStartParam(0, 0);
        // this.updateTabs();
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView();
        } else if (name == "Enter") {
            this._super("Enter");
            this.updateTabs();
            GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_BAG_ADDITEM_NTF, this.bagAddItem, this);
            this.getNodeByName('content').on('touchmove', this.touchmove, this);
        }
    },

    bagAddItem: function (data) {
        for (let i = 0; i < data.Items.length; i++) {
            let itemid = data.Items[i].ItemID;
            if (itemid == 501 || itemid == 502 || itemid == 503 || itemid == 504) {
                this.updateTabs();
                break;
            }
        }
    },

    touchmove: function (evt) {
        evt.stopPropagation();
        var content = this.getNodeByName('content');
        if (Math.abs(content.x) > (content.width / 2 - content.parent.width / 2)) {
            if (content.x > 0)
                content.x = (content.width / 2 - content.parent.width / 2);
            else
                content.x = -(content.width / 2 - content.parent.width / 2);
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

    setChoosingCallback:function(choosingCallback,){
        if(!!choosingCallback){
            this.choosingCallback=choosingCallback;
        }
    },

    btnClick:function(event,data){
        this.close();
        if(!!this.choosingCallback){
            this.choosingCallback(data);
        }
    },

    setState:function(tabIndex,isActive){
        let name="nodeTab"+tabIndex;
        let tab=this.getNodeByName(name);
        if(tab!=null){
            if(!isActive){
                tab.getComponent("RemoteSprite").setFrame(1);
                tab.getChildByName("item").getComponent("ItemObject").setShaderState(true);
                tab.getChildByName("labelName").color=GlobalFunc.getSystemColor(10);
                tab.getChildByName("labelExp").color=GlobalFunc.getSystemColor(11);
                tab.getChildByName("labelExpNumber").color=GlobalFunc.getSystemColor(11);
                tab.getChildByName("btnoSelect").getComponent(cc.Button).interactable=false;
            }else{
                tab.getComponent("RemoteSprite").setFrame(0);
                tab.getChildByName("item").getComponent("ItemObject").setShaderState(false);
                tab.getChildByName("labelName").color=GlobalFunc.getSystemColor(8);
                tab.getChildByName("labelExp").color=GlobalFunc.getSystemColor(9);
                tab.getChildByName("labelExpNumber").color=GlobalFunc.getSystemColor(9);
                tab.getChildByName("btnoSelect").getComponent(cc.Button).interactable=true;
            }
        }
    },

    updateTabs:function(){
        for(let i=1;i<=4;i++){
            let name="nodeTab"+i;
            let tab=this.getNodeByName(name);
            let id=500+i;
            let count=GlobalVar.me().bagData.getItemCountById(id);
            let item=tab.getChildByName("item").getComponent("ItemObject")
            item.updateItem(id,count);
            item.setClick(true, 1);
            let data=GlobalVar.tblApi.getDataBySingleKey('TblItem', id);
            tab.getChildByName("labelName").getComponent(cc.Label).string=data.strName;
            tab.getChildByName("labelExpNumber").getComponent(cc.Label).string=data.nResult;
            this.setState(i,count);
        }
        
    },
});