///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/10/08 12:08
///

import * as UE from "ue";
import {MeasureView} from "./MeasureView";
import {$ref, $unref} from "puerts";
import {NewArray} from "ue";
import {CoodinateConverterViewModel} from "../ViewModel/CoodinateConverterViewModel";
import {PackCallBacKMessage} from "../../../System/API/IHandle/IAPIMessageHandle";
import {WebSocketServer} from "../../../System/API/Handle/WebSocketServer";
import { GetViewModel } from "../../../System/API/ApiViewModelSystem";

export class MeasureCoordinatesView extends MeasureView {

    //@ts
    UMGArray_Coord: UE.TArray<UE.UserWidget>
    CoodinateConventer: CoodinateConverterViewModel

    Constructor(){
        super.Constructor()
        this.UMGArray_Coord = NewArray(UE.UserWidget)
        this.CoodinateConventer = GetViewModel(CoodinateConverterViewModel)
    }

    ReceiveBeginPlay(): void {
        super.ReceiveBeginPlay()
    }

    ReceiveTick(DeltaSeconds: number): void {
        super.ReceiveTick(DeltaSeconds)
    }

    ReceiveEndPlay(EndPlayReason): void{
        super.ReceiveEndPlay(EndPlayReason)
    }

    Init(): void {
        super.Init()
    }

    RefreshView(jsonData): string {
        return super.RefreshView(jsonData)
    }

    GetUnderHit(): UE.HitResult{
        return super.GetUnderHit()
    }

    ListenKeyAction(): void{
        super.ListenKeyAction()
    }

    MakeKey(KeyName): UE.Key{
        return super.MakeKey(KeyName)
    }

    DrawDown(): void{
        super.DrawDown()
    }

    DrawUp(): void{
        super.DrawUp()
    }

    Uping(): void{
        super.Uping()
    }

    DrawPoint(CurLocation): void{
        super.DrawPoint(CurLocation)
    }

    DrawCable(StartParam,StartNameId,EndParam,EndName): void{
        super.DrawCable(StartParam,StartNameId,EndParam,EndName)
    }

    GetPoi(index): any{
        return super.GetPoi(index)
    }

    EndDraw(): void{
        super.EndDraw()
    }

    SetScale(CameraLocation): void{
        super.SetScale(CameraLocation)
    }

    DrawDownEvent(CurLocation): void{
        this.DrawPoint(CurLocation)
        this.AddCoord(CurLocation)
    }

    EndDrawEvent(): void{
        let msg ={
            classDef : "MeasureCoordinates",
            funcDef : "Stop",
            data : undefined,
            callback : this.JsonData.callback,
            pageID : this.JsonData.pageID,
        }
        msg.data = {"result":"stop"}
        let message = PackCallBacKMessage(msg,  msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    RemoveUI(): void{
        if (this.UMGArray_Coord.Num() > 0){
            for (let index = 0; index < this.UMGArray_Coord.Num(); index++){
                this.UMGArray_Coord.Get(index).RemoveFromParent()
            }
            this.UMGArray_Coord = null
        }
    }

    RefreshScale(Distance,Scale): void{
        if (this.UMGArray_Coord.Num() > 0){
            for (let index = 0; index < this.UMGArray_Coord.Num(); index++){
                if (Distance < this.MaxDistance){
                    this.UMGArray_Coord.Get(index).SetVisibility(UE.ESlateVisibility.Visible)
                    this.UMGArray_Coord.Get(index).SetColorAndOpacity(new UE.LinearColor(1,1,1,Scale))
                }
                else {
                    this.UMGArray_Coord.Get(index).SetVisibility(UE.ESlateVisibility.Hidden)
                }
            }
        }
    }

    AddCoord(CurLocation): void{
        let UW = UE.Class.Load("/OpenZIAPI/API/Analysis/Measure/Measure/UMG_Coord.UMG_Coord_C")
        let Controller = UE.GameplayStatics.GetPlayerController(this, 0)
        type UMG_Coord_C  = UE.OpenZIAPI.API.Analysis.Measure.Measure.UMG_Coord.UMG_Coord_C
        let CurUMG = UE.WidgetBlueprintLibrary.Create(this,UW,Controller) as UMG_Coord_C
        CurUMG.AddToViewport(0)
        let ViewportPosition = $ref(new UE.Vector2D(0,0))
        UE.WidgetLayoutLibrary.ProjectWorldLocationToWidgetPosition(Controller,CurLocation,ViewportPosition,false)
        let CurViewportPosition = $unref(ViewportPosition)
        CurUMG.SetPositionInViewport(CurViewportPosition,false)
        this.UMGArray_Coord.Add(CurUMG)
        let CurCoord = $ref(new UE.GeographicCoordinates)
        this.CoordinateConverterMgr.EngineToGeographic(this.CoodinateConventer.GetGISType(),CurLocation,CurCoord)
        let  Coord = $unref(CurCoord)
        let Longitude = Coord.Longitude
        let Latitude = Coord.Latitude
        let Altitude = Coord.Altitude
        CurUMG.Longitude.SetText("Longitude：" + Longitude)
        CurUMG.Latitude.SetText("Latitude：" + Latitude)
        CurUMG.Height.SetText("Altitude：" + Altitude)
        let CurString2 = "Longitude_Latitude：" + "[" + Longitude + "," + Latitude + "]"
        UE.KismetSystemLibrary.PrintString(this,CurString2,false)

        let CurString = "Longitude_Latitude_Altitude：" + "[" + Longitude + "," + Latitude + "," + Altitude + "]"
        UE.KismetSystemLibrary.PrintString(this,CurString,false)
    }

    RefreshUI(): void{
        let Controller = UE.GameplayStatics.GetPlayerController(this, 0)
        if (this.UMGArray_Coord.Num() > 0){
            for (let index = 0; index < this.UMGArray_Coord.Num(); index++){
                let loc = this.PointLocation.Get(index)
                let ViewportPosition = $ref(new UE.Vector2D(0,0))
                UE.WidgetLayoutLibrary.ProjectWorldLocationToWidgetPosition(Controller,loc,ViewportPosition,false)
                let CurViewportPosition = $unref(ViewportPosition)
                this.UMGArray_Coord.Get(index).SetPositionInViewport(CurViewportPosition,false)
            }
        }
    }
}
