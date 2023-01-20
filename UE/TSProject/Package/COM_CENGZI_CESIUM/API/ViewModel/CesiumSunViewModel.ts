///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/10/17 11:05
///

import { BaseViewModel } from "../../../../System/API/ViewModel/BaseViewModel";
import { CesiumSunModel } from "../Model/CesiumSunModel";
import { CesiumSunView } from "../View/CesiumSunView";
import { WebSocketServer } from "../../../../System/API/Handle/WebSocketServer"
import { PackCallBacKMessage } from "../../../../System/API/IHandle/IAPIMessageHandle";

export class CesiumSunViewModel extends BaseViewModel{
    OBJ:CesiumSunView

    constructor() {
        super()
        this._BaseModel = new CesiumSunModel()
        //this._OBJClass = .StaticClass()
        this.OBJ = new CesiumSunView()
        this._Type = "CesiumSun"
    }

    UpdateDataTime(jsonData){
        let _data = jsonData
        this._BaseModel.SetSingleData(_data.data)
        _data.data = this._BaseModel.GetSingleData()
        if (this.OBJ == null ){
            this.OBJ = new CesiumSunView()
        }
        let bAutoUpdateTimeZone = _data.data.bAutoUpdateTimeZone
        let IsTimeZoneSuc = this.OBJ.SetTimeZone(_data.data.TimeZone)
        let IsTimeSuc =this.OBJ.SetTime(_data.data.Time)
        let IsDataSuc =this.OBJ.SetData(_data.data.Data)
        this.OBJ.UpdateSun()
        if (jsonData.data == null)   {
            return
        }
        jsonData.data.result = "success"
        if (IsTimeZoneSuc !== true) {
            jsonData.data.result = IsTimeZoneSuc
        }
        if (IsTimeSuc !== true) {
            jsonData.data.result = IsTimeSuc
        }
        if (IsDataSuc!= true) {
            jsonData.data.result = IsDataSuc
        }
        let message = PackCallBacKMessage(jsonData, jsonData.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }
}

