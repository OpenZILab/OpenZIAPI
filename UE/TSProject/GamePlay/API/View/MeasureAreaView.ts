///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/10/08 18:20
///

import * as UE from "ue";
import {MeasureView} from "./MeasureView";
import {$ref, $unref} from "puerts";
import {NewArray} from "ue";
import {PolygonTriangulationAreaSum, TriangulationOfPolygon, VertexConversionUVs} from "../IHandle/ITriangulateHandle";
import {PackCallBacKMessage} from "../../../System/API/IHandle/IAPIMessageHandle";
import {WebSocketServer} from "../../../System/API/Handle/WebSocketServer";

export class MeasureAreaView extends MeasureView {

    //@ts
    UMGArray_Area: UE.OpenZIAPI.API.Analysis.Measure.Measure.UMG_Area.UMG_Area_C

    Constructor(){
        super.Constructor()
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
        this.DrawDownPlane(CurLocation)
    }

    EndDrawEvent(): void{
        if (this.PointLocation.Num() >= 3){
            let ProceduralMesh = new UE.ProceduralMeshComponent(this,"ProceduralMesh")
            ProceduralMesh.RegisterComponent()
            ProceduralMesh.K2_AttachToComponent(this.SenceRoot,"ProceduralMesh",UE.EAttachmentRule.KeepWorld,UE.EAttachmentRule.KeepWorld,UE.EAttachmentRule.KeepWorld,true)
            let R = TriangulationOfPolygon(this.PointLocation)
            let Tri = R[0]
            let Normal = R[1]
            let Size = PolygonTriangulationAreaSum(this.PointLocation,Tri,100)
            let OutRectCenter = $ref(new UE.Vector(0,0,0))
            let OutRectRotation = $ref(new UE.Rotator(0,0,0))
            let OutSideLengthX = $ref(11)
            let OutSideLengthY = $ref(11)
            UE.KismetMathLibrary.MinAreaRectangle(this,this.PointLocation,new UE.Vector(0,0,1),OutRectCenter,OutRectRotation,OutSideLengthX,OutSideLengthY)
            let temp = UE.KismetMathLibrary.FMax($unref(OutSideLengthX),$unref(OutSideLengthY))
            let CurUVs = VertexConversionUVs(this.PointLocation,Normal,temp,0,new UE.Vector2D(0,0))
            let Normals = NewArray(UE.Vector)
            let Tangents = UE.NewArray(UE.ProcMeshTangent)
            UE.KismetProceduralMeshLibrary.CalculateTangentsForMesh(this.PointLocation,Tri,CurUVs,$ref(Normals),$ref(Tangents))
            ProceduralMesh.CreateMeshSection_LinearColor(0,this.PointLocation,Tri,Normals,CurUVs,undefined,undefined,undefined,undefined,Tangents,true)
            ProceduralMesh.SetMaterial(0,this.MaterialInstCable)
            this.AddArea(Size)
        }
        else {
            console.error("Currently, less than 3 points are drawn and cannot form a surface !!!")
        }
        let msg ={
            classDef : "MeasureArea",
            funcDef : "Stop",
            data : undefined,
            callback : this.JsonData.callback,
            pageID : this.JsonData.pageID,
        }
        msg.data = {"result":"stop"}
        let message = PackCallBacKMessage(msg,  msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    DrawDownPlane(CurLocation): void{
        this.DrawPoint(CurLocation)
        if (this.PointLocation.Num() > 1){
            if (this.PointLocation.Num() === 2){
                let temp1 = this.GetPoi(2)
                let StartParam = temp1[0]
                let StartName = temp1[1]
                let temp2 = this.GetPoi(1)
                let EndParam = temp2[0]
                let EndName = temp2[1]
                this.DrawCable(StartParam,1,EndParam,EndName)
            }
            else {
                if (this.PointLocation.Num() === 3){
                    let temp1 = this.GetPoi(2)
                    let StartParam = temp1[0]
                    let StartName = temp1[1]
                    let temp2 = this.GetPoi(1)
                    let EndParam = temp2[0]
                    let EndName = temp2[1]
                    this.DrawCable(StartParam,1,EndParam,EndName)
                    let temp3 = this.GetPoi(0)
                    let EndParam2 = temp3[0]
                    let EndName2 = temp3[1]
                    this.DrawCable(EndParam,0,EndParam2,EndName2)
                }
                else {
                    let temp1 = this.GetPoi(2)
                    let StartParam = temp1[0]
                    let StartName = temp1[1]
                    let temp2 = this.GetPoi(1)
                    let EndParam = temp2[0]
                    let EndName = temp2[1]
                    let ChildrenTemp= $ref(NewArray(UE.SceneComponent))
                    StartParam.GetChildrenComponents(false,ChildrenTemp)
                    let Children = $unref(ChildrenTemp)
                    let CableC =  Children.Get(0) as UE.CableComponent
                    let isvalid = UE.KismetSystemLibrary.IsValid(CableC)
                    if (isvalid){
                        CableC.SetAttachEndToComponent(EndParam,EndName)
                    }
                    let temp3 = this.GetPoi(0)
                    let EndParam2 = temp3[0]
                    let EndName2 = temp3[1]
                    this.DrawCable(EndParam,0,EndParam2,EndName2)
                }
            }
        }
    }

    AddArea(Area){
        let Controller = UE.GameplayStatics.GetPlayerController(this, 0)
        type UMG_Area_C  = UE.OpenZIAPI.API.Analysis.Measure.Measure.UMG_Area.UMG_Area_C
        let UW = UE.Class.Load("/OpenZIAPI/API/Analysis/Measure/Measure/UMG_Area.UMG_Area_C")
        let CurUMG = UE.WidgetBlueprintLibrary.Create(this,UW,Controller) as UMG_Area_C
        CurUMG.AddToViewport(0)
        this.UMGArray_Area = CurUMG
        let locSun = new UE.Vector(0,0,0)
        for (let index = 0; index < this.PointLocation.Num(); index++){
            locSun = UE.KismetMathLibrary.Add_VectorVector(locSun ,this.PointLocation.Get(index))
        }
        let CurlocSun = UE.KismetMathLibrary.Divide_VectorInt(locSun ,this.PointLocation.Num())
        let ViewportPosition = $ref(new UE.Vector2D(0,0))
        UE.WidgetLayoutLibrary.ProjectWorldLocationToWidgetPosition(Controller,CurlocSun,ViewportPosition,false)
        let CurViewportPosition = $unref(ViewportPosition)
        this.UMGArray_Area.SetPositionInViewport(CurViewportPosition,false)
        let temp = UE.KismetTextLibrary.Conv_FloatToText(Area,UE.ERoundingMode.HalfFromZero,false,true,1,423,0,2)
        let st = "面积：" + temp + "平方米"
        CurUMG.AreaText.SetText(st)
    }

    RemoveUI(): void{
        if (this.UMGArray_Area !== undefined){
            this.UMGArray_Area.RemoveFromParent()
            this.UMGArray_Area = undefined
        }
    }

    RefreshScale(Distance,Scale): void{
        if (this.UMGArray_Area !== undefined){
            if (Distance < this.MaxDistance){
                this.UMGArray_Area.SetVisibility(UE.ESlateVisibility.Visible)
                this.UMGArray_Area.SetColorAndOpacity(new UE.LinearColor(1,1,1,Scale))
            }
            else {
                this.UMGArray_Area.SetVisibility(UE.ESlateVisibility.Hidden)
            }
        }
    }

    RefreshUI(): void{
        let Controller = UE.GameplayStatics.GetPlayerController(this, 0)
        if (this.UMGArray_Area !== undefined && this.PointLocation.Num() >= 3){
            let locSun = new UE.Vector(0,0,0)
            for (let index = 0; index < this.PointLocation.Num(); index++){
                locSun = UE.KismetMathLibrary.Add_VectorVector(locSun ,this.PointLocation.Get(index))
            }
            let CurlocSun = UE.KismetMathLibrary.Divide_VectorInt(locSun ,this.PointLocation.Num())
            let ViewportPosition = $ref(new UE.Vector2D(0,0))
            UE.WidgetLayoutLibrary.ProjectWorldLocationToWidgetPosition(Controller,CurlocSun,ViewportPosition,false)
            let CurViewportPosition = $unref(ViewportPosition)
            this.UMGArray_Area.SetPositionInViewport(CurViewportPosition,false)
        }
    }
}
