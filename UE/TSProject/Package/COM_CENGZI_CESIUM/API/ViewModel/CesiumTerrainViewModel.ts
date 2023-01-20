///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/10/17 11:05
///

import { makeUClass } from "puerts";
import { BaseViewModel } from "../../../../System/API/ViewModel/BaseViewModel";
import { Cesium3DTilesetModel } from "../Model/Cesium3DTilesetModel";
import { Cesium3DTilesetView } from "../View/Cesium3DTilesetView";
import { PackCallBacKMessage } from "../../../../System/API/IHandle/IAPIMessageHandle";
import { WebSocketServer } from "../../../../System/API/Handle/WebSocketServer";

export class CesiumTerrainViewModel extends BaseViewModel{

    type:string

    constructor() {
        super()
        this._BaseModel = new Cesium3DTilesetModel()
        this._OBJClass = makeUClass(Cesium3DTilesetView)
        this.type = "CesiumTerrain"
        this._Type = "CesiumTerrain"
    }

    ExecuteAdd(jsonData: any): string {
        let out = super.ExecuteAdd(jsonData)
        if(out == "success"){
            this._OBJMaps.get(jsonData.data.id).Tags.Add(this._Type)
        }
        return out
    }

    private static Ins: CesiumTerrainViewModel;
    public static Get() {
      if (!CesiumTerrainViewModel.Ins) {
        CesiumTerrainViewModel.Ins = new CesiumTerrainViewModel();
      }
      return CesiumTerrainViewModel.Ins;
    }

    ExecuteGetAllCesiumTerrain(jsondata){
      let CesiumTerrainModels = []
      let allModels = this._BaseModel.GetAllData()
      if(allModels.size>0){
        allModels.forEach((value,key)=>{
          CesiumTerrainModels.push(value)
        })
      }
      return CesiumTerrainModels
    }

    ExecuteGetCesiumTerrainById(jsondata){
      let id = jsondata.data.id
      let Model = this._BaseModel.GetData(id)
      return Model
    }

    GetAllCesiumTerrain(msg){
      msg.data = this.ExecuteGetAllCesiumTerrain(msg)
      let message = PackCallBacKMessage(msg, msg.data)
      WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    GetCesiumTerrainById(msg){
      msg.data = this.ExecuteGetCesiumTerrainById(msg)
      let message = PackCallBacKMessage(msg, msg.data)
      WebSocketServer.GetInstance().OnSendWebMessage(message)
    }
}