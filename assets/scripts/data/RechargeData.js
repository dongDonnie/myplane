
const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");

var self = null;
var rechargeData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function() {
        self = this;
        self.token = "";
        self.data = {};
    },

    setData: function(data){
        if (!data){
            return;
        }
        self.data = data;
        GlobalVar.me().setVoucher(data.Bag.RcgVoucher);
        // GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_RCGBAG_RESULT, data);
    },

    getData: function(){
        return self.data;
    },

    getRechargeCountByRechargeID: function (rechargeID) {
        let rcgRecord = self.data.Bag.RcgRecord;
        for(let i = 0; i< rcgRecord.length; i++){
            if (rcgRecord[i].RechargeID == rechargeID){
                return rcgRecord[i].Count;
            }
        }
        return 0;
    },

    getRechargeDataIndex: function (rechargeID) {
        let rcgRecord = self.data.Bag.RcgRecord;
        for(let i = 0; i< rcgRecord.length; i++){
            if (rcgRecord[i].RechargeID == rechargeID){
                return i;
            }
        }
        return -1;
    },

    getTimeCardLeftDayByID: function (rechargeID) {
        let timeCardData = self.data.Bag.TimeCard;
        let expireTime = -1;
        let leftDay = -1;
        for (let i = 0; i< timeCardData.length; i++){
            if (timeCardData[i].ID == rechargeID){
                expireTime = timeCardData[i].ExpireTime;
                break;
            }
        }
        if (expireTime != -1){
            // let todayTime = new Date().setHours(5, 0, 0, 0);

            let curTimeStamp = GlobalVar.me().serverTime;
            let curTime = new Date(curTimeStamp*1000 - GameServerProto.PT_DAYPASS_CLOCKTIME*1000);
            let crossTime = (curTime.getHours()*3600 + curTime.getMinutes()*60 + curTime.getSeconds())
            let todayZeroTime = (curTimeStamp - GameServerProto.PT_DAYPASS_CLOCKTIME) - crossTime;
            let todayTime = todayZeroTime + GameServerProto.PT_DAYPASS_CLOCKTIME;

            let leftTime = expireTime - todayTime;
            leftDay = leftTime/(3600*24);
        }

        return leftDay;
    },

    getTimeCardDrawToday: function (rechargeID) {
        let timeCardData = self.data.Bag.TimeCard;
        for (let i = 0; i< timeCardData.length; i++){
            if (timeCardData[i].ID == rechargeID){
                return timeCardData[i].DrawToday;
            }
        }
        return -1;
    },

    setRechargeResult: function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            GlobalVar.me().setVoucher(data.OK.RcgVoucher);
            GlobalVar.me().setDiamond(data.OK.DiamondCur);
            self.data.Bag.TimeCard = data.OK.TimeCard;
            let index = self.getRechargeDataIndex(data.OK.RcgRecord.RechargeID);
            if (index == -1){
                self.data.Bag.RcgRecord.push({
                    RechargeID:data.OK.RcgRecord.RechargeID,
                    Count: data.OK.RcgRecord.Count,
                });
            }else{
                self.data.Bag.RcgRecord[index].Count = data.OK.RcgRecord.Count;
            }
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_RECHARGE_RESULT, data);
        // self.setData(data.OK);
    },

    setVoucherResult: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            GlobalVar.me().setVoucher(data.Voucher);
            GlobalVar.me().setDiamond(data.Diamond);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_VOUCHER_RESULT, data);
        // self.setData(data.OK);
    }
});

module.exports = rechargeData;