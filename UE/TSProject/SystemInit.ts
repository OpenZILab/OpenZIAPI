///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by behiever.
/// DateTime: 2022/9/1 16:21
///

import * as WebPageViewModel from "./GamePlay/API/ViewModel/WebPageViewModel"
import * as SystemAPI from "./System/API/System_APIList"
import * as SystemSetting from "./System/Setting/SystemSetting"
import { MessageQueueList } from "./System/Core/NetWork/MessageQueue"
import { Timer } from "./System/Core/Timer"
import * as UE from "ue"
import {argv, makeUClass} from "puerts";
import * as GameAPI from "./GamePlay/API/Game_APIList"
import {CSVConfigFilePath, SettingConfigFilePath} from "./System/Setting/FileSetting"
import { ObserverPawnViewModel } from "./GamePlay/API/ViewModel/ObseverPawnViewModel"
import {Execute_BlueprintMixin} from "./System/API/Handle/ExecuteMixin";
import {SceneViewingUIView} from "./GamePlay/API/View/SceneViewingUIView";
import {DynamicWeatherView} from "./GamePlay/API/View/DynamicWeatherView";
import { APIViewModelSystem, GetViewModel } from "./System/API/ApiViewModelSystem"
import { CoodinateConverterViewModel } from "./GamePlay/API/ViewModel/CoodinateConverterViewModel"
import { LevelViewModel } from "./GamePlay/API/ViewModel/LevelViewModel"

let CameraPointPath = "/OpenZIAPI/API/View/Roaming/UMG_CameraPoint.UMG_CameraPoint_C";
let DynamicWeatherPath ="/OpenZIAPI/DynamicWeather/DynamicWeather/Blueprints/BP_DynamicSKY.BP_DynamicSKY_C"
console.warn("SystemInitTS")
let PuertsVmSystem = argv.getByName("PuertsVmSystem") as UE.PuertsVmSystem

function GameBeginPlay(): void {
    console.warn("function GameBeginPlay()")

    let cengzikeji = new SystemInit()
    cengzikeji.OnInit()
}
PuertsVmSystem.OnGameBeginPlay.Add(GameBeginPlay);

function GameEndPlay(): void {
    SystemAPI.CloseWebSocketServer(1000,0)
    console.warn("function GameEndPlay()")
}
PuertsVmSystem.OnGameEndPlay.Add(GameEndPlay);

function GameTick(DeltaTime: number): void {
    Timer.GetInstance().Fire(DeltaTime)
}
PuertsVmSystem.OnGameTick.Add(GameTick);

export class SystemInit {
    public OnInit() {
       SystemSetting.WriteSetting(SettingConfigFilePath)
        if (SystemSetting.bCloudRenderingMode) {
            SystemAPI.CreatePixelStreamListener()
        } else {
            WebPageViewModel.Ctor()
            SystemAPI.ShowMouseCursor()
        }
        console.log("Start StartServer")
        MessageQueueList.GetInstance().Ctor()
        SystemAPI.StartWebSocketServer(SystemSetting.WebSocketUrl)
        GetViewModel(CoodinateConverterViewModel).Refresh({})
        GetViewModel(ObserverPawnViewModel).SpawnDefalutPawn()
        GameAPI.GetDefaultPawn()
        //Mixin
        Execute_BlueprintMixin(CameraPointPath,SceneViewingUIView)
        Execute_BlueprintMixin(DynamicWeatherPath,DynamicWeatherView)
        GetViewModel(LevelViewModel).LoadLevelAsset(CSVConfigFilePath)
    }
}