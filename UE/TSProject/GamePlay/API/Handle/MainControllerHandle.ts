///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/10/17 10:50
///

import * as UE from "ue";
import * as puerts from "puerts";
import {PackBroadcastMessage, PackCallBacKMessage} from "../../../System/API/IHandle/IAPIMessageHandle";
import {WebSocketServer} from "../../../System/API/Handle/WebSocketServer";
import {$ref, $unref} from "puerts";
import {NewArray} from "ue";

var DefaultPawn
var IsOpenSkyline = false

export function GetDefaultPawn(): void{
    let CurrentWorld = puerts.argv.getByName("GameInstance").GetWorld();
    DefaultPawn = UE.GameplayStatics.GetPlayerPawn(CurrentWorld,0)
}

export function ChangePawn(jsonData): void{
    let data = jsonData.data
    let loc = data.location
    let CurLoc
    if(typeof loc === "string" || loc instanceof String ){
        let outStr: string[] = loc.split(",")
        CurLoc = new UE.Vector(+outStr[0],+outStr[1],+outStr[2])
    }else{
        CurLoc = new UE.Vector(loc.X,loc.Y,loc.Z)
    }
    let LogMsg = ""

    let pawn_class = UE.Class.Load(data.pawn_path)
    let CurrentWorld = puerts.argv.getByName("GameInstance").GetWorld();
    let Controller = UE.GameplayStatics.GetPlayerController(CurrentWorld, 0)
    let Character = UE.GameplayStatics.GetPlayerCharacter(CurrentWorld, 0)

    if (pawn_class){
        let old_pawn = UE.GameplayStatics.GetPlayerPawn(CurrentWorld,0)

        let newpawn = undefined
        if (data.generate_new){
            let NewLoc = new UE.Transform(new UE.Rotator,CurLoc,new UE.Vector)
            newpawn = UE.WorldExtensionMethods.SpawnActor(CurrentWorld,pawn_class,NewLoc,UE.ESpawnActorCollisionHandlingMethod.Undefined,undefined, undefined)
        }
        else{
            newpawn = UE.GameplayStatics.GetActorOfClass(CurrentWorld, pawn_class)
        }

        if (newpawn){
            Controller.SetViewTargetWithBlend(newpawn,1,UE.EViewTargetBlendFunction.VTBlend_Linear,0,false)
            Controller.Possess(newpawn)
            if (IsOpenSkyline){
                OpenSkyline()
            }
            else {
                CloseSkyline()
            }
        }
        else {
            LogMsg = LogMsg + "new pawn is no valid ! "
        }

        if (data.delete_old){
            old_pawn.K2_DestroyActor()
        }
        else{
            CloseSkyline_Pawn(old_pawn)
        }
    }
    else {
        LogMsg = LogMsg + "pawn_path:Error !  "
    }

    if (LogMsg === ""){
        LogMsg = "success"
    }
    let msg ={
        classDef : jsonData.classDef,
        funcDef : jsonData.funcDef,
        callback : jsonData.callback,
        pageID : jsonData.pageID,
    }
    let message = PackCallBacKMessage(jsonData, {result: LogMsg})
    WebSocketServer.GetInstance().OnSendWebMessage(message)
}

export function ChangeDefaultPawn(): void{
    let CurrentWorld = puerts.argv.getByName("GameInstance").GetWorld();
    let Controller = UE.GameplayStatics.GetPlayerController(CurrentWorld, 0)
    Controller.SetViewTargetWithBlend(DefaultPawn,1,UE.EViewTargetBlendFunction.VTBlend_Linear,0,false)
    Controller.Possess(DefaultPawn)
}

export function OpenSkyline(): void{
    let CurrentWorld = puerts.argv.getByName("GameInstance").GetWorld();
    let CurrentPawn = UE.GameplayStatics.GetPlayerPawn(CurrentWorld,0)
    let Root = CurrentPawn.K2_GetRootComponent()

    let ComArray_ref = $ref(NewArray(UE.SceneComponent))
    Root.GetChildrenComponents(false,ComArray_ref)
    let ComArray = $unref(ComArray_ref)
    for (let i = 0; i < ComArray.Num(); i++){
        if (ComArray.Get(i).GetName() === "OpneZISkylinePostProcess" && ComArray.Get(i) as UE.PostProcessComponent){
            console.error("Do not add Skyline functions  that already exist ! ! !")
            return
        }
    }
    let CurPostProcess = new UE.PostProcessComponent(CurrentPawn,"OpneZISkylinePostProcess")
    CurPostProcess.RegisterComponent()
    let CurSetting = CurPostProcess.Settings
    let PostMaterial = UE.MaterialInstance.Load("/OpenZIAPI/Asset/Material/PostProcess/M_SkylinePost_Inst")
    let Element = new UE.WeightedBlendable(1.0,PostMaterial)
    CurSetting.WeightedBlendables.Array.Add(Element)
    CurPostProcess.K2_AttachToComponent(Root,"Post",UE.EAttachmentRule.KeepRelative,UE.EAttachmentRule.KeepRelative,UE.EAttachmentRule.KeepRelative,true)
    IsOpenSkyline = true
}

