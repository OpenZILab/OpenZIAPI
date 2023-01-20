///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/9/21 22:05
///

import { makeUClass } from 'puerts'
import { PointView } from "../View/PointView"
import { BaseViewModel } from "../../../System/API/ViewModel/BaseViewModel"
import { PointModel } from "../Model/PointModel"
import { PackCallBacKMessage } from "../../../System/API/IHandle/IAPIMessageHandle"
import { WebSocketServer } from "../../../System/API/Handle/WebSocketServer"

export class PointViewModel extends BaseViewModel {
    constructor() {
        super()
        this._BaseModel = new PointModel()
        this._OBJClass = makeUClass(PointView)
        this._Type = "POI"
    }

    ExecuteFocus(jsonData) {
        let id = jsonData.data.id
        let _data = jsonData
        if (id == null)
            return "id key no have"
        if (this._OBJMaps.has(id) && this._OBJMaps.get(id) !== null) {
            let curvalue = this._BaseModel.RefreshData(id, _data.data)
            if (curvalue === undefined) {
                return "Update OBJ failed, Some data is over the limit"
            }
            _data.data = this._BaseModel.GetData(id)
            let result = this._OBJMaps.get(id).Focus(_data)
            return result
        }
        return "OBJ is not vaild"
    }
    Focus(msg) {
        let result = this.ExecuteFocus(msg)
        msg.data.result = result
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }
}



