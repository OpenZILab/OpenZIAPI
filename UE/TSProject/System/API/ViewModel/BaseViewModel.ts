///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/9/21 22:05
///

import * as UE from "ue"
import { argv, makeUClass } from 'puerts'
import { BaseModel } from "../Model/BaseModel"
import { PackCallBacKMessage } from "../../../System/API/IHandle/IAPIMessageHandle"
import { WebSocketServer } from "../../../System/API/Handle/WebSocketServer"

export abstract class BaseViewModel {

    _World: UE.World
    _OBJMaps: Map<string, any> = new Map<string, any>()
    _BaseModel: BaseModel
    _OBJClass: UE.Class
    _OBJObj: Object
    Ins: this
    _Type: string

    constructor() {
        this._World = (argv.getByName("GameInstance") as UE.GameInstance).GetWorld()

    }

    GetType() {
        return this._Type
    }

    ExecuteAdd(jsonData): string {
        let _data = jsonData
        let id = jsonData.data.id
        if (this._BaseModel !== null) {
            let curvalue = this._BaseModel.AddData(id, _data.data)
            if (curvalue === undefined){
                return "create OBJ failed, Some data is over the limit"
            }
        }

        let result: string
        if (this._OBJMaps.has(id)) {
            return "id: " + id + " is existent !"
        }
        let curActor = this.SpawnOBJ()
        if (curActor !== null) {
            this._OBJMaps.set(id, curActor)
            console.log("添加" + id + "到OBJMap数组")
            _data.data = this._BaseModel.GetData(id)
            result = this._OBJMaps.get(id).RefreshView(_data)
            if (result !== "success") {
                this._OBJMaps.get(id).K2_DestroyActor()
                this._OBJMaps.delete(id)
                this._BaseModel.DeleteData(id)
            }
            return result
        }
        return "create OBJ failed"
    }

    ExecuteUpdate(jsonData): string {
        let id = jsonData.data.id
        let _data = jsonData
        if (id == null)
            return "id key no have"
        if (this._OBJMaps.has(id) && this._OBJMaps.get(id) !== null) {
            let curvalue = this._BaseModel.RefreshData(id, _data.data)
            if (curvalue === undefined){
                return "Update OBJ failed, Some data is over the limit"
            }
            _data.data = this._BaseModel.GetData(id)
            let result = this._OBJMaps.get(id).RefreshView(_data)
            return result
        }
        return "OBJ is not vaild"

    }

    ExecuteDelete(jsonData): string {
        let ids: string[] = jsonData.data.ids
        if (ids == null && ids.length == 0) {
            return "faild ids is null"
        }
        let failedList: string[]
        for (let entry of ids) {
            if (this._OBJMaps.has(entry)) {
                this._BaseModel.DeleteData(entry)
                this._OBJMaps.get(entry).K2_DestroyActor()
                let isComplete = this._OBJMaps.delete(entry)
                if (!isComplete) {
                    failedList.push(entry)
                }
            }
        }
        if (failedList !== undefined && failedList.length > 0) {
            let beComplete: string
            for (let entry of failedList) {
                beComplete += "," + entry
            }
            let re = ","
            if (beComplete.search(re)) {
                beComplete = beComplete.substring(1)
                return beComplete + ":These ids fail"
            }
        }
        return "success"
    }

    ExecuteClear(jsondata): string {
        for (let value of this._OBJMaps.values()) {
            if (value !== null) {
                value.K2_DestroyActor()
            }
        }
        this._OBJMaps.clear()
        this._BaseModel.ClearData()
        return "execution is completed"
    }

    ExecuteShow(jsondata): string {
        return this.OBJsIsShow(jsondata, true)
    }

    ExecuteHidden(jsondata): string {
        return this.OBJsIsShow(jsondata, false)
    }

    ExecuteAllShow(jsondata): string {
        for (let value of this._OBJMaps.values()) {
            if (value !== null) {
                value.SetActorHiddenInGame(false)
            }
        }
        return "execution is completed"

    }

    ExecuteAllHidden(jsondata): string {
        for (let value of this._OBJMaps.values()) {
            if (value !== null) {
                value.SetActorHiddenInGame(true)
            }
        }
        return "execution is completed"

    }

    private OBJsIsShow(jsonData, isShow): string {
        let ids: string[] = jsonData.data.ids
        if (ids == null && ids.length == 0) {
            return "faild ids is null"
        }
        let beComplete: string = ""
        for (let entry of ids) {
            if (this._OBJMaps.has(entry)) {
                this._OBJMaps.get(entry).SetActorHiddenInGame(!isShow)
            } else {
                beComplete += "," + entry
            }
        }
        let re = ","
        if (beComplete.search(re)) {
            beComplete = beComplete.substring(1)
            return beComplete
        }
        return "success"
    }

    private SpawnOBJ(): any {
        let curActor = this._World.SpawnActor(this._OBJClass, undefined, UE.ESpawnActorCollisionHandlingMethod.Undefined, undefined, undefined)
        if (curActor !== null) {
            return curActor
        }
        return null
    }

    //-------------------------Message---------------------
    Add(msg) {
        let result = this.ExecuteAdd(msg)
        msg.data.result = result
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    Delete(msg) {
        let result = this.ExecuteDelete(msg)
        msg.data.result = result
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    Clear(msg) {
        let result = this.ExecuteClear(msg)
        msg.data.result = result
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    Update(msg) {
        let result = this.ExecuteUpdate(msg)
        msg.data.result = result
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    Show(msg) {
        let result = this.ExecuteShow(msg)
        msg.data.result = result
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    Hidden(msg) {
        let result = this.ExecuteHidden(msg)
        msg.data.result = result
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    AllShow(msg) {
        let result = this.ExecuteAllShow(msg)
        msg.data.result = result
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    AllHidden(msg) {
        let result = this.ExecuteAllHidden(msg)
        msg.data.result = result
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }
}
