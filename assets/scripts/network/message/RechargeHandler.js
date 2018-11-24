
var HandlerBase = require("handlerbase")
var GlobalVar = require('globalvar')
var EventMsgID = require("eventmsgid")
var GameServerProto = require("GameServerProto");

var self = null;
cc.Class({
    extends: HandlerBase,

    ctor: function () {
        self = this;
    },

    initHandler: function (handlerMgr) {
        // handlerMgr.setKey(GameServerProto.GMID_NOTICE_ACK,GameServerProto.GMID_NOTICE_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_RCG_ACK,GameServerProto.GMID_RCG_REQ);
        // handlerMgr.setKey(GameServerProto.GMID_RCG_BAG_ACK,GameServerProto.GMID_RCG_BAG_REQ);

        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_RCG_ACK, self._recvRcgAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_RCG_BAG_ACK, self._recvRcgBagAck, self);
        GlobalVar.messageDispatcher.bindMsg(GameServerProto.GMID_VOUCHER_EXCHANGE_ACK, self._recvExchangeAck, self);
    },

    _recvRcgAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        if (msg.data.ErrCode != GameServerProto.PTERR_SUCCESS){
            GlobalVar.me().setDiamond(msg.data.OK.DiamondCur);
        }
        GlobalVar.me().rechargeData.setRechargeResult(msg.data);
    },

    sendRcgReq: function(rechargeID){
        let msg = {
            RechargeID: rechargeID,
        }
        
        self.sendMsg(GameServerProto.GMID_RCG_REQ, msg);
    },

    _recvRcgBagAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }

        GlobalVar.me().rechargeData.setData(msg.data);
    },

    sendRcgBagReq: function (reserv) {
        let msg = {
            Reserved: 0,
        }
        self.sendMsg(GameServerProto.GMID_RCG_BAG_REQ,msg);
    },

    sendVoucherReq: function (num) {
        let msg = {
            Num: num,
        }
        self.sendMsg(GameServerProto.GMID_VOUCHER_EXCHANGE_REQ, msg);
    },

    _recvExchangeAck: function (msgId, msg) {
        if (typeof msg != "object") {
            return;
        }
        GlobalVar.me().rechargeData.setVoucherResult(msg.data);
    },
});
