
const GlobalVar = require('globalvar');
const EventMsgID = require("eventmsgid");
const GameServerProto= require("GameServerProto");

const STARSTATE_START_INDEX = 0;
const STARSTATE_LENGTH = 3;
const BUYTIME_START_INDEX = 3;
const BUYTIME_LENGTH = 4;
const PLAYSTATE_START_INDEX = 7;
const PLAYSTATE_LENGTH = 1;

var self = null;
var campData = cc.Class({

    properties: {
        data: null,
    },

    ctor: function () {
        self = this;
        self.token = "";
        self.data = {};
        self.gameEndData = {};
    },

    saveData: function (data) {
        if (!data) {
            return;
        }
        // self.data[data.Type] = self.unpackCampBagData(data);
        self.data[data.Type] = data.CampBag;
        // 在关卡信息界面如果没有数据会发消息，此处发送事件给通知关卡信息界面数据已经加载完毕
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_REGET_CHAPTER_DATA);
    },

    isDataValid: function (campaignType) {
        //返回该类型的关卡数据是否有效
        return !!self.data[campaignType];
    },

    // unpackCampBagData: function (data) {
    //     // 分解数据
    //     let packData = data.CampBag.Chapter;
    //     let unpackData = {}
    //     for (let i = 0; i < packData.length; i++) {
    //         let chapter = packData[i];
    //         let campaigns = chapter.Campaign;
    //         // for (let j = 0; j < campaigns.length; j++) {
    //         //     let campaign = campaigns[j];
    //         //     self.unpackCampaignData(campaign);
    //         // }
    //         unpackData[chapter.ChapterID] = campaigns;
    //     }
    //     return unpackData;
    // },

    // unpackCampaignData: function (campaign) {
    //     // 将state变量按二进制位数分割为三个属性
    //     let status = campaign.Status.toString(2);
    //     let s1 = "00000000";
    //     let len = status.length;
    //     if (len < s1.length) {   //补齐
    //         let s2 = s1.slice(0, 8 - len);
    //         status = s2 + status;
    //     }
    //     // 按位数分割
    //     let strStarCount = status.substr(STARSTATE_START_INDEX, STARSTATE_LENGTH)
    //     let starCount = parseInt(strStarCount, 2);
    //     let strBuyTimes = status.substr(BUYTIME_START_INDEX, BUYTIME_LENGTH)
    //     let buyTimes = parseInt(strBuyTimes, 2);
    //     let strPlayState = status.substr(PLAYSTATE_START_INDEX, PLAYSTATE_LENGTH)
    //     let playState = parseInt(strPlayState, 2);
    //     //保存数据
    //     campaign.StarCount = starCount;
    //     campaign.BuyTimes = buyTimes;
    //     campaign.PlayState = playState ? true : false;
    // },

    getChapterData: function (campaignType, chapterID) {
        let CampBag = self.data[campaignType];
        if (!CampBag || !CampBag.Chapter) {
            return false;
        }
        let chapter = CampBag.Chapter[chapterID - 1];
        if (!chapter){
            return false;
        }
        return chapter.Campaign;
    },

    getLastChapterID: function (campaignType) {
        let CampBag = self.data[campaignType];
        if (!CampBag || !CampBag.Chapter) {
            return false;
        }

        return CampBag.Chapter.length;
    },

    getLastCampaignID: function (campaignType) {
        let CampBag = self.data[campaignType];
        if (!CampBag || !CampBag.Chapter) {
            return -1;
        }
        let chapters = CampBag.Chapter;
        let lastCampaign = 0;
        for (let i = 0; i < chapters.length; i++) {
            let chapter = chapters[i];
            lastCampaign += chapter.Campaign.length;
        }
        return lastCampaign;
    },

    getChapterStarCount: function (campaignType, chapterID){
        let CampBag = self.data[campaignType];
        if (!CampBag || !CampBag.Chapter) {
            return 0;
        }
        let chapter = CampBag.Chapter[chapterID - 1];
        if (!chapter){
            return 0;
        }
        let campaigns = chapter.Campaign;
        let starCount = 0;
        for (let i = 0; i< campaigns.length; i++){
            let camp = campaigns[i];
            starCount += camp.Star;
        }
        return starCount;
    },

    getGameEndData: function (){
        if (self.gameEndData){
            return self.gameEndData;
        }
        self.gameEndData = {};
    },

    isChapterRewardReceived: function(campaignType, chapterID, pos){
        let CampBag = self.data[campaignType];
        if (!CampBag || !CampBag.Chapter) {
            return false;
        }
        let chapter = CampBag.Chapter[chapterID - 1];
        if (!chapter){
            return false;
        }
        if (chapter.RewardDraw){
            if(chapter.RewardDraw[pos - 1] == 1){
                return true;
            }
        }
        return false;
    },

    setRecvDrawRewardData:function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            GlobalVar.me().setGold(data.OK.GoldCur);
            GlobalVar.me().setDiamond(data.OK.DiamondCur);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_CAMP_DRAWREWARD_NTF, data);
    },

    setRecvFreeDrawData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {
            
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_CAMP_FREEDRAW_NTF, data);
    },

    setRecvChapterRewardData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            let CampBag = self.data[data.OK.CampType];
            let chapter = CampBag.Chapter[data.OK.ChapterID - 1];
            chapter.RewardDraw[data.OK.Pos] = 1;
        }

        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_CHAPTER_REWARD, data);
    },

    setSweepResultData: function (data) {
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            GlobalVar.me().bagData.updateItemDataByGMDT_ITEM_CHANGE(data.OK.ItemChange);

            let campaigns = self.getChapterData(data.OK.CampType, data.OK.ChapterID);
            let campaign = campaigns[(data.OK.CampaignID - 1)%10];
            campaign.PlayCount = data.OK.PlayCount;

            GlobalVar.me().updatePlayerSp(data.OK.Sp);

            // GlobalVar.me().updatePlayerSp(data.OK.Sp);
            // GlobalVar.me().setDiamond(data.OK.DiamondCur);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_SWEEP_RESULT, data);
    },

    setCampBuyCountData: function (data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS) {

            let campaigns = self.getChapterData(data.OK.CampType, data.OK.ChapterID);
            let campaign = campaigns[(data.OK.CampaignID - 1)%10];
            campaign.BuyCount =  data.OK.Campaign.BuyCount;
            campaign.PlayCount = data.OK.Campaign.PlayCount;

            GlobalVar.me().setDiamond(data.OK.DiamondCur);
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_GET_BUY_COUNT_RESULT, data);
    },

    setRecvCampBeginData:function(data){
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_CAMP_BEGIN_NTF,data);
    },

    setRecvCampResultData:function(data){
        if (data.ErrCode == GameServerProto.PTERR_SUCCESS){
            this.gameEndData = data.OK;
        }
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_CAMP_RESULT_NTF, data);
    },

    setRecvCampReviveData: function(data){
        GlobalVar.eventManager().dispatchEvent(EventMsgID.EVENT_CAMP_REVIVE_ACK_RESULT, data);
    },

    setRecvCampActiveNtf: function(data){
        let campaignType = data.ChapterType;
        let CampBag = self.data[campaignType];
        if (!CampBag || !CampBag.Chapter) {
            return ;
        }
        let chapter = CampBag.Chapter[data.ChapterID - 1];
        if (!chapter){
            return;
        }
        let chapterData = chapter.Campaign;
        let campIndex = (data.CampaignID-1)%10;
        chapterData[campIndex] = data.Campaign;
    },

    setRecvChapterActiveNtf: function(data){
        let campaignType = data.ChapterType;
        let CampBag = self.data[campaignType];
        if (!CampBag || !CampBag.Chapter) {
            return ;
        }
        CampBag.Chapter[data.Chapter.ChapterID - 1] = data.Chapter;
    },
});

module.exports = campData;