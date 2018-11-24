
const RootBase = require("RootBase");
const WindowManager = require("windowmgr");
const GlobalVar = require('globalvar')
const WndTypeDefine = require("wndtypedefine");
const EventMsgID = require("eventmsgid");
const GameServerProto = require("GameServerProto");
const CommonWnd = require("CommonWnd");
const i18n = require('LanguageData');

const TAB_NEWTASK = 0, TAB_DAILYMISSION = 1;
const BUTTON_INACTIVE = 0, BUTTON_ACTIVE = 1;

const AUDIO_COMMIT_MISSTION = 'cdnRes/audio/main/effect/zhihuiguan-zhuangbeihecheng';

cc.Class({
    extends: RootBase,

    properties: {
        nodeTabSprite: {
            default: [],
            type: [cc.Sprite],
        },
        nodeTabContent: {
            default: [],
            type: [cc.Node],
        },
        curTab: {
            default: TAB_DAILYMISSION,
            visible: false,
        },
        nodeDailyModel: {
            default: null,
            type: cc.Node,
        },
        nodeItemRewardModel: {
            default: null,
            type: cc.Node,
        },
        nodeQuestModel: {
            default: null,
            type: cc.Node,
        },
        completeQuestCount: {
            default: 0,
            visible: false,
        },
        dailyNotInit: {
            default: true,
            visible: false,
        },
        newTaskNotInit: {
            default: true,
            visible: false,
        },
        alreadSaveData: {
            default: false,
            visible: false,
        },
        dailyScroll: {
            default: null,
            type: cc.ScrollView,
        }
    },

    onLoad: function () {
        i18n.init('zh');
        this.typeName = WndTypeDefine.WindowType.E_DT_NORMAL_DAILY_MISSION_WND;

        this.animeStartParam(0, 0);
        // this.onBtnTapClick();
        this.isFirstIn = true;
        this.nodeTabContent[TAB_DAILYMISSION].getChildByName("nodeRewards").active = false;
    },

    onDestroy: function(){
        GlobalVar.eventManager().removeListenerWithTarget(this);
    },

    animeStartParam(paramScale, paramOpacity) {
        this.node.setScale(paramScale, paramScale);
        this.node.opacity = paramOpacity;
    },

    animePlayCallBack(name) {
        if (name == "Escape") {
            this._super("Escape");
            GlobalVar.eventManager().removeListenerWithTarget(this);
            WindowManager.getInstance().popView(false, null, false, false);
        } else if (name == "Enter") {
            this._super("Enter");
            //接到消息后再初始化窗口
            this.recvLock = false;
            this.nodeTabContent[TAB_DAILYMISSION].getChildByName("nodeRewards").active = true;
            this.registerEvent();
            this.initDailyWnd();
            this.checkRedPoint();
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

    onBtnClose: function () {
        this.canClose && this.close()
    },

    close: function () {
        // if (this.nodeTabContent[TAB_DAILYMISSION].active){
        //     this.dailyScroll.loopScroll.releaseViewItems();
        // }
        // // this.nodeTabContent[TAB_DAILYMISSION].active = false;
        // this.nodeTabContent[TAB_DAILYMISSION].getChildByName("nodeRewards").active = false;
        // if (this.nodeTabContent[TAB_NEWTASK].active){
        //     this.nodeTabContent[TAB_NEWTASK].active = false
        // }
        if (this.curTab == TAB_DAILYMISSION){
            this.dailyScroll.loopScroll.releaseViewItems();
        }
        this.nodeTabContent[this.curTab].active = false;
        
        this._super();
    },

    registerEvent: function () {
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GETDAILY_DATA, this.setSaveData, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GETDAILY_REAWRD, this.showDailyReward, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_GETDAILY_ACTIVE_REWARD, this.showDailyActiveReward, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_NEWTASK_REWARD, this.showNewTaskReward, this);
        GlobalVar.eventManager().addEventListener(EventMsgID.EVENT_DAILY_FLAG_CHANGE, this.setDailyFlag, this);
    },

    setDefaultTab: function (index) {
        if (typeof index == 'undefined'){
            index = TAB_DAILYMISSION;
        }
        this.setTABShowHide(index);
        this.curTab = index;
    },

    setSaveData: function () {
        this.alreadSaveData = true;
        this.initDailyWnd();
    },

    initDailyWnd: function () {
        // if (this.curTab == TAB_DAILYMISSION && this.dailyNotInit) {
        if (this.curTab == TAB_DAILYMISSION) {
            this.initDailyTab();
            this.dailyNotInit = false;
        } else if (this.curTab == TAB_NEWTASK) {
        // } else if (this.curTab == TAB_NEWTASK && this.newTaskNotInit) {
            this.initChallengeTab();
            this.newTaskNotInit = false;
        }
    },
    checkRedPoint: function (){
        // 挑战的红点
        let newTask = GlobalVar.me().dailyData.getNewTaskData();
        if (newTask) {
            let taskData = GlobalVar.tblApi.getDataBySingleKey('TblNewTask', newTask.TaskID);
            if (taskData) {
                let maxRate = taskData.nVar;
                let curRate = newTask.Var;
                if (curRate > maxRate){
                    curRate = maxRate;
                }
                this.node.getChildByName("btnChallenge").getChildByName("spriteHot").active = (curRate == maxRate);
            }
        }

        //今日任务的红点
        let flags = GlobalVar.me().statFlags;
        this.node.getChildByName("btnDaily").getChildByName("spriteHot").active = !!flags.DailyFlag;
    },
    setDailyFlag: function(event){
        let flags = GlobalVar.me().statFlags;
        this.node.getChildByName("btnDaily").getChildByName("spriteHot").active = !!flags.DailyFlag;
    },

    onBtnTapClick: function (event, index) {
        WindowManager.getInstance().lockBtn();
        if (typeof index == 'undefined' || index < TAB_NEWTASK || index > TAB_DAILYMISSION) {
            index = TAB_DAILYMISSION;
        }
        if (this.curTab == index){
            return;
        }
        this.curTab = index;
        if (index == TAB_DAILYMISSION) {
            if (this.alreadSaveData) {
                this.initDailyWnd();
            } else {
                GlobalVar.handlerManager().dailyHandler.sendGetDailyDataReq();
            }
        }else{
            this.initDailyWnd();
        }

        this.setTABShowHide(index);
        // this.initDailyWnd();
    },

    setTABShowHide: function(index){
        //默认初始化日常任务选项卡
        for (let i = 0; i < this.nodeTabContent.length; i++) {
            if (i == index) {
                this.nodeTabContent[i].active = true;
                this.nodeTabSprite[i].setFrame(BUTTON_ACTIVE);
            } else {
                this.nodeTabContent[i].active = false;
                this.nodeTabSprite[i].setFrame(BUTTON_INACTIVE);
            }
        }
    },

    initChallengeTab: function () {
        let nodeChallenge = this.nodeTabContent[TAB_NEWTASK];
        // 获取新手引导的进度信息
        let newTaskRate = GlobalVar.me().dailyData.getNewTaskData();
        if (newTaskRate) {
            let taskData = GlobalVar.tblApi.getDataBySingleKey('TblNewTask', newTaskRate.TaskID);
            if (taskData) {
                nodeChallenge.getChildByName("labelMisstionDesc").getComponent(cc.Label).string = taskData.strName;
                nodeChallenge.getChildByName("labelMisstionDesc").opacity = 255;

                // 初始化进度
                let nodeRate = nodeChallenge.getChildByName("nodeRate");
                let maxRate = taskData.nVar;
                let curRate = newTaskRate.Var;
                if (curRate == -1) return;
                if (curRate > maxRate) {
                    curRate = maxRate;
                }
                // 红点
                this.node.getChildByName("btnChallenge").getChildByName("spriteHot").active = (curRate == maxRate);

                // 按钮
                if (curRate == maxRate) {
                    nodeChallenge.getChildByName("btnRecv").active = true;
                    nodeChallenge.getChildByName("btnGo").active = false;
                } else {
                    nodeChallenge.getChildByName("btnRecv").active = false;
                    nodeChallenge.getChildByName("btnGo").active = true;
                }
                nodeRate.opacity = 255;
                nodeRate.getChildByName("labelMaxRate").getComponent(cc.Label).string = maxRate;
                nodeRate.getChildByName("labelCurRate").getComponent(cc.Label).string = curRate;
                nodeRate.getComponent(cc.Layout).updateLayout();
                nodeRate.getComponent(cc.Widget).updateAlignment();
                // if (curRate < maxRate) {
                //     nodeRate.getChildByName("labelCurRate").color = cc.Color.RED;
                // } else {
                //     nodeRate.getChildByName("labelCurRate").color = cc.Color.WHITE;
                // }

                if (cc.game.renderType != cc.game.RENDER_TYPE_WEBGL) {
                    nodeChallenge.getChildByName("progressActiveBar").getComponent(cc.ProgressBar).progress = curRate / maxRate;
                } else {
                    let curProgress = nodeChallenge.getChildByName("progressActiveBar").getComponent(cc.ProgressBar).progress
                    if (curProgress <= curRate/maxRate){
                        nodeChallenge.getChildByName("progressActiveBar").runAction(cc.progressLoading(0.2, curProgress, curRate / maxRate));
                    }else{
                        nodeChallenge.getChildByName("progressActiveBar").runAction(cc.progressLoading(0.2, 0, curRate / maxRate));
                    }
                }
                // 初始化任务奖励
                let itemVecs = taskData.oVecReward;
                nodeChallenge.getChildByName("nodeReward").removeAllChildren();
                for (let i = 0; i < itemVecs.length; i++) {
                    let itemObj = cc.instantiate(this.nodeItemRewardModel);
                    itemObj.active = true;
                    nodeChallenge.getChildByName("nodeReward").addChild(itemObj);
                    let itemData = itemObj.getChildByName("ItemObject").getComponent("ItemObject").updateItem(itemVecs[i].wItemID, itemVecs[i].nCount);
                    itemObj.getChildByName("ItemObject").getComponent("ItemObject").setClick(true, 2);
                    itemObj.getChildByName("labelName").getComponent(cc.Label).string = itemData.strName;
                }
                nodeChallenge.getChildByName("nodeReward").getComponent(cc.Layout).updateLayout();
            }
        }

        this.canClose = true;
    },

    initDailyTab: function () {
        // console.log("initDailyTab");
        // 初始化日常任务列表
        // this.completeQuestCount = 0;
        // let nodeDaily = this.nodeTabContent[TAB_DAILYMISSION];
        // let content = nodeDaily.getChildByName("nodeMisstion").getChildByName("scrollviewDaily").getComponent(cc.ScrollView).content;
        // content.removeAllChildren();
        let dailyDatas = GlobalVar.tblApi.getData('TblDaily');
        // 把每日任务排序

        this.dailyDatas = this.sortDailyData(dailyDatas);

        // 初始化活跃度宝箱列表
        this.initActiveBoxList();

        //初始化活跃进度条
        this.initActiveBar();

        //初始化任务详情
        this.initDailyMisstion();
    },

    initDailyMisstion: function(){

        let showDataList = [];
        for(let i = 0; i<this.dailyDatas.length; i++){
            if (!this.checkDelDaily(i)){
                showDataList.push(this.dailyDatas[i]);
            }
        }

        if (showDataList.length > 0){
            let self = this;
            self.canClose = false;
            if (this.isFirstIn){
                this.isFirstIn = false;
                this.dailyScroll.loopScroll.setTotalNum(showDataList.length);
                this.dailyScroll.loopScroll.setCreateModel(this.nodeDailyModel);
                this.dailyScroll.loopScroll.saveCreatedModel(this.dailyScroll.content.children);
                this.dailyScroll.loopScroll.registerUpdateItemFunc(function(daily, index){
                    // self.updateDaily(daily, showDataList[index]);
                    daily.getComponent("DailyObject").updateDaily(showDataList[index]);
                });
                this.dailyScroll.loopScroll.registerCompleteFunc(function(){
                    self.canClose = true;
                })
                this.dailyScroll.loopScroll.resetView();
            }else{
                this.dailyScroll.scrollToTop(0);
                this.dailyScroll.loopScroll.setTotalNum(showDataList.length);
                this.dailyScroll.loopScroll.registerUpdateItemFunc(function(daily, index){
                    daily.getComponent("DailyObject").updateDaily(showDataList[index]);
                });
                this.dailyScroll.loopScroll.initParameter();
                this.dailyScroll.loopScroll.resetView();
                // this.dailyScroll.loopScroll.refreshViewItem();
            }
        }else{
            this.canClose = true;
            let nodeDaily = this.nodeTabContent[TAB_DAILYMISSION];
            nodeDaily.getChildByName("nodeMisstion").active = false;
            nodeDaily.getChildByName("nodeComplete").active = true;
        }


        // self.canClose = true;

        // this.dailyScroll.node.y = this.dailyScroll.node.y - 200;
        // this.dailyScroll.node.runAction(cc.sequence(cc.moveBy(0.15, 0, 220), cc.moveBy(0.1, 0 , -20)));
    },

    initActiveBoxList: function(){
        // 初始化活跃度宝箱列表
        let nodeDaily = this.nodeTabContent[TAB_DAILYMISSION];
        let curActive = nodeDaily.getChildByName("labelActiveValue").getComponent(cc.Label).string = GlobalVar.me().dailyData.getActive();
        let rewardBoxData = GlobalVar.tblApi.getData('TblDailyActive');
        let boxList = nodeDaily.getChildByName("nodeRewards").getChildByName("nodeBoxes").children;
        let index = 0;
        for (let key in rewardBoxData) {
            let box = boxList[index];
            box.rewardData = rewardBoxData[key].oVecReward;
            box.getChildByName("labelActiveRequire").getComponent(cc.Label).string = rewardBoxData[key].nActive + "活跃";
            box.getChildByName("btnRewardBox").getComponent(cc.Button).clickEvents[0].customEventData = rewardBoxData[key].nActive;
            if (GlobalVar.me().dailyData.isActiveRewardReceived(key)) {
                box.getChildByName("btnRewardBox").getComponent("RemoteSprite").setFrame(2);
                box.getChildByName("btnRewardBox").getChildByName("spriteHot").active = false;
            } else if (curActive >= key) {
                box.getChildByName("btnRewardBox").getComponent("RemoteSprite").setFrame(1);
                box.getChildByName("btnRewardBox").getChildByName("spriteHot").active = true;
            } else {
                box.getChildByName("btnRewardBox").getComponent("RemoteSprite").setFrame(0);
                box.getChildByName("btnRewardBox").getChildByName("spriteHot").active = false;
            }
            index += 1;
        }
    },

    initActiveBar: function(){
        //初始化活跃进度条
        let nodeDaily = this.nodeTabContent[TAB_DAILYMISSION];
        let nodeRewards = nodeDaily.getChildByName("nodeRewards");
        let progressActive = nodeRewards.getChildByName("progressActiveBar");
        let rewardBoxData = GlobalVar.tblApi.getData('TblDailyActive');
        let rewardList = [];
        for (let key in rewardBoxData) {
            rewardList.push(rewardBoxData[key].nActive);
        }
        let curActive = GlobalVar.me().dailyData.getActive();


        if (curActive > 0 && curActive <= rewardList[0]) {
            curActive = curActive;
        }
        else if (curActive > rewardList[0] && curActive <= rewardList[1]) {
            curActive = (curActive - rewardList[0]) * 1.5 + rewardList[0];
        }
        else if (curActive > rewardList[1] && curActive <= rewardList[2]) {
            curActive = (curActive - rewardList[1]) * 0.6 + (rewardList[1] - rewardList[0]) * 1.5 + rewardList[0];
        }
        else if (curActive > rewardList[2] && curActive <= rewardList[3]) {
            curActive = (curActive - rewardList[2]) * 1.5 + (rewardList[2] - rewardList[1])*0.6 + (rewardList[1]-rewardList[0])*1.5 + rewardList[0];
        }
        let percent = curActive / rewardList[3];
        // console.log("!!!!!!!!!!!!!!!!!!!", percent);
        let curPercent = progressActive.getComponent(cc.ProgressBar).progress
        if (cc.game.renderType != cc.game.RENDER_TYPE_WEBGL) {
            progressActive.getComponent(cc.ProgressBar).progress = percent;
        } else {
            if (curPercent<=percent){
                progressActive.runAction(cc.progressLoading(0.3, curPercent, percent))
            }else{
                progressActive.runAction(cc.progressLoading(0.3, 0, percent))
            }
            // progressActive.getComponent(cc.ProgressBar).progress = percent;
        }
    },

    onActiveRewardBoxClick: function (event, active) {
        // if(this.checkIsLock()){
        //     return;
        // }
        // 是否达到领取条件
        let condition = GlobalVar.me().dailyData.getActive() >= active;
        // 活跃宝箱的内容
        let rewardBoxData = event.target.parent.rewardData;

        let confirmText = "领取";
        // 判断活跃宝箱是否已领取
        if (GlobalVar.me().dailyData.isActiveRewardReceived(active)) {
            condition = false;
            confirmText = "已领取"
        }

        // 点击领取发送事件
        let confirm = function () {
            GlobalVar.handlerManager().dailyHandler.sendDailyActiveRewardReq(active);
        }

        if (rewardBoxData) {
            CommonWnd.showRewardBoxWnd(null, "活跃宝箱", condition, rewardBoxData, null, confirm, null, confirmText);
        }
    },

    sortDailyData: function (dailyDatas) {
        let arr = [];
        function compare(property1, property2) {
            return function (a, b) {
                let value1 = a['wID'] == GameServerProto.PT_DAILY_TASK_VIP_EXP;
                let value2 = b['wID'] == GameServerProto.PT_DAILY_TASK_VIP_EXP;
                let aCurStep = 0;
                let aServerStep = GlobalVar.me().dailyData.getDailyStepsByID(a['wID']);
                if (aServerStep) {
                    aCurStep = aServerStep;
                }
                if (a.nVar <= aCurStep) {
                    value1 = value1 || true;
                }
                let bCurStep = 0;
                let bServerStep = GlobalVar.me().dailyData.getDailyStepsByID(b['wID']);
                if (bServerStep) {
                    bCurStep = bServerStep;
                }
                if (b.nVar <= bCurStep) {
                    value2 = value2 || true;
                }
                value1 = value1 ? 1 : 0;
                value2 = value2 ? 1 : 0;
                if (value1 != value2) {
                    return -(value1 - value2);
                } else {
                    let value3 = a[property1];
                    let value4 = b[property1];
                    if (value3 != value4) {
                        return value3 - value4;
                    } else {
                        // 在第一个属性相等的情况下比较第二个属性
                        let value5 = a[property2];
                        let value6 = b[property2];
                        return value5 - value6;
                    }
                }
            }
        }
        // 把Tbl表中读到的日常任务数据转化成数组
        for (let key in dailyDatas) {
            arr.push(dailyDatas[key]);
        }
        // 按照bySort和wID两个属性来排序
        arr.sort(compare("bySort", "wID"));
        return arr;
    },

    onDailyBtnRecvClick: function (event) {
        // let dailyData = event.target.parent.data;
        if (!this.recvLock){
            this.targetDailyNode = event.target.parent;
            this.targetDailyNode.getComponent("DailyObject").onDailyBtnRecvClick();
            this.recvLock = true;
        }
        // console.log("RecvBtnClick")
        // GlobalVar.handlerManager().dailyHandler.sendDailyRewardReq(dailyData.wID);
    },
    onDailyBtnGoClick: function (event) {
        if (!this.recvLock){
            event.target.parent.getComponent("DailyObject").onDailyBtnGoClick();
         }
        // let dailyData = event.target.parent.data;
        // let windowID = dailyData.wWindowID;
        // console.log("goBtnClick = ", windowID);
        // this.goToWnd(windowID);
    },

    showDailyActiveReward: function (event) {
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showTreasuerExploit(event.Item);
        this.initActiveBoxList();
    },

    showDailyReward: function (event) {
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            this.recvLock = false;
            return;
        }

        // 播放音效
        GlobalVar.soundManager().playEffect(AUDIO_COMMIT_MISSTION);

        this.targetDailyNode.runAction(cc.fadeOut(0.3));
        let effect = this.targetDailyNode.getChildByName("nodeEffect");
        effect.active = true;
        effect.getComponent(sp.Skeleton).clearTracks();
        effect.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
        let self = this;
        effect.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName == "animation") {
                effect.active = false;

                self.initActiveBoxList();
                self.initActiveBar();
                self.count = -1;
                self.complete = false;
                self.dailyCount = 0;
        
                self.initDailyMisstion();
                self.recvLock = false;
                CommonWnd.showTreasuerExploit(event.Item);
            }
        });
    },

    showNewTaskReward: function (event) {
        if (event.ErrCode && event.ErrCode != GameServerProto.PTERR_SUCCESS) {
            GlobalVar.comMsg.errorWarning(event.ErrCode);
            return;
        }
        CommonWnd.showTreasuerExploit(event.Item);
        this.initChallengeTab();
    },

    onNewTaskBtnRecvClick: function (event) {
        let newTaskRate = GlobalVar.me().dailyData.getNewTaskData();
        GlobalVar.handlerManager().dailyHandler.sendNewTaskRewardReq(newTaskRate.TaskID);
    },
    onNewTaskBtnGoClick: function (event) {
        let newTaskRate = GlobalVar.me().dailyData.getNewTaskData();
        let taskData = GlobalVar.tblApi.getDataBySingleKey('TblNewTask', newTaskRate.TaskID);
        let windowID = taskData.wWindowID;
        // console.log("goBtnClick = ", windowID);
        this.goToWnd(windowID);
    },

    goToWnd: function (windowID) {
        // if(this.checkIsLock()){
        //     return;
        // }
        switch (windowID) {
            case WndTypeDefine.WindowTypeID.E_DT_NORMALEQUIPMENT_WND:            //跳转至装备强化
                GlobalVar.eventManager().removeListenerWithTarget(this);
                WindowManager.getInstance().popView(false, function () {
                    WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMALIMPROVEMENT_WND, function (wnd, name, type) {
                        wnd.getComponent(type).selectEquipment(null, 1);
                    }, true, false);
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMAL_QUESTLIST_VIEW:          //跳转至关卡界面
                GlobalVar.eventManager().removeListenerWithTarget(this);
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showQuestList();
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMAL_RECHARGE_WND:           //弹出充值窗口
                GlobalVar.eventManager().removeListenerWithTarget(this);
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showRechargeWnd();
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMAL_SP_WND:                 //弹出购买体力窗口
                GlobalVar.eventManager().removeListenerWithTarget(this);
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showBuySpConfirmWnd(null, i18n.t('label.4000230'), null, null, null, i18n.t('label.4000214'), i18n.t('label.4000249'));
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMAL_STORE_WND:              //弹出商店窗口
                GlobalVar.eventManager().removeListenerWithTarget(this);
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showStoreWithParam(1);
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMALDRAW_VIEW:               //弹出十连抽窗口
                GlobalVar.eventManager().removeListenerWithTarget(this);
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showDrawView();
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_GUAZAIMAIN_WND:                //挂载首页
                GlobalVar.eventManager().removeListenerWithTarget(this);
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showGuazai();
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_ENDLESS_CHALLENGE_VIEW:        //无尽挑战
                GlobalVar.eventManager().removeListenerWithTarget(this);
                WindowManager.getInstance().popView(false, function () {
                    CommonWnd.showEndlessView();
                }, false, false);
                break;
            case WndTypeDefine.WindowTypeID.E_DT_NORMAL_RICHTREASURE_WND:       //淘金
                GlobalVar.eventManager().removeListenerWithTarget(this);
                WindowManager.getInstance().popView(false, function () {
                    GlobalVar.handlerManager().drawHandler.sendTreasureData();
                }, false, false);
                break;
            default:
                // this.unLockBtn();
                break;
        }
    },

    // addDaily: function (index) {
    //     if (index >= this.dailyDatas.length) {
    //         return;
    //     }
    //     if ((index + 1) >= this.dailyDatas.length) {
    //         this.complete = true;
    //     }
    //     if (this.checkDelDaily(index)) {
    //         this.count += 10;
    //         this.addDaily(this.count / 10);
    //         return;
    //     }

    //     let nodeDaily = this.nodeTabContent[TAB_DAILYMISSION];
    //     let content = nodeDaily.getChildByName("nodeMisstion").getChildByName("scrollviewDaily").getComponent(cc.ScrollView).content;

    //     let isUpdateDailyModel = false;
    //     if (content.children[this.dailyCount]) {
    //         this.updateDaily(content.children[this.dailyCount], this.dailyDatas[index]);
    //         isUpdateDailyModel = true;
    //     }
    //     else {
    //         let daily = cc.instantiate(this.nodeDailyModel);
    //         daily.opacity = 255;
    //         content.addChild(daily);
    //         this.updateDaily(daily, this.dailyDatas[index])
    //         daily.x = -1000;
    //         let self = this;
    //         daily.runAction(cc.sequence(cc.moveBy(1 / 4, 1000, 0), cc.callFunc(() => {
    //             self.count += 10;
    //             self.addDaily(self.count / 10);
    //         })));
    //     }

    //     this.dailyCount += 1;
    //     if (this.complete) {
    //         // nodeDaily.getChildByName("nodeMisstion").getChildByName("scrollviewDaily").getComponent(cc.ScrollView).scrollToTop();
    //         if (content.children.length == 0) {
    //             // 没有任务加载到content中说明能做的任务已经全部完成了
    //             nodeDaily.getChildByName("nodeMisstion").active = false;
    //             nodeDaily.getChildByName("nodeComplete").active = true;
    //         } else {
    //             if (content.children.length > this.dailyCount) {
    //                 content.children[content.children.length - 1].destroy();
    //             }
    //         }
    //         content.getComponent(cc.Layout).updateLayout();
    //         this.dirty = false;
    //     }

    //     if (isUpdateDailyModel) {
    //         this.count += 10;
    //         this.addDaily(this.count / 10);
    //     }
    // },

    checkDelDaily: function (index) {
        let data = this.dailyDatas[index];
        if (!data) return;
        //当服务器发来的该任务的完成状态为0，意为已经领取，将该任务排除
        let state = GlobalVar.me().dailyData.getDailyStateByID(data.wID);
        if (state == 0) return true;
        //当该任务为领取体力的任务，而还未到时间的时候，将该任务移除
        if (data.wID == GameServerProto.PT_DAILY_TASK_SP1 || data.wID == GameServerProto.PT_DAILY_TASK_SP2) {
            let curTimeStamp = GlobalVar.me().serverTime;
            let curTime = GlobalVar.serverTime.getCurrentHHMMSS(curTimeStamp * 1000);
            let time = curTime[0] * 100 + curTime[1];
            if (time > data.wEndTime || time < data.wStartTime) {
                return true;
            }
        }
        //当玩家vip等级为0时，排除指定任务
        let vipLevel = GlobalVar.me().vipLevel;
        if (vipLevel == 0 && data.wID == GameServerProto.PT_DAILY_TASK_VIP) {
            return true;
        }
        //当该任务为月卡任务且IOS支付开关未开启时，排除任务
        if (data.wID == GameServerProto.PT_DAILY_TASK_HIGH_MONTHCARD || data.wID == GameServerProto.PT_DAILY_TASK_MONTHCARD || data.wID == GameServerProto.PT_DAILY_TASK_CZ){
            return GlobalVar.srcSwitch();
        }

        return false;
    }
});
