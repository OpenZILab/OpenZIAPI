///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/9/27 18:33
///

import * as UE from 'ue'
import {NewArray} from "ue";
import {$ref, $unref} from "puerts";
import {BaseView} from "../../../System/API/View/BaseView";
import {EventDispatcher} from "../../../System/Core/EventDispatcher";

export class DrawView extends BaseView {

    //@C++
    SenceRoot: UE.SceneComponent
    MaterialInstPoint: UE.MaterialInstanceDynamic
    MaterialInstCable: UE.MaterialInstanceDynamic
    IsEnd: boolean
    PointLocation: UE.TArray<UE.Vector>
    CoordinateConverterMgr: UE.CoordinateConverterMgr
    //@ts
    data: any

    Constructor(): void {
        this.PrimaryActorTick.bCanEverTick = true;
        this.SenceRoot = this.CreateDefaultSubobjectGeneric<UE.SceneComponent>("SenceRoot", UE.SceneComponent.StaticClass())
        this.RootComponent = this.SenceRoot
        let Material = UE.MaterialInstance.Load("/OpenZIAPI/Asset/Material/PureColorMaterial_Inst1")
        this.MaterialInstPoint = UE.KismetMaterialLibrary.CreateDynamicMaterialInstance(this, Material, "None", UE.EMIDCreationFlags.None)
        this.MaterialInstCable = UE.KismetMaterialLibrary.CreateDynamicMaterialInstance(this, Material, "None", UE.EMIDCreationFlags.None)
        this.MaterialInstPoint.SetVectorParameterValue("BaseColor", new UE.LinearColor(1, 0.1, 0.1, 1))
        this.MaterialInstCable.SetVectorParameterValue("BaseColor", new UE.LinearColor(0.15, 1, 0.33, 0.4))
        this.IsEnd = false
        this.PointLocation = NewArray(UE.Vector)
    }

    ReceiveBeginPlay(): void {
        super.ReceiveBeginPlay()

        this.Init()
        EventDispatcher.GetInstance().Add(this,this.SetScale,"CameraLocation")
        let CurController = UE.GameplayStatics.GetPlayerController(this,0)
        CurController.HitResultTraceDistance = 10000000000.0
    }

    ReceiveTick(DeltaSeconds: number): void {
        if (this.IsEnd === false) {
            this.ListenKeyAction()
        }
    }

    ReceiveEndPlay(EndPlayReason): void {
        EventDispatcher.GetInstance().Remove(this,"CameraLocation")
        if (this.IsEnd !== true) {
            this.IsEnd = true
            this.EndDrawEvent()
        }
    }


    Init(): void {
        this.CoordinateConverterMgr = UE.CoordinateConverterMgr.GetCoodinateConverterMgr()
    }

    RefreshView(jsonData): string {
        this.data = jsonData.data
        // this.DrawType = this.data.drawType
        this.MaterialInstPoint.SetVectorParameterValue("BaseColor", new UE.LinearColor(this.data.pointColor.X, this.data.pointColor.Y, this.data.pointColor.Z, this.data.pointColor.W))
        this.MaterialInstCable.SetVectorParameterValue("BaseColor", new UE.LinearColor(this.data.lineColor.X, this.data.lineColor.Y, this.data.lineColor.Z, this.data.lineColor.W))
        return "success"
    }

    GetUnderHit(): UE.HitResult {
        let CurPlayerController = UE.GameplayStatics.GetPlayerController(this, 0)
        let HitResult1 = $ref(new UE.HitResult)
        let IsBool1 = CurPlayerController.GetHitResultUnderCursorByChannel(UE.ETraceTypeQuery.Visibility, true, HitResult1)
        let HitResult2 = $ref(new UE.HitResult)
        let IsBool2 = CurPlayerController.GetHitResultUnderFingerByChannel(UE.ETouchIndex.Touch1, UE.ETraceTypeQuery.Visibility, true, HitResult2)
        let Hit = new UE.HitResult
        if (IsBool1) {
            Hit = $unref(HitResult1)
        } else {
            if (IsBool2) {
                Hit = $unref(HitResult2)
            }
        }
        return Hit
    }

    ListenKeyAction(): void {
        let CurPlayerController = UE.GameplayStatics.GetPlayerController(this, 0)
        let LeftMouse = this.MakeKey("LeftMouseButton")
        let Touch1 = this.MakeKey("Touch1")
        let MiddleMouse = this.MakeKey("MiddleMouseButton")
        let IsMouse1 = CurPlayerController.WasInputKeyJustPressed(LeftMouse)
        let IsTouch1 = CurPlayerController.WasInputKeyJustPressed(Touch1)
        let IsMouse2 = CurPlayerController.WasInputKeyJustReleased(LeftMouse)
        let IsTouch2 = CurPlayerController.WasInputKeyJustReleased(Touch1)
        let IsMiddleMouse1 = CurPlayerController.WasInputKeyJustPressed(MiddleMouse)

        if (IsMouse1 || IsTouch1) {
            this.DrawDown()
        } else {
            if (IsMouse2 || IsTouch2) {
                this.DrawUp()
            } else {
                this.Uping()
            }
        }
        if (IsMiddleMouse1){
            this.EndDraw()
        }
    }

