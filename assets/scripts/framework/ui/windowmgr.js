const GlobalVar = require("globalvar");
const ResMapping = require("resmapping");
const SceneDefines = require("scenedefines");
const WndTypeDefine = require("wndtypedefine");
const CommonDefine = require("define");

var WindowManager = cc.Class({
    extends: cc.Component,
    ctor: function () {
        this.vectorViewStack = [];
        this.mapViewData = {};
        // this.pushing = false;
        // this.pushingName='';
        this.addMask = false;
        this.openLog = false;
        this.itemLock = true;
        this.btnLock = true;
        this.btnLock1 = false;
        this.waitBtnCallback = false;
    },
    clearWindowMgr: function () {
        this.vectorViewStack = [];
        this.mapViewData = {};
        // this.pushing = false;
        // this.pushingName='';
        this.addMask = false;
        this.openLog = false;
        this.itemLock = true;
        this.btnLock = true;
        this.waitBtnCallback = false;
    },

    statics: {
        instance: null,
        getInstance: function () {
            if (WindowManager.instance == null) {
                WindowManager.instance = new WindowManager();
            }
            return WindowManager.instance;
        },
        destroyInstance() {
            if (WindowManager.instance != null) {
                delete WindowManager.instance;
                WindowManager.instance = null;
            }
        }
    },

    delayLockBtn:function () {
        this.lockBtn();
    },
    checkBtnLock: function () {
        return false;
        if (this.btnLock) {
            return true;
        } else {
            this.btnLock = true;
            this.scheduleOnce(this.delayLockBtn, 2);
            return false;
        }
    },
    lockBtn: function () {
        return;
        this.unschedule(this.delayLockBtn);
        this.btnLock = true;
        this.waitBtnCallback = false;
    },
    unLockBtn: function () {
        return;
        if (!this.waitBtnCallback) {
            this.btnLock = false;
            this.waitBtnCallback = true;
        }
    },

    preLoadView: function (obj, type) {
        let index = type.lastIndexOf('/');
        let typeName = type.substring(index + 1);
        if (!cc.isValid(this.mapViewData[typeName])) {
            this.mapViewData[typeName] = cc.instantiate(obj);
        }
    },

    releaseView: function () {
        for (let key in this.mapViewData) {
            if (cc.isValid(this.mapViewData[key])) {
                this.mapViewData[key].destroy();
            }
        }
        this.waitBtnCallback = false;
        this.itemLock = true;
        this.btnLock = true;
    },

    pushView: function (type, callback, needUpMask, param) {
        needUpMask = typeof needUpMask !== 'undefined' ? needUpMask : true;
        this.btnLock1 = true;
        var typeName = type;

        if (param) {
            typeName = type + "_" + param;
        }

        if (this.findViewInStack(WndTypeDefine.WindowType.E_DT_MASKBACK_WND) != "") {
            if (needUpMask) {
                this.mapViewData[WndTypeDefine.WindowType.E_DT_MASKBACK_WND].getComponent(WndTypeDefine.WindowType.E_DT_MASKBACK_WND).enter(true);
                this.upViewToCeiling(WndTypeDefine.WindowType.E_DT_MASKBACK_WND);
                this.showLog("up maskback");
            }
        } else {
            this.addMaskBack(WndTypeDefine.WindowType.E_DT_MASKBACK_WND, type, callback, param);
            return;
        }

        // if (this.pushing == false) {
        //     this.pushing = true;
        //     this.pushingName=typeName;
        // } else {
        //     if(this.pushingName==typeName){
        //         return;
        //     }
        //     var self = this;
        //     this.scheduleOnce(function () {
        //         self.pushView(type, callback, needUpMask, param);
        //     }, 0.2);
        //     return;
        // }

        this.showLog("PushView: typeName = " + typeName);

        if (!cc.isValid(this.mapViewData[typeName])) {
            let resPrefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Windows/" + type);
            if (resPrefab != null) {
                this.mapViewData[typeName] = cc.instantiate(resPrefab);
                this.addView(type, true, true, callback, param);
                this.showLog("PushView: res was loaded, push success!");
            } else {
                var self = this;
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Windows/" + type, function (prefab) {
                    if (prefab != null) {
                        self.mapViewData[typeName] = cc.instantiate(prefab);
                        self.addView(type, true, true, callback, param);
                        self.showLog("PushView: resmanager loadres success, push success!");
                    } else {
                        self.showLog("PushView: push view failed!");
                    }
                });
            }
        } else {
            this.addView(type, true, true, callback, param);
            this.showLog("PushView: windowmanager has this view, push success!");
        }
        console.log('pushview: '+ this.vectorViewStack);
    },

    addView: function (type, needRefresh, needRefreshCeilingView, callback, param, insertIndex) {
        insertIndex = typeof insertIndex !== 'undefined' ? insertIndex : -1;
        var typeName = type;

        if (param) {
            typeName = type + "_" + param;
        }

        this.showLog("AddView: typeName = " + typeName);

        var ceilingView = this.getCeilingView();
        var ceilingViewType = this.getCeilingViewType();
        var zOrder = CommonDefine.LayerBaseZOrder.WND_Z;

        if (ceilingView != null) {
            ceilingView.getComponent(ceilingViewType).escape(needRefreshCeilingView);
            zOrder = ceilingView.zIndex + 1;
        }

        if (insertIndex != -1) {
            this.showLog("AddView: InsertMode");
            zOrder = this.mapViewData[this.vectorViewStack[insertIndex]].zIndex;
            for (let j = this.vectorViewStack.length - 1; j >= insertIndex; j--) {
                var z = this.mapViewData[this.vectorViewStack[j]].zIndex;
                this.mapViewData[this.vectorViewStack[j]].zIndex = (z + 1);
                this.showLog("AddView: typeName = " + this.vectorViewStack[j] + "; z = " + (z + 1) + ";");
            }
            this.vectorViewStack.splice(insertIndex, 0, typeName);
        } else {
            this.vectorViewStack.push(typeName);
        }

        //cc.director.getScene().addChild(this.mapViewData[type], zOrder);
        if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.MAIN_STATE) {
            var wndNode = cc.find("Canvas/WndNode");
            if (wndNode != null) {
                wndNode.addChild(this.mapViewData[typeName], zOrder, typeName);
                // if (wndNode.getChildByName(typeName) != this.mapViewData[typeName]){
                //     wndNode.addChild(this.mapViewData[typeName], zOrder, typeName);
                // }else{
                //     this.mapViewData[typeName].active = true;
                //     this.mapViewData[typeName].zIndex=(zOrder);
                //     // this.upViewToCeiling(typeName, needRefresh, needRefreshCeilingView);
                // }
                this.optimizeView();
                if (callback) {
                    callback(this.mapViewData[typeName], typeName, type);
                }
                //if (needRefresh) {
                this.mapViewData[typeName].getComponent(type).enter(needRefresh);
                //}
                this.showLog("Addview: add " + typeName + " success!");
                // this.pushing = false;
            }
        } else {
            this.showLog("AddView: addview can not find wndnode!");
        }
    },

    addMaskBack: function (type, nextTpye, callback, param) {
        if (this.addMask == false) {
            this.addMask = true;
        } else {
            return;
        }
        var self = this;
        if (cc.isValid(self.mapViewData[type])) {
            var ceilingView = self.getCeilingView();
            var ceilingViewType = self.getCeilingViewType();
            var zOrder = CommonDefine.LayerBaseZOrder.WND_Z;
            if (ceilingView != null) {
                ceilingView.getComponent(ceilingViewType).escape(false);
                zOrder = ceilingView.zIndex + 1;
            }
            // self.mapViewData[type].zIndex=(zOrder)
            var wndNode = cc.find("Canvas/WndNode");
            wndNode.addChild(self.mapViewData[type], zOrder);
            self.vectorViewStack.push(type);
            self.addMask = false;
            this.mapViewData[type].getComponent(type).enter(true);
            self.pushView(nextTpye, callback, true, param);
            return;
        }
        GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Windows/" + type, function (prefab) {
            if (prefab != null) {
                self.mapViewData[type] = cc.instantiate(prefab);

                if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.MAIN_STATE) {
                    var wndNode = cc.find("Canvas/WndNode");

                    if (wndNode != null) {
                        var ceilingView = self.getCeilingView();
                        var ceilingViewType = self.getCeilingViewType();
                        var zOrder = CommonDefine.LayerBaseZOrder.WND_Z;
                        if (ceilingView != null) {
                            ceilingView.getComponent(ceilingViewType).escape(false);
                            zOrder = ceilingView.zIndex + 1;
                        }
                        wndNode.addChild(self.mapViewData[type], zOrder);
                        self.vectorViewStack.push(type);
                        self.addMask = false;
                        self.mapViewData[type].getComponent(type).enter(true);
                        self.pushView(nextTpye, callback, true, param);
                        self.showLog("AddMaskBack: MackBack was created!");
                    } else {
                        self.showLog("AddMaskBack: WndNode was not founded!");
                    }

                } else {
                    self.showLog("AddMaskBack: CurrentScene is not MainScene");
                }

            } else {
                self.showLog("AddMaskBack: MackBack error!");
            }
        });
    },

    popView: function (needKeepView, callback, needRefresh, needRefreshCeilingView) {
        needKeepView = typeof needKeepView !== 'undefined' ? needKeepView : false;
        needRefresh = typeof needRefresh !== 'undefined' ? needRefresh : true;
        needRefreshCeilingView = typeof needRefreshCeilingView !== 'undefined' ? needRefreshCeilingView : true;

        var ceilingView = this.getCeilingView();

        if (ceilingView != null) {
            var ceilingViewType = this.getCeilingViewType();
            var ceilingViewName = this.getCeilingViewTypeName();
            ceilingView.getComponent(ceilingViewType).escape(needRefreshCeilingView);
            this.mapViewData[ceilingViewName].removeFromParent(false);

            // if (!needKeepView && ceilingViewName != WndTypeDefine.WindowType.E_DT_MASKBACK_WND
            //   && ceilingViewName != WndTypeDefine.WindowType.E_DT_NORMALROOT_WND && ceilingViewName != WndTypeDefine.WindowType.E_DT_ROOTBACK_WND) {
            //     this.mapViewData[ceilingViewName].destroy();
            //     this.mapViewData[ceilingViewName] = null;
            // } else {
            //     this.mapViewData[ceilingViewName].active = false;
            // }

            this.vectorViewStack.pop();


            if (this.vectorViewStack.length > 1 && this.getCeilingViewType() == WndTypeDefine.WindowType.E_DT_MASKBACK_WND) {
                if (this.vectorViewStack[this.vectorViewStack.length - 2] == WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
                    let index = this.findViewIndex(WndTypeDefine.WindowType.E_DT_ROOTBACK_WND);
                    this.downViewToIndex(WndTypeDefine.WindowType.E_DT_MASKBACK_WND, index);
                } else {
                    this.upViewToCeiling(this.vectorViewStack[this.vectorViewStack.length - 2], needRefresh, needRefreshCeilingView);
                }
            } else {
                //if (needRefresh) {
                ceilingView = this.getCeilingView();
                if (ceilingView != null) {
                    ceilingView.getComponent(this.getCeilingViewType()).enter(needRefresh);
                }
                //}
                this.optimizeView();
            }
            if (callback) {
                callback();
            }
            // let topView = this.getTopView()
            // if (topView){
            //     let topViewScript = topView.getComponent(this.getTopViewType());
            //     topViewScript.unLockBtn();
            // }
        } else {
            this.showLog("PopView: ceilingView is null!");
        }
    },

    insertView: function (type, targetTypeName, callback, needRefresh, needRefreshCeilingView, param) {
        needRefresh = typeof needRefresh !== 'undefined' ? needRefresh : false;
        needRefreshCeilingView = typeof needRefreshCeilingView !== 'undefined' ? needRefreshCeilingView : false;
        var index = -1;
        var typeName = type;

        if (param) {
            typeName = type + "_" + param;
        }
        this.showLog("InsertView: typeName = " + typeName);

        index = this.findViewIndex(typeName);
        if (index != -1) {
            this.showLog("InsertView: view is already existed in Stack");
            return;
        }
        index = -1;
        index = this.findViewIndex(targetTypeName);

        if (index == -1) {
            this.showLog("InsertView: target is not found, change PushView");
            this.pushView(type, callback, param);
            return;
        } else {
            this.showLog("InsertView: index = " + index);
        }

        if (!cc.isValid(this.mapViewData[typeName])) {
            var resPrefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Windows/" + type);
            if (resPrefab != null) {
                this.mapViewData[typeName] = cc.instantiate(resPrefab);
                this.addView(type, needRefresh, needRefreshCeilingView, callback, param, index);
                this.showLog("InsertView: res was loaded, insert success!");
            } else {
                var self = this;
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, "cdnRes/prefab/Windows/" + type, function (prefab) {
                    if (prefab != null) {
                        self.mapViewData[typeName] = cc.instantiate(prefab);
                        self.addView(type, needRefresh, needRefreshCeilingView, callback, param, index);
                        self.showLog("InsertView: resmanager loadres success, insert success!");
                    } else {
                        self.showLog("InsertView: insert failed!");
                    }
                });
            }
        } else {
            this.addView(type, needRefresh, needRefreshCeilingView, callback, param, index);
            this.showLog("InsertView: windowmanager has this view, insert success!");
        }
    },

    deleteView: function (type, needRefreshCeilingView, needKeepView, param) {
        needRefreshCeilingView = typeof needRefreshCeilingView !== 'undefined' ? needRefreshCeilingView : true;
        needKeepView = typeof needKeepView !== 'undefined' ? needKeepView : false;

        var index = -1;
        var typeName = type;

        if (param) {
            typeName = type + "_" + param;
        }

        this.showLog("DeleteView: typeName = " + typeName);

        index = this.findViewIndex(typeName);

        if (index == -1) {
            this.showLog("DeleteView: " + typeName + " is not exist in Stack");
            return;
        } else {
            this.showLog("DeleteView: index = " + index);
        }

        var dView = this.mapViewData[this.vectorViewStack[index]];
        if (dView != null) {
            dView.getComponent(type).escape(true);
            this.mapViewData[typeName].removeFromParent(false);

            // if (!needKeepView && typeName != WndTypeDefine.WindowType.E_DT_MASKBACK_WND
            //     && typeName != WndTypeDefine.WindowType.E_DT_NORMALROOT_WND && typeName != WndTypeDefine.WindowType.E_DT_ROOTBACK_WND) {
            //     this.mapViewData[typeName].destroy();
            //     this.mapViewData[typeName] = null;
            // } else {
            //     this.mapViewData[typeName].active = false;
            // }

            this.vectorViewStack.splice(index, 1);

            if (this.vectorViewStack.length > 1 && this.getCeilingViewTypeName() == WndTypeDefine.WindowType.E_DT_MASKBACK_WND) {
                this.upViewToCeiling(this.vectorViewStack[this.vectorViewStack.length - 2]);
            } else {
                //if (needRefreshCeilingView) {
                var ceilingView = this.getCeilingView();
                if (ceilingView != null) {
                    this.optimizeView();
                    ceilingView.getComponent(this.getCeilingViewType()).enter(needRefreshCeilingView);
                }
                //}
            }
            // let topView = this.getTopView()
            // if (topView){
            //     let topViewScript = topView.getComponent(this.getTopViewType());
            //     topViewScript.unLockBtn();
            // }
        } else {
            this.showLog("DeleteView: " + typeName + " is not exist in Data");
        }
    },

    pauseView: function () {
        if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.MAIN_STATE) {
            this.record = '';
            for (let i = 0; i < this.vectorViewStack.length; i++) {
                if (this.vectorViewStack[i] == WndTypeDefine.WindowType.E_DT_ENDLESS_CHALLENGE_VIEW) {
                    this.record = WndTypeDefine.WindowType.E_DT_ENDLESS_CHALLENGE_VIEW;
                } else if (this.vectorViewStack[i] == WndTypeDefine.WindowType.E_DT_NORMAL_QUESTLIST_VIEW) {
                    this.record = WndTypeDefine.WindowType.E_DT_NORMAL_QUESTLIST_VIEW;
                }
            }
            this.vectorViewStack.splice(0, this.vectorViewStack.length);
        }
    },

    resumeView: function () {
        if (GlobalVar.sceneManager().getCurrentSceneType() == SceneDefines.MAIN_STATE) {
            if (typeof this.record !== 'undefined') {
                if (this.record != '') {
                    if (this.record == WndTypeDefine.WindowType.E_DT_ENDLESS_CHALLENGE_VIEW) {
                        this.pushView(WndTypeDefine.WindowType.E_DT_ENDLESS_CHALLENGE_VIEW, function (wnd, type, name) {
                            //wnd.getComponent(type).addPrefabsText();
                        });
                    } else if (this.record == WndTypeDefine.WindowType.E_DT_NORMAL_QUESTLIST_VIEW) {
                        WindowManager.getInstance().pushView(WndTypeDefine.WindowType.E_DT_NORMAL_QUESTLIST_VIEW, function (wnd, type, name) {
                            // wnd.getComponent(type).initQuestListViewData(true);
                            wnd.getComponent(type).setForce(true);
                        });
                    }
                }
            }
        }
    },

    upViewToCeiling: function (typeName, needRefresh, needRefreshCeilingView) {
        needRefresh = typeof needRefresh !== 'undefined' ? needRefresh : false;
        needRefreshCeilingView = typeof needRefreshCeilingView !== 'undefined' ? needRefreshCeilingView : false;
        var index = -1;
        index = this.findViewIndex(typeName);

        this.showLog("upViewToCeiling: name = " + typeName + "; index = " + index + ";");

        if (index != -1 && index != this.vectorViewStack.length - 1) {
            var ceilingView = this.getCeilingView();
            var targetZOrder = ceilingView.zIndex;
            ceilingView.getComponent(this.getCeilingViewType()).escape(needRefreshCeilingView);

            this.mapViewData[typeName].enabled = true;
            this.mapViewData[typeName].zIndex = (targetZOrder);

            for (let i = index + 1; i <= this.vectorViewStack.length - 1; i++) {
                var view = this.mapViewData[this.vectorViewStack[i]];
                var zOrder = view.zIndex;
                view.zIndex = (zOrder - 1);
                this.showLog("upViewToCeiling : typeName = " + this.vectorViewStack[i] + "; z = " + view.zIndex + ";");
            }

            this.vectorViewStack.splice(index, 1);
            this.vectorViewStack.push(typeName);

            ceilingView = this.getCeilingView();
            if (ceilingView != null) {
                this.optimizeView();
                ceilingView.getComponent(this.getCeilingViewType()).enter(needRefresh);
            }

        }
    },

    downViewToIndex: function (typeName, insertIndex) {
        var index = -1;
        index = this.findViewIndex(typeName);

        this.showLog("downViewToFloor: name = " + typeName + "; index = " + index + ";");

        if (index != -1 && index != 0) {
            var floorView = this.getFloorView();
            var targetZOrder = floorView.zIndex;
            floorView.getComponent(this.getFloorViewType()).escape(false);

            this.mapViewData[typeName].zIndex = (targetZOrder);

            for (let i = insertIndex; i < index; i++) {
                var view = this.mapViewData[this.vectorViewStack[i]];
                var zOrder = view.zIndex;
                view.zIndex = (zOrder + 1);
                this.showLog("downViewToFloor : typeName = " + this.vectorViewStack[i] + "; z = " + view.zIndex + ";");
            }

            this.vectorViewStack.splice(index, 1);
            this.vectorViewStack.splice(insertIndex, 0, typeName);

            if (this.getCeilingViewType() == WndTypeDefine.WindowType.E_DT_MASKBACK_WND && this.vectorViewStack.length > 1) {
                this.upViewToCeiling(this.vectorViewStack[this.vectorViewStack.length - 2]);
            }

            var ceilingView = this.getCeilingView();
            if (ceilingView != null) {
                this.optimizeView();
                ceilingView.getComponent(this.getCeilingViewType()).enter(false);
            }
        }
    },

    downViewToFloor: function (typeName) {
        var index = -1;
        index = this.findViewIndex(typeName);

        this.showLog("downViewToFloor: name = " + typeName + "; index = " + index + ";");

        if (index != -1 && index != 0) {
            var floorView = this.getFloorView();
            var targetZOrder = floorView.zIndex;
            floorView.getComponent(this.getFloorViewType()).escape(false);

            this.mapViewData[typeName].zIndex = (targetZOrder);

            for (let i = 0; i < index; i++) {
                var view = this.mapViewData[this.vectorViewStack[i]];
                var zOrder = view.zIndex;
                view.zIndex = (zOrder + 1);
                this.showLog("downViewToFloor : typeName = " + this.vectorViewStack[i] + "; z = " + view.zIndex + ";");
            }

            this.vectorViewStack.splice(index, 1);
            this.vectorViewStack.splice(0, 0, typeName);

            if (this.getCeilingViewType() == WndTypeDefine.WindowType.E_DT_MASKBACK_WND && this.vectorViewStack.length > 1) {
                this.upViewToCeiling(this.vectorViewStack[this.vectorViewStack.length - 2]);
            }

            var ceilingView = this.getCeilingView();
            if (ceilingView != null) {
                this.optimizeView();
                ceilingView.getComponent(this.getCeilingViewType()).enter(false);
            }
        }
    },

    popToRoot: function (needKeepMask, callback) {
        needKeepMask = typeof needKeepMask !== 'undefined' ? needKeepMask : false;
        // if (needKeepMask) {
        //     var index = -1;
        //     index = this.findViewIndex(WndTypeDefine.WindowType.E_DT_MASKBACK_WND);
        //     this.vectorViewStack.splice(index, 1);
        // }

        let topView = this.getTopView();
        topView.getComponent(this.getTopViewType()).animeStartParam(0, 0);


        while (this.vectorViewStack.length > 0) {
            this.popView(false, null, false);
            this.showLog("poptoroot count :" + this.vectorViewStack.length);
        }

        // if (needKeepMask) {
        //     this.vectorViewStack.push(WndTypeDefine.WindowType.E_DT_MASKBACK_WND);
        //     this.optimizeView();
        // }

        if (!!callback){
            callback();
        }
    },

    popToTargetView: function (targetType, needKeepView, needRefresh, needRefreshCeilingView, callback, param) {
        needKeepView = typeof needKeepView !== 'undefined' ? needKeepView : false;
        needRefresh = typeof needRefresh !== 'undefined' ? needRefresh : false;
        needRefreshCeilingView = typeof needRefreshCeilingView !== 'undefined' ? needRefreshCeilingView : false;
        var index = -1;
        var typeName = targetType;

        if (param) {
            typeName = targetType + "_" + param;
        }

        this.showLog("popToTargetView: typeName = " + typeName);

        index = this.findViewIndex(typeName);
        if (this.findViewInStack(typeName) != "") {
            this.downViewToFloor(WndTypeDefine.WindowType.E_DT_MASKBACK_WND);

            index = this.findViewIndex(typeName);
            this.showLog("PopToTargetView: index = " + index);

            for (let i = this.vectorViewStack.length - 1; i > index; i--) {
                this.showLog("PopToTargetView: pop " + this.vectorViewStack[i]);
                this.popView(needKeepView, null, needRefresh, needRefreshCeilingView);
            }

            if (this.getCeilingViewType() != WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
                let ceilingViewName = this.getCeilingViewTypeName();
                this.upViewToCeiling(WndTypeDefine.WindowType.E_DT_MASKBACK_WND);
                this.upViewToCeiling(ceilingViewName);
            }

            if (callback) {
                callback(this.getTopView(), this.getTopViewType());
            }
        } else {
            this.showLog("PopToTargetView: " + typeName + " is not exist in Stack");
        }
    },

    findViewInStack: function (typeName) {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            for (let i = len - 1; i >= 0; i--) {
                if (this.vectorViewStack[i] == typeName) {
                    return this.vectorViewStack[i];
                }
            }
        }
        return "";
    },

    findViewIndex: function (typeName) {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            for (let i = len - 1; i >= 0; i--) {
                if (this.vectorViewStack[i] == typeName) {
                    return i;
                }
            }
        }
        return -1;
    },

    findViewInWndNode: function (typeName) {
        var name = this.findViewInStack(typeName);
        if (name != "") {
            return this.mapViewData[name];
        }
        return null;
    },

    getTopView: function () {
        if (this.getCeilingViewType() == WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
            var len = this.vectorViewStack.length;
            if (len > 1) {
                return this.mapViewData[this.vectorViewStack[len - 2]];
            }
        }
        return this.getCeilingView();
    },

    getTopViewTypeName: function () {
        if (this.getCeilingViewType() == WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
            var len = this.vectorViewStack.length;
            if (len > 1) {
                return this.vectorViewStack[len - 2];
            }
        }
        return this.getCeilingViewTypeName();
    },

    getTopViewType: function () {
        var str = "";
        var len = this.vectorViewStack.length;
        if (len > 0) {
            if (this.getCeilingViewType() == WndTypeDefine.WindowType.E_DT_NORMALROOT_WND) {
                str = this.vectorViewStack[len - 2];
            } else {
                str = this.vectorViewStack[len - 1];
            }
            var index = str.lastIndexOf('_');
            if (index != -1) {
                return str.substr(0, index);
            } else {
                return str;
            }
        }
        return "";
    },

    getCeilingView: function () {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            return this.mapViewData[this.vectorViewStack[len - 1]];
        }
        return null;
    },

    getFloorView: function () {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            return this.mapViewData[this.vectorViewStack[0]];
        }
        return null;
    },

    getCeilingViewTypeName: function () {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            return this.vectorViewStack[len - 1];
        }
        return "";
    },

    getFloorViewTypeName: function () {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            return this.vectorViewStack[0];
        }
        return "";
    },

    getCeilingViewType: function () {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            var str = this.vectorViewStack[len - 1];
            var index = str.lastIndexOf('_');
            if (index != -1) {
                return str.substr(0, index);
            } else {
                return str;
            }
        }
        return "";
    },

    getFloorViewType: function () {
        var len = this.vectorViewStack.length;
        if (len > 0) {
            var str = this.vectorViewStack[0];
            var index = str.lastIndexOf('_');
            if (index != -1) {
                return str.substr(0, index);
            } else {
                return str;
            }
        }
        return "";
    },

    optimizeView: function () {
        for (let i = this.vectorViewStack.length - 1; i >= 0; i--) {
            this.mapViewData[this.vectorViewStack[i]].active = true;
            // this.showLog("OptimizeView: index = " + i + "&& VIEW: " + this.vectorViewStack[i]);
        }
        if (this.vectorViewStack.length > 0) {
            let topType = this.getCeilingViewType();
            if (topType == WndTypeDefine.WindowType.E_DT_MASKBACK_WND && this.vectorViewStack.length == 1) {
                this.popView(false);
            } else {
                let actullayHideIndex = this.findViewIndex(WndTypeDefine.WindowType.E_DT_ROOTBACK_WND);
                let normalRootIndex = this.findViewIndex(WndTypeDefine.WindowType.E_DT_NORMALROOT_WND);
                if (actullayHideIndex != -1 && normalRootIndex != -1) {
                    for (let i = actullayHideIndex - 1; i >= 0; i--) {
                        this.mapViewData[this.vectorViewStack[i]].active = false;
                        this.showLog("OptimizeView: " + this.vectorViewStack[i] + " index:" + i + " is invisible!");
                    }
                    for (let i = normalRootIndex - 2; i > actullayHideIndex; i--) {
                        this.mapViewData[this.vectorViewStack[i]].active = false;
                        this.showLog("OptimizeView: " + this.vectorViewStack[i] + " index:" + i + " is invisible!");
                    }
                }

                // for (let i=this.vectorViewStack.length-1; i >= (normalRootIndex != -1 ? normalRootIndex + 1 : 0); i--) {
                //     if (this.vectorViewStack[i] == WndTypeDefine.WindowType.E_DT_MASKBACK_WND ||
                //         this.vectorViewStack[i] == WndTypeDefine.WindowType.E_DT_ROOTBACK_WND) {
                //         continue;
                //     }
                //     let size = this.mapViewData[this.vectorViewStack[i]].getContentSize();
                //     if (topSize.width >= size.width && topSize.height >= size.height) {
                //         this.mapViewData[this.vectorViewStack[i]].active = false;
                //         this.showLog("OptimizeView: " + this.vectorViewStack[i] + " index:" + i + " is invisible!");
                //     }
                //     //this.showLog("ceilingViewSize.width = " + topSize.width + "; ceilingViewSize.height=" + topSize.height + ";");
                //     //this.showLog("size.width = " + size.width + "; size.height = " + size.height + ";");
                // }

                if (topType == WndTypeDefine.WindowType.E_DT_MASKBACK_WND) {
                    return;
                }
                if (topType == WndTypeDefine.WindowType.E_DT_NORMALTREASUREEXPLOIT ||
                    topType == WndTypeDefine.WindowType.E_DT_NORMAL_LEVEL_UP_WND ||
                    topType == WndTypeDefine.WindowType.E_DT_NORMAL_GET_NEW_ITEM_WND) {
                    this.mapViewData[topType].active = true;

                    let i = this.vectorViewStack.length - 2 > 0 ? this.vectorViewStack.length - 2 : 0;
                    for (let j = 1; j <= 2; j++) {
                        if (this.vectorViewStack[i - j]) {
                            if (this.vectorViewStack[i - j] == WndTypeDefine.WindowType.E_DT_NORMALTREASUREEXPLOIT ||
                                this.vectorViewStack[i - j] == WndTypeDefine.WindowType.E_DT_NORMAL_LEVEL_UP_WND ||
                                this.vectorViewStack[i - j] == WndTypeDefine.WindowType.E_DT_NORMAL_GET_NEW_ITEM_WND) {
                                this.mapViewData[this.vectorViewStack[i - j]].active = false;
                            }
                        }
                    }
                }
            }
        }


        
    },

    showLog: function (str) {
        if (this.openLog) {
            cc.log(str);
        }
    },
});