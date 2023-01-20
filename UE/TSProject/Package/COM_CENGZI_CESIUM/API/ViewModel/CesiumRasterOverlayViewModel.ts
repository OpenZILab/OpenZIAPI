///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/10/17 11:05
///

import { BaseViewModel } from "../../../../System/API/ViewModel/BaseViewModel";
import { CesiumIONRasterOverlayModel } from "../Model/CesiumIONRasterOverlayModel";
import { CesiumTMSRasterOverlayModel } from "../Model/CesiumTMSRasterOverlayModel";
import { CesiumWMSRasterOverlayModel } from "../Model/CesiumWMSRasterOverlayModel";
import { CesiumRasterOverlayView } from "../View/CesiumRasterOverlayView";
import { CesiumTerrainViewModel } from "./CesiumTerrainViewModel";
import { PackCallBacKMessage } from "../../../../System/API/IHandle/IAPIMessageHandle";
import { WebSocketServer } from "../../../../System/API/Handle/WebSocketServer";
import { GetViewModel } from "../../../../System/API/ApiViewModelSystem";

export class CesiumRasterOverlayViewModel extends BaseViewModel {

    constructor() {
        super()
        this._Type = "CesiumRasterOverlay"
    }
    ExecuteAdd(jsonData: any): string {
        if (jsonData.data.type == "TMS") {
            this._BaseModel = new CesiumTMSRasterOverlayModel()
        }
        else if (jsonData.data.type == "WMS") {
            this._BaseModel = new CesiumWMSRasterOverlayModel()
        }
        else if (jsonData.data.type == "ION") {
            this._BaseModel = new CesiumIONRasterOverlayModel()
        }

        let _data = jsonData
        let id = jsonData.data.id
        if (this._BaseModel !== null) {
            this._BaseModel.AddData(id, _data.data)
        }

        let result: string
        if (this._OBJMaps.has(id)) {
            return "id: " + id + " is existent !"
        }
        if (GetViewModel(CesiumTerrainViewModel)._OBJMaps.has(jsonData.data.terrainId)) {

            let curActor = new CesiumRasterOverlayView(jsonData.data.type,GetViewModel(CesiumTerrainViewModel)._OBJMaps.get(jsonData.data.terrainId))
            if (curActor !== null) {
                this._OBJMaps.set(id, curActor)
                console.log("添加" + id + "到OBJMap数组")
                _data.data = this._BaseModel.GetData(id)
                result = this._OBJMaps.get(id).RefreshView(_data)
                if (result !== "success") {
                    this._OBJMaps.get(id).DeleteOverlay()
                    this._OBJMaps.delete(id)
                    this._BaseModel.DeleteData(id)
                }
                return result
            }
        }
        return "create OBJ failed"
    }

    ExecuteDelete(jsonData: any): string {
        let ids: string[] = jsonData.data.ids
        if (ids == null && ids.length == 0) {
            return "faild ids is null"
        }
        let failedList: string[]
        for (let entry of ids) {
            if (this._OBJMaps.has(entry)) {
                this._BaseModel.DeleteData(entry)
                this._OBJMaps.get(entry).DeleteOverlay()
                let isComplete = this._OBJMaps.delete(entry)
                if (!isComplete) {
                    failedList.push(entry)
                }
            }
        }
        if (failedList!==undefined&&failedList.length > 0) {
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
    ExecuteClear(jsondata: any): string {
        for (let value of this._OBJMaps.values()) {
            if (value !== null) {
                value.DeleteOveraly()
            }
        }
        this._OBJMaps.clear()
        this._BaseModel.ClearData()
        return "execution is completed"
    }
    ExecuteShow(jsondata): string {
        return this.OBJActive(jsondata, true)
    }
 
    ExecuteHidden(jsondata): string {
        return this.OBJActive(jsondata, false)
    }

    ExecuteAllShow(jsondata): string {
        for (let value of this._OBJMaps.values()) {
            if (value !== null) {
                value.SetActive(false)
            }
        }
        return "execution is completed"
    }
    private OBJActive(jsonData, isShow): string {
        let ids: string[] = jsonData.data.ids
        if (ids == null && ids.length == 0) {
            return "faild ids is null"
        }
        let beComplete: string
        for (let entry of ids) {
            if (this._OBJMaps.has(entry)) {
                this._OBJMaps.get(entry).SetActive(!isShow)
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

    ExecuteGetAllCesiumOverlay(jsondata){
        let CesiumOverlays= []
        let allModels = this._BaseModel.GetAllData()
        if(allModels.size>0){
          allModels.forEach((value,key)=>{
            CesiumOverlays.push(value)
          })
        }
        return CesiumOverlays
      }
  
      ExecuteGetCesiumOverlayById(jsondata){
        let id = jsondata.data.id
        let Model = this._BaseModel.GetData(id)
        return Model
      }
  
      GetAllCesiumOverlay(msg){
        msg.data = this.ExecuteGetAllCesiumOverlay(msg)
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
      }
  
      GetCesiumOverlayById(msg){
        msg.data = this.ExecuteGetCesiumOverlayById(msg)
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
      }
}