export function CloseSkyline(): void{
    let CurrentWorld = puerts.argv.getByName("GameInstance").GetWorld();
    let CurrentPawn = UE.GameplayStatics.GetPlayerPawn(CurrentWorld,0)
    let Root = CurrentPawn.K2_GetRootComponent()
    let ComArray_ref = $ref(NewArray(UE.SceneComponent))
    Root.GetChildrenComponents(false,ComArray_ref)
    let ComArray = $unref(ComArray_ref)
    for (let i = 0; i < ComArray.Num(); i++){
        if (ComArray.Get(i).GetName() === "OpneZISkylinePostProcess" && ComArray.Get(i) as UE.PostProcessComponent){
            ComArray.Get(i).K2_DestroyComponent(ComArray.Get(i))
        }
    }
    IsOpenSkyline = false
}

export function CloseSkyline_Pawn(pawn): void{
    let Root = pawn.K2_GetRootComponent()
    let ComArray_ref = $ref(NewArray(UE.SceneComponent))
    Root.GetChildrenComponents(false,ComArray_ref)
    let ComArray = $unref(ComArray_ref)
    for (let i = 0; i < ComArray.Num(); i++){
        if (ComArray.Get(i).GetName() === "OpneZISkylinePostProcess" && ComArray.Get(i) as UE.PostProcessComponent){
            ComArray.Get(i).K2_DestroyComponent(ComArray.Get(i))
        }
    }
}

//开始Axes功能
export function OpenAxesTool(): void{
    UE.AxesToolSubsystem.Get().TransformInteraction.SetTransformMoth(UE.ETransformGizmoSubElements.FullTranslateRotateScale)
}

//关闭Axes功能
export function CloseAxesTool(): void{
    UE.AxesToolSubsystem.Get().TransformInteraction.SetTransformMoth(UE.ETransformGizmoSubElements.None)
}

//获取当前Axes功能
export function GetAxesTool(): any{
    return UE.AxesToolSubsystem.Get().TransformInteraction.GetTransformMoth()
}

//设置Axes选择模式为Actor 或  Component
export function SetAxesToolSelectMoth(jsondata): void{
    let data = jsondata.data
    if (typeof data.component === "boolean" ){
        UE.AxesToolSubsystem.Get().SetSelectMoth(data.component)
    }
}

//获取当前Axes选择模式是否为Component
export function GetAxesToolSelectMoth(): any{
    return UE.AxesToolSubsystem.Get().GetSelectMoth()
}

//设置Axes选中描边材质效果
export function SetAxesSelectionOutline(jsondata): void{
    let CurrentWorld = puerts.argv.getByName("GameInstance").GetWorld();
    let data = jsondata.data
    let MPC_PP_SelectionSettings = UE.MaterialParameterCollection.Load("/OpenZIAPI/Asset/Material/PostProcess/MPC_PP_SelectionSettings.MPC_PP_SelectionSettings")
    if (typeof data.strength === "number"){
        UE.KismetMaterialLibrary.SetScalarParameterValue(CurrentWorld,MPC_PP_SelectionSettings,"Strength", data.strength)
    }
    if (typeof data.thickness === "number"){
        UE.KismetMaterialLibrary.SetScalarParameterValue(CurrentWorld,MPC_PP_SelectionSettings,"Thickness", data.thickness)
    }
    if (typeof data.selectionColor === "string"){
        let Color = data.selectionColor
        let CurColor
        if(typeof Color === "string" || Color instanceof String ){
            let outStr: string[] = Color.split(",")
            CurColor = new UE.LinearColor(+outStr[0],+outStr[1],+outStr[2],+outStr[3])
        }else{
            CurColor = new UE.LinearColor(Color.X,Color.Y,Color.Z,Color.W)
        }
        UE.KismetMaterialLibrary.SetVectorParameterValue(CurrentWorld,MPC_PP_SelectionSettings,"SelectionColor", CurColor)
    }
}

