
///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/10/13 14:21
///

import * as UE from "ue"
import {argv, makeUClass} from "puerts";
import { ObserverPawnView } from "../View/ObserverPawnView";
import { BaseViewModel } from "../../../System/API/ViewModel/BaseViewModel";
import { ObserverPawnModel } from "../Model/ObserverPawnModel";
import { GetObserverPawn } from "../IHandle/IPawnHandle";
import { PackCallBacKMessage } from "../../../System/API/IHandle/IAPIMessageHandle";
import { WebSocketServer } from "../../../System/API/Handle/WebSocketServer";

export class  ObserverPawnViewModel extends BaseViewModel{

    constructor(){
        super()
        this._BaseModel = new ObserverPawnModel()
        this._OBJClass = makeUClass(ObserverPawnView)
        this._Type = "Pawn"
    }

    SpawnDefalutPawn(){
        let Pawn= this._World.SpawnActor(this._OBJClass, undefined, UE.ESpawnActorCollisionHandlingMethod.Undefined, undefined, undefined) as ObserverPawnView
        UE.GameplayStatics.GetPlayerController(this._World,0).Possess(Pawn)
    }

    SetCameraInfo(msg){
        this._BaseModel.SetSingleData(msg.data)
        msg.data = this._BaseModel.GetSingleData()
        let ObserverPawn = GetObserverPawn()
        let result = ObserverPawn.SetCameraInfo(msg)
        msg.data.result = result
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }
    
    GetCameraInfo(msg){
        let ObserverPawn = GetObserverPawn()
        let result = ObserverPawn.GetCameraInfo()
        msg.data.result = result
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    GetCoord(msg){
        let ObserverPawn = GetObserverPawn()
        return ObserverPawn.GetCoord()
    }

    SetOpenMetaData(msg){
        let ObserverPawn = GetObserverPawn()
        ObserverPawn.SetOpenMetaData(msg)
        msg.data.result = "Success"
        let message = PackCallBacKMessage(msg, msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    private static Ins: ObserverPawnViewModel;
    public static Get() {
      if (!ObserverPawnViewModel.Ins) {
        ObserverPawnViewModel.Ins = new ObserverPawnViewModel();
      }
      return ObserverPawnViewModel.Ins;
    }
}



