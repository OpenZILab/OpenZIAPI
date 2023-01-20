///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/9/229 09:29
///

import { BaseViewModel } from "../../../System/API/ViewModel/BaseViewModel"
import { CoodinateConverterView } from "../View/CoodinateConverterView"
import { PackCallBacKMessage } from "../../../System/API/IHandle/IAPIMessageHandle"
import { WebSocketServer } from "../../../System/API/Handle/WebSocketServer"
import { CoodinateConventerModel } from "../Model/CoodinateConventerModel"
import { LevelViewModel } from "./LevelViewModel"
import { EventDispatcher } from "../../../System/Core/EventDispatcher"
import { CSVConfigFilePath } from "../../../System/Setting/FileSetting"

export class CoodinateConverterViewModel extends BaseViewModel {

    OBJ: CoodinateConverterView
    constructor() {
        super()
        this._BaseModel = new CoodinateConventerModel()
        this.OBJ = new CoodinateConverterView()
        this._Type = "CoodinateConventer"
    }

    SpawnCesiumGeo(){

    }

    RefreshCoordinate(jsonData): Boolean {
        let _data = jsonData
        this._BaseModel.SetSingleData(_data.data)
        _data.data = this._BaseModel.GetSingleData()
        let IsSuccess = this.OBJ.RefreshCoordinate(_data)
        return IsSuccess
    }

    InitGeo() {
        let temp: any
        temp.data = {}
        this.RefreshCoordinate(temp)
    }

    Refresh(msg) {
        let IsSuccess = this.RefreshCoordinate(msg)
        if (IsSuccess !== true) {
            msg.data.result = "Coordinate system switch failed"
        }
        else {
            msg.data.result = "Coordinate system switch successful"
        }
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    GetGISType() {
        return this.OBJ.GetGIS_Type()
    }
    GetScale() {
        return this.OBJ.GetScale()
    }


    SetCesiumGeo(location) {
        this.OBJ.SetCesiumGeoLngLatHeight(location)
    }

    UpdateGeoLngLatHeight(location) {
        this.OBJ.UpdateGeoLngLatHeight(location)
    }
}






