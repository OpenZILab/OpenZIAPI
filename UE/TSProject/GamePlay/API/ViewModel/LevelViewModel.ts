///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime:  2022/10/10 11:34
///

import { LevelModel } from "../Model/LevelModel"
import * as CSV from "../IHandle/ICSVFileDataHandle"
import { LevelState, LevelView } from "../View/LevelView"
import { PackCallBacKMessage, PackBroadcastMessage } from "../../../System/API/IHandle/IAPIMessageHandle"
import { WebSocketServer } from "../../../System/API/Handle/WebSocketServer"
import { BroadcastMessage } from "../IHandle/IMessageBroadcast"
import * as SystemAPI from "../../../System/API/System_APIList"
import { EventDispatcher } from "../../../System/Core/EventDispatcher"
import * as UE from "ue"
import { Widget } from "../../../System/Core/Widget";
import { BaseViewModel } from "../../../System/API/ViewModel/BaseViewModel"

export class LevelViewModel extends BaseViewModel{

    LevelAsset: Map<string, any> = new Map<string, any>()
    static LevelChangeIndex: number = 0
    constructor() {
        super()

        this._BaseModel = new LevelModel()
        this._Type = "Level"
        LevelViewModel.LevelChangeIndex = 0
    }
    CurUrl:string = ""

    LoadLevelAsset(path: any) {
        let LevelData = CSV.GetCSVLevelData(path, null);
        
        (<LevelModel>this._BaseModel).AnalysisData(LevelData)
        let AllData = this._BaseModel.GetAllData()
        let curWidget = Widget.GetInstance().SwitchCurrWidget("WBP_Loading") as UE.OpenZIAPI.Asset.UMG.WBP_Loading.WBP_Loading_C
        let Index = 0
        let String = ""
        AllData.forEach((value, key) => {
            let obj = new LevelView(key)
            if (obj.Init()) {
                this.UpdateCallBack("Open","")
                let outlog = "加载关卡" + key + "成功"
                console.log(outlog)
                BroadcastMessage("Level", "LoadLevelAsset", {}, outlog)
                this.LevelAsset.set(key, obj)
                Index++
                curWidget.ProgressBar.SetPercent((Index / AllData.size))
            }
            else {
                let outlog = "加载关卡" + key + "失败"
                String += key + ","
                console.log(outlog)
                BroadcastMessage("Level", "LoadLevelAsset", {}, outlog)
            }
        })
        if (String != "") {

            curWidget.Msg.SetText(String + "关卡加载失败")
        }
        if (Index == AllData.size) {
            Widget.GetInstance().DestroyWidget("WBP_Loading")
        }
        this.OpenStartLevel()
    }

    OpenStartLevel() {
        this._BaseModel.GetAllData().forEach((value, key) => {
            let LevelName = ""
            if (value.StartToLoad == "是") {
                if (this.LevelAsset.has(key)) {
                    this.LevelAsset.get(key).Open()
                    LevelName = value.LevelName
                }
            }
            if (LevelName != "") {
                this.LoadUrl(LevelName)
            }
        })
        LevelViewModel.LevelChangeIndex = 0
    }

    LoadUrl(name: string) {
        let AllData = this._BaseModel.GetAllData()
        AllData.forEach((v, k) => {
            if (k == name)
                if(this.CurUrl!=v.LevelPage){
                    SystemAPI.LoadWebPageFile(v.LevelPage)
                    this.CurUrl = v.LevelPage
                }
        })
    }

    LoadLevel(msg) {
        this.UpdateCallBack("Open", msg)
        if(msg.data.bHidden == true){
            EventDispatcher.GetInstance().Add(this,()=>{
                this.LevelAsset.get(msg.data.levelName).SetVisble(false)
            },"CallBack关卡加载完成隐藏")
        }
        let _data = msg.data
        let result = ""
        let bLoad = false
        if (this._BaseModel.GetData(_data.levelName) !== null) {
            if (this.LevelAsset.has(_data.levelName)) {

                if (_data.removeOthersLevel == true) {
                    this.LevelAsset.forEach((value, key) => {
                        if (value.GetState() == LevelState.LoadedVisible) {
                            if (key == _data.levelName) {
                                result = _data.levelName + "：当前已经加载"
                                bLoad = true
                            }
                            else {
                                this.LevelAsset.get(key).Close()
                            }
                        }
                    })
                    if (!bLoad) {
                        this.LevelAsset.get(_data.levelName).Open()
                        this.LoadUrl(_data.levelName)
                    }
                }
                else {
                    if (this.LevelAsset.get(_data.levelName).GetState() !== LevelState.LoadedVisible) {
                        this.LevelAsset.get(_data.levelName).Open()
                        this.LoadUrl(_data.levelName)
                    }
                    else
                        result = _data.levelName + "：当前已经加载"
                }
            }
            else {
                result = _data.levelName + "：当前不存在实例"
            }
        } else {
            result = _data.levelName + "：当前关卡不存在"
        }
        msg.data.result = result
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    ShowLevel(msg) {
        this.UpdateCallBack("Show", msg)
        let _data = msg.data
        let result = ""
        if (this._BaseModel.GetData(_data.levelName) !== null) {
            if (this.LevelAsset.has(_data.levelName)) {
                let CurIns = this.LevelAsset.get(_data.levelName)
                let bNeedSet = true
                if (_data.isVisible == false && CurIns.GetState() == LevelState.LoadedNotVisible) {
                    result = _data.levelName + "：当前关卡已经隐藏"
                    bNeedSet = false
                }
                if (_data.isVisible == true && CurIns.GetState() == LevelState.LoadedVisible) {
                    result = _data.levelName + "：当前关卡已经显示"
                    bNeedSet = false
                }
                if (bNeedSet) {
                    CurIns.SetVisble(_data.isVisible)
                    //return
                }
            }
            else {
                result = _data.levelName + "：当前不存在实例"
            }
        } else {

            result = _data.levelName + "：当前关卡不存在"
        }
        msg.data.result = result
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    private CallBack(type: string, des: string, key: string, msg): any {
        let func = function callback() {
            BroadcastMessage("Level", type, {}, des + key + "成功")
            LevelViewModel.LevelChangeIndex =LevelViewModel.LevelChangeIndex - 1
            console.error( `sssssssssssss:${LevelViewModel.LevelChangeIndex}`)

            if (LevelViewModel.LevelChangeIndex <= 0&&msg!=null) {
                if(type == "Open"&&msg?.data?.bHidden == true){
                    EventDispatcher.GetInstance().Fire("CallBack关卡加载完成隐藏",msg)
                }
            }
        }
        return func
    }

    private UpdateCallBack(type: string, msg) {
        if (type == "Open") {
            this.LevelAsset.forEach((v, k) => {
                v.Ins.OnLevelShown.Clear()
                v.Ins.OnLevelHidden.Clear()
                v.Ins.OnLevelShown.Add(this.CallBack("Open", "打开关卡", k, msg))
                v.Ins.OnLevelHidden.Add(this.CallBack("Close", "卸载关卡", k, msg))

            })
        }
        else {
            this.LevelAsset.forEach((v, k) => {
                v.Ins.OnLevelShown.Clear()
                v.Ins.OnLevelHidden.Clear()
                v.Ins.OnLevelShown.Add(this.CallBack("Show", "显示关卡", k, msg))
                v.Ins.OnLevelHidden.Add(this.CallBack("Hidden", "隐藏关卡", k, msg))
            })
        }
    }
}