    MakeKey(KeyName): UE.Key {
        let key = new UE.Key
        key.KeyName = KeyName
        return key
    }

    DrawDown(): void {
        if (this.IsEnd !== true) {
            let Hit = this.GetUnderHit()
            if (Hit.bBlockingHit) {
                let curloc = new UE.Vector(Hit.ImpactPoint.X, Hit.ImpactPoint.Y, Hit.ImpactPoint.Z + 1)
                this.PointLocation.Add(curloc)
                this.DrawDownEvent(curloc)
            }
        }
    }

    DrawUp(): void {

    }

    Uping(): void {

    }

    DrawDownEvent(CurLocation): void {

    }

    DrawPoint(CurLocation): void {
        let Transform = new UE.Transform(new UE.Rotator(0, 0, 0), CurLocation, new UE.Vector(1, 1, 1))
        let PointLoc = this.PointLocation.Num()
        let name = "Poi_" + PointLoc
        let staticmeshComponent = new UE.StaticMeshComponent(this, name)
        staticmeshComponent.RegisterComponent()
        staticmeshComponent.SetStaticMesh(UE.StaticMesh.Load("/Engine/BasicShapes/Sphere"))
        staticmeshComponent.SetMaterial(0, this.MaterialInstPoint)
        staticmeshComponent.K2_AttachToComponent(this.SenceRoot, name, UE.EAttachmentRule.KeepWorld, UE.EAttachmentRule.KeepWorld, UE.EAttachmentRule.KeepWorld, true)

        let HitResult = $ref(new UE.HitResult)
        staticmeshComponent.K2_SetWorldTransform(Transform, false, HitResult, false)
    }

    DrawCable(StartParam, StartNameId, EndParam, EndName): void {
        let PointLoc = this.PointLocation.Num()
        let temp = PointLoc - StartNameId
        let name = "Cable_" + temp
        let CableComponent = new UE.CableComponent(this, name)
        CableComponent.RegisterComponent()
        CableComponent.SolverIterations = 16
        CableComponent.CableGravityScale = 0
        CableComponent.EndLocation = new UE.Vector(0, 0, 0)
        CableComponent.CableWidth = 50
        CableComponent.CableLength = 0
        CableComponent.NumSegments = 1
        CableComponent.K2_AttachToComponent(StartParam, name, UE.EAttachmentRule.KeepRelative, UE.EAttachmentRule.KeepRelative, UE.EAttachmentRule.KeepRelative, true)
        CableComponent.SetAttachEndToComponent(EndParam, EndName)
        CableComponent.SetMaterial(0, this.MaterialInstCable)
    }

    GetPoi(index): any {
        let ChildIndex
        if (index === 0) {
            ChildIndex = index
        } else {
            ChildIndex = this.PointLocation.Num() - index
        }
        let CurComponent = this.SenceRoot.GetChildComponent(ChildIndex)
        let name = UE.KismetSystemLibrary.GetObjectName(CurComponent)
        let R: [any, any] = [CurComponent, name]
        return R
    }

    EndDraw(): void {
        if (this.IsEnd !== true) {
            this.IsEnd = true
            this.EndDrawEvent()
        }
    }

    EndDrawEvent(): void {

    }

    SetScale(CameraLocation): void {
        let ChildrenComponents = $ref(NewArray(UE.SceneComponent))
        this.SenceRoot.GetChildrenComponents(true, ChildrenComponents)
        let tempChildrens = $unref(ChildrenComponents)
        let Distance = 0
        for (let index = 0; index < tempChildrens.Num(); index++) {
            let temp = UE.GameplayStatics.GetObjectClass(tempChildrens.Get(index))
            let name = UE.KismetSystemLibrary.GetClassDisplayName(temp)
            if (name !== "ProceduralMeshComponent") {
                let Transform = tempChildrens.Get(index).K2_GetComponentToWorld()
                let TempDistance = UE.KismetMathLibrary.Vector_Distance(CameraLocation, Transform.GetLocation())
                if (TempDistance > Distance) {
                    Distance = TempDistance
                }
            }
        }
        let Scale = UE.KismetMathLibrary.SafeDivide(Distance, 10000)
        for (let index = 0; index < tempChildrens.Num(); index++) {
            let temp = UE.GameplayStatics.GetObjectClass(tempChildrens.Get(index))
            let name = UE.KismetSystemLibrary.GetClassDisplayName(temp)
            if (name !== "ProceduralMeshComponent") {
                let Transform = tempChildrens.Get(index).K2_GetComponentToWorld()
                let TempTransform = new UE.Transform(Transform.Rotator(), Transform.GetLocation(), new UE.Vector(Scale, Scale, Scale))
                let hit = $ref(new UE.HitResult)
                tempChildrens.Get(index).K2_SetWorldTransform(TempTransform, false, hit, false)
            }
        }
    }
}
