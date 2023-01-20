///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/9/28 16:43
///

import {DrawView} from "./DrawView";
import {$ref, $unref} from "puerts";
import {NewArray} from "ue";
import * as UE from "ue";
import {TriangulationOfPolygon, VertexConversionUVs} from "../IHandle/ITriangulateHandle";


export class DrawPlaneView extends DrawView {
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

    EndDrawEvent(): void{
        if (this.PointLocation.Num() >= 3){
            let ProceduralMesh = new UE.ProceduralMeshComponent(this,"ProceduralMesh")
            ProceduralMesh.RegisterComponent()
            ProceduralMesh.K2_AttachToComponent(this.SenceRoot,"ProceduralMesh",UE.EAttachmentRule.KeepWorld,UE.EAttachmentRule.KeepWorld,UE.EAttachmentRule.KeepWorld,true)
            let R = TriangulationOfPolygon(this.PointLocation)
            let Tri = R[0]
            let Normal = R[1]
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
        }
        else {
            console.error("Currently, less than 3 points are drawn and cannot form a surface !!!")
        }
    }
}
