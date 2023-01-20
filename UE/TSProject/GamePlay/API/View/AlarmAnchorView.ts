///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/9/26 14:43
///

import * as UE from 'ue'
import {$ref, $unref} from "puerts";
import {BaseView} from "../../../System/API/View/BaseView";
import {EventDispatcher} from "../../../System/Core/EventDispatcher";

export class AlarmAnchorView extends BaseView {

    //@C++
    Root: UE.SceneComponent
    SM_Circle: UE.StaticMeshComponent
    SceneCoordinates:UE.Vector
    CircleScale:UE.Vector
    CoordinateConverterMgr: UE.CoordinateConverterMgr
    //@ts
    data: any

    Constructor(): void {
        this.PrimaryActorTick.bCanEverTick = true;
        this.Root = this.CreateDefaultSubobjectGeneric<UE.SceneComponent>("Root", UE.SceneComponent.StaticClass())
        this.SM_Circle = this.CreateDefaultSubobjectGeneric<UE.StaticMeshComponent>("SM_Circle", UE.StaticMeshComponent.StaticClass())
        this.RootComponent = this.Root
        this.SM_Circle.SetupAttachment(this.Root, "SM_Circle")
        this.SM_Circle.SetStaticMesh(UE.StaticMesh.Load("/OpenZIAPI/Asset/Mesh/waring_0.waring_0"))
        let hit = $ref(new UE.HitResult)
        let tempR = new UE.Rotator(0,0,0)
        let tempV = new UE.Vector(0,0,0)
        let tempS = new UE.Vector(1,1,1)
        this.SM_Circle.K2_SetRelativeTransform(new UE.Transform(tempR,tempV,tempS),false,hit,false)
        this.SM_Circle.SetCastShadow(false)
        this.SceneCoordinates = new UE.Vector(0,0,0)
        this.CircleScale = new UE.Vector(20,20,20)
    }
    
    ReceiveBeginPlay(): void {
        super.ReceiveBeginPlay()
        this.Init()
         EventDispatcher.GetInstance().Add(this,this.SetScale,"CameraLocation")
    }

    ReceiveTick(DeltaSeconds: number): void {

    }

    private  Init(): void {
        this.CoordinateConverterMgr = UE.CoordinateConverterMgr.GetCoodinateConverterMgr()
    }

    ReceiveEndPlay(EndPlayReason: UE.EEndPlayReason) {
        super.ReceiveEndPlay(EndPlayReason);
        EventDispatcher.GetInstance().Remove(this,"CameraLocation")
    }

    RefreshView(jsonData): string {
        this.data = jsonData.data
        let GeographicPos = new UE.GeographicCoordinates(this.data.coordinates.X, this.data.coordinates.Y, this.data.coordinates.Z)
        let CurEngineLocation = $ref(new UE.Vector(0,0,0))
        this.CoordinateConverterMgr.GeographicToEngine(this.data.GISType, GeographicPos, CurEngineLocation)
        let EngineLocation = $unref(CurEngineLocation)

        if ($unref(CurEngineLocation) === null)
            return "coordinates is error"
        if (this.data.checkFloor){
            const startp = new UE.Vector(0 ,0,1000000)
            const endp = new UE.Vector(0,0,-1000000 )
            let hit = $ref(new UE.HitResult)
            let bsucess  = UE.KismetSystemLibrary.LineTraceSingle(this, startp, endp, UE.ETraceTypeQuery.Visibility, true, undefined, UE.EDrawDebugTrace.None, hit,true, new UE.LinearColor(1, 0, 0, 1), new UE.LinearColor(0, 1, 0, 1), 5)
            if (bsucess){
                this.SceneCoordinates = new UE.Vector($unref(hit).ImpactPoint.X,$unref(hit).ImpactPoint.Y, $unref(hit).ImpactPoint.Z + 1)
            }
            else {
                this.SceneCoordinates = new UE.Vector(EngineLocation.X, EngineLocation.Y , EngineLocation.Z + 1)
            }
        }
        else {
            this.SceneCoordinates = new UE.Vector(EngineLocation.X , EngineLocation.Y , EngineLocation.Z + 1)
        }
        let FHitResult = $ref(new UE.HitResult)
        this.K2_SetActorLocation(this.SceneCoordinates,false,FHitResult,false)

        return "success"
    }

    SetScale(CameraLocation): void {

        let loc = this.K2_GetActorLocation()
        let Distance = UE.KismetMathLibrary.Vector_Distance(CameraLocation, loc)
        let Scale = UE.KismetMathLibrary.SafeDivide(Distance,100000) + 1
        let CircleTransform = this.SM_Circle.K2_GetComponentToWorld()
        let CircleScale = new UE.Vector(this.CircleScale.X * Scale, this.CircleScale.Y * Scale, this.CircleScale.Z * Scale)
        let TempCircleTransform = new UE.Transform(CircleTransform.Rotator(),CircleTransform.GetLocation(),CircleScale)
        let hit1 = $ref(new UE.HitResult)
        this.SM_Circle.K2_SetWorldTransform(TempCircleTransform,false,hit1,false)
    }
}
