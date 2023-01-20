///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/10/08 16:20
///

import * as UE from "ue";
import {MeasureView} from "./MeasureView";
import {$ref, $unref} from "puerts";
import {NewArray} from "ue";
import {PackCallBacKMessage} from "../../../System/API/IHandle/IAPIMessageHandle";
import {WebSocketServer} from "../../../System/API/Handle/WebSocketServer";

export class MeasureDistanceView extends MeasureView {

    //@ts
    UMG_Array_Distance: UE.TArray<UE.UserWidget>
    LocArray: UE.TArray<UE.Vector>

    Constructor(){
        super.Constructor()
        this.UMG_Array_Distance = NewArray(UE.UserWidget)
        this.LocArray = NewArray(UE.Vector)
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
        this.DrawDownLine(CurLocation)
    }

    EndDrawEvent(): void{
        let msg ={
            classDef : "MeasureDistance",
            funcDef : "Stop",
            data : undefined,
            callback : this.JsonData.callback,
            pageID : this.JsonData.pageID,
        }
        msg.data = {"result":"stop"}
        let message = PackCallBacKMessage(msg,  msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    DrawDownLine(CurLocation): void{
        this.DrawPoint(CurLocation)
        if (this.PointLocation.Num() > 1){
            let temp1 = this.GetPoi(2)
            let StartParam = temp1[0]
            let StartName = temp1[1]
            let temp2 = this.GetPoi(1)
            let EndParam = temp2[0]
            let EndName = temp2[1]
            this.DrawCable(StartParam,1,EndParam,EndName)
            this.AddDistance(this.PointLocation.Get(this.PointLocation.Num() - 2),CurLocation)
        }
    }

    AddDistance(Onepoint,Twopoint){
        let UW = UE.Class.Load("/OpenZIAPI/API/Analysis/Measure/Measure/UMG_Distance.UMG_Distance_C")
        let Controller = UE.GameplayStatics.GetPlayerController(this, 0)
        type UMG_Distance_C  = UE.OpenZIAPI.API.Analysis.Measure.Measure.UMG_Distance.UMG_Distance_C
        let CurUMG = UE.WidgetBlueprintLibrary.Create(this,UW,Controller) as UMG_Distance_C
        CurUMG.AddToViewport(0)
        let ViewportPosition = $ref(new UE.Vector2D(0,0))
        let VerTemp = new UE.Vector((Onepoint.X + Twopoint.X)/2,(Onepoint.Y + Twopoint.Y)/2,(Onepoint.Z + Twopoint.Z)/2)
        UE.WidgetLayoutLibrary.ProjectWorldLocationToWidgetPosition(Controller,VerTemp,ViewportPosition,false)
        let CurViewportPosition = $unref(ViewportPosition)
        CurUMG.SetPositionInViewport(CurViewportPosition,false)
        this.UMG_Array_Distance.Add(CurUMG)
        this.LocArray.Add(VerTemp)
        let distance = 0
        if (this.MeasureType === UE.EMeasureType.Horizontal){
            distance = UE.KismetMathLibrary.Vector_Distance(new UE.Vector(Onepoint.X,Onepoint.Y,0),new UE.Vector(Twopoint.X,Twopoint.Y,0))
            let temp = UE.KismetTextLibrary.Conv_FloatToText(distance / 100,UE.ERoundingMode.HalfFromZero,false,true,1,423,0,2)
            let st = "水平距离：" + temp + "米"
            CurUMG.DisText.SetText(st)
        }
        else if (this.MeasureType === UE.EMeasureType.Height){
            distance = Math.abs(Onepoint.Z - Twopoint.Z)
            let temp = UE.KismetTextLibrary.Conv_FloatToText(distance / 100,UE.ERoundingMode.HalfFromZero,false,true,1,423,0,2)
            let st = "高度：" + temp + "米"
            CurUMG.DisText.SetText(st)
        }
        else if (this.MeasureType === UE.EMeasureType.SraightLine){
            distance = UE.KismetMathLibrary.Vector_Distance(Onepoint,Twopoint)
            let temp = UE.KismetTextLibrary.Conv_FloatToText(distance / 100,UE.ERoundingMode.HalfFromZero,false,true,1,423,0,2)
            let st = "直线距离：" + temp + "米"
            CurUMG.DisText.SetText(st)
        }
    }

    RemoveUI(): void{
        if (this.UMG_Array_Distance.Num() > 0){
            for (let index = 0; index < this.UMG_Array_Distance.Num(); index++){
                this.UMG_Array_Distance.Get(index).RemoveFromParent()
            }
            this.UMG_Array_Distance = null
        }
    }

    RefreshScale(Distance,Scale): void{
        if (this.UMG_Array_Distance.Num() > 0){
            for (let index = 0; index < this.UMG_Array_Distance.Num(); index++){
                if (Distance < this.MaxDistance){
                    this.UMG_Array_Distance.Get(index).SetVisibility(UE.ESlateVisibility.Visible)
                    this.UMG_Array_Distance.Get(index).SetColorAndOpacity(new UE.LinearColor(1,1,1,Scale))
                }
                else {
                    this.UMG_Array_Distance.Get(index).SetVisibility(UE.ESlateVisibility.Hidden)
                }
            }
        }
    }

    RefreshUI(): void{
        let Controller = UE.GameplayStatics.GetPlayerController(this, 0)
        if (this.UMG_Array_Distance.Num() > 0){
            for (let index = 0; index < this.UMG_Array_Distance.Num(); index++){
                let loc = this.LocArray.Get(index)
                let ViewportPosition = $ref(new UE.Vector2D(0,0))
                UE.WidgetLayoutLibrary.ProjectWorldLocationToWidgetPosition(Controller,loc,ViewportPosition,false)
                let CurViewportPosition = $unref(ViewportPosition)
                this.UMG_Array_Distance.Get(index).SetPositionInViewport(CurViewportPosition,false)
            }
        }
    }
}
