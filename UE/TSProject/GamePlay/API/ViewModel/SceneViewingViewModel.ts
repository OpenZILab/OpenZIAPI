///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/12/08 18:36
///

import {makeUClass} from 'puerts'
import {BaseViewModel} from "../../../System/API/ViewModel/BaseViewModel"
import {SceneViewingModel} from "../Model/SceneViewingModel";
import {SceneViewingView} from "../View/SceneViewingView";
import {GetObserverPawn} from "../IHandle/IPawnHandle";
import {PackCallBacKMessage} from "../../../System/API/IHandle/IAPIMessageHandle";
import {WebSocketServer} from "../../../System/API/Handle/WebSocketServer";

export class SceneViewingViewModel extends BaseViewModel {
    constructor() {
        super()
        this._BaseModel = new SceneViewingModel()
        this._OBJClass = makeUClass(SceneViewingView)
        this._Type = "SceneViewing"

    }

    StartAddScenePoint(msg: any) {
        let _data = msg.data
        let id = _data.id
        if (this._BaseModel !== null && this._OBJMaps.get(id)) {
            this._OBJMaps.get(id).StartAddScenePoint()
            return "Start Add ScenePoint"
        }
        return "The current id does not exist"
    }

    EndAddScenePoint(msg: any) {
        let _data = msg.data
        let id = _data.id
        if (this._BaseModel !== null && this._OBJMaps.get(id)) {
            this._OBJMaps.get(id).EndAddScenePoint()
            return "End Add ScenePoint"
        }
        return "The current id does not exist"
    }

    StartPlay(msg: any) {
        let _data = msg.data
        let id = _data.id
        if (this._BaseModel !== null && this._OBJMaps.get(id)) {
            this._OBJMaps.get(id).StartPlay(msg)
            return "Start Play"
        }
        return "The current id does not exist"
    }

    StopPlay(msg: any) {
        let _data = msg.data
        let id = _data.id
        if (this._BaseModel !== null && this._OBJMaps.get(id)) {
            this._OBJMaps.get(id).StopPlay()
            return "Stop Play"
        }
        return "The current id does not exist"
    }

    HiddenCameraMesh(msg: any){
        let _data = msg.data
        let id = _data.id
        if (this._BaseModel !== null && this._OBJMaps.get(id)) {
            if (_data.IsHidden !== undefined && typeof _data.IsHidden === "boolean"){
                this._OBJMaps.get(id).HiddenCameraMeshActor(_data.IsHidden)
                return "Successful"
            }
        }
        return "The current id does not exist"
    }

    HiddenSplineMesh(msg: any){
        let _data = msg.data
        let id = _data.id
        if (this._BaseModel !== null && this._OBJMaps.get(id)) {
            if (_data.IsHidden !== undefined && typeof _data.IsHidden === "boolean"){
                this._OBJMaps.get(id).HiddenSplineMesh(_data.IsHidden)
                return "Successful"
            }
        }
        return "The current id does not exist"
    }

    GetSceneViewingInfos(msg){
        let _data = msg.data
        let id = _data.id
        if (this._BaseModel !== null && this._OBJMaps.get(id)) {
            msg.data.result = this._OBJMaps.get(id).GetSceneViewingInfos(_data.IsHidden)
            let message = PackCallBacKMessage(msg, msg.data)
            WebSocketServer.GetInstance().OnSendWebMessage(message)
            return "Successful"
        }
        msg.data.result = "The current id does not exist"
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    HiddenAllSceneViewing(msg){
        let _data = msg.data
        if (this._BaseModel !== null){
            if (_data.HiddenAll !== undefined && typeof _data.HiddenAll === "boolean"){
                this._OBJMaps.forEach((value,key)=>{
                    value.HiddenSplineMesh(_data.HiddenAll)
                    value.HiddenCameraMeshActor(_data.HiddenAll)
                })
                return "Successful"
            }
            return "Please inform 'true' or 'false'"
        }
        return "No Exist"
    }
}