"use strict";
///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/12/08 18:38
///
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneViewingView = void 0;
const UE = require("ue");
const puerts_1 = require("puerts");
const BaseView_1 = require("../../../System/API/View/BaseView");
const puerts = require("puerts");
const ue_1 = require("ue");
const SceneViewingCameraView_1 = require("./SceneViewingCameraView");
const IAPIMessageHandle_1 = require("../../../System/API/IHandle/IAPIMessageHandle");
const WebSocketServer_1 = require("../../../System/API/Handle/WebSocketServer");
const MessagePupop_1 = require("../../../System/Core/MessagePupop/MessagePupop");
const MessageList_1 = require("../../../System/Core/MessagePupop/MessageList");
const MessageNotificationHandle_1 = require("../../../System/API/Handle/MessageNotificationHandle");
class SceneViewingView extends BaseView_1.BaseView {
    //@C++
    Root;
    Spline;
    Camera;
    CoordinateConverterMgr;
    SplineMesh;
    SceneViewingPawn;
    //@ts
    data;
    defaultPawn;
    CurrentWorld;
    IsAddPoint;
    IsPlaying;
    Distance;
    CurNum;
    SplineDistance;
    CameraActor;
    callback;
    pageID;
    CameraViewClass;
    Constructor() {
        this.PrimaryActorTick.bCanEverTick = true;
        this.Root = this.CreateDefaultSubobjectGeneric("Root", UE.SceneComponent.StaticClass());
        this.RootComponent = this.Root;
        this.Root.SetMobility(UE.EComponentMobility.Movable);
        this.Spline = this.CreateDefaultSubobjectGeneric("Spline", UE.SplineComponent.StaticClass());
        this.Spline.SetupAttachment(this.Root, "Spline");
        this.Camera = this.CreateDefaultSubobjectGeneric("Camera", UE.CameraComponent.StaticClass());
        this.Camera.SetupAttachment(this.Root, "Camera");
        this.defaultPawn = undefined;
        this.SceneViewingPawn = undefined;
        this.CurrentWorld = undefined;
        this.IsAddPoint = false;
        this.IsPlaying = false;
        this.Distance = 0;
        this.CurNum = 1;
        this.SplineDistance = new Array();
        this.SplineMesh = (0, ue_1.NewArray)(UE.SplineMeshComponent);
        this.CameraActor = (0, ue_1.NewArray)(SceneViewingCameraView_1.SceneViewingCameraView);
        this.callback = 0;
        this.pageID = 0;
        this.CameraViewClass = (0, puerts_1.makeUClass)(SceneViewingCameraView_1.SceneViewingCameraView);
    }
    ReceiveBeginPlay() {
        super.ReceiveBeginPlay();
        this.Init();
    }
    ReceiveTick(DeltaSeconds) {
        if (this.IsAddPoint) {
            this.ListenKeyAction();
        }
        if (this.IsPlaying) {
            this.Playing(DeltaSeconds);
        }
    }
    Init() {
        this.CoordinateConverterMgr = UE.CoordinateConverterMgr.GetCoodinateConverterMgr();
        this.Spline.ClearSplinePoints(true);
        this.CurrentWorld = puerts.argv.getByName("GameInstance").GetWorld();
        this.defaultPawn = UE.GameplayStatics.GetPlayerPawn(this.CurrentWorld, 0);
    }
    ReceiveEndPlay(EndPlayReason) {
        super.ReceiveEndPlay(EndPlayReason);
        this.SceneViewPawnToDefaultPawn();
        for (let i = 0; i < this.CameraActor.Num(); i++) {
            this.CameraActor.Get(i).K2_DestroyActor();
        }
        this.CameraActor.Empty();
        for (let i = 0; i < this.SplineMesh.Num(); i++) {
            this.SplineMesh.Get(i).K2_DestroyComponent(this.SplineMesh.Get(i));
        }
        this.SplineMesh.Empty();
        this.Spline.ClearSplinePoints();
    }
    ListenKeyAction() {
        let CurPlayerController = UE.GameplayStatics.GetPlayerController(this, 0);
        let SpaceBar = this.MakeKey("SpaceBar");
        let IsSpaceBar = CurPlayerController.WasInputKeyJustPressed(SpaceBar);
        if (IsSpaceBar) {
            this.AddPoint();
        }
    }
    MakeKey(KeyName) {
        let key = new UE.Key;
        key.KeyName = KeyName;
        return key;
    }
    ClearAllData() {
        this.Spline.ClearSplinePoints();
        for (let i = 0; i < this.SplineMesh.Num(); i++) {
            this.SplineMesh.Get(i).K2_DestroyComponent(this.SplineMesh.Get(i));
        }
        this.SplineMesh.Empty();
        for (let i = 0; i < this.CameraActor.Num(); i++) {
            this.CameraActor.Get(i).K2_DestroyActor();
        }
        this.CameraActor.Empty();
        this.IsAddPoint = false;
        this.IsPlaying = false;
        this.Distance = 0;
        this.CurNum = 1;
        this.SplineDistance.length = 0;
        this.SceneViewPawnToDefaultPawn();
    }
    RefreshView(jsonData) {
        this.data = jsonData.data;
        this.callback = jsonData.callback;
        this.pageID = jsonData.pageID;
        this.ClearAllData();
        if (this.data.isUsedPointsInfo) {
            if (this.data.pointsInfoList.length > 0) {
                for (let index = 0; index < this.data.pointsInfoList.length; index++) {
                    let GeographicPos = new UE.GeographicCoordinates(this.data.pointsInfoList[index].coordinates.X, this.data.pointsInfoList[index].coordinates.Y, this.data.pointsInfoList[index].coordinates.Z);
                    let CurEngineLocation = (0, puerts_1.$ref)(new UE.Vector(0, 0, 0));
                    this.CoordinateConverterMgr.GeographicToEngine(this.data.GISType, GeographicPos, CurEngineLocation);
                    let uecoor = (0, puerts_1.$unref)(CurEngineLocation);
                    if ((0, puerts_1.$unref)(CurEngineLocation) === null)
                        return "coordinates is error";
                    let CurRotation = new UE.Rotator(this.data.pointsInfoList[index].lensRotation.X, this.data.pointsInfoList[index].lensRotation.Y, this.data.pointsInfoList[index].lensRotation.Z);
                    let CurAT = new UE.Vector(this.data.pointsInfoList[index].arriveTangent.X, this.data.pointsInfoList[index].arriveTangent.Y, this.data.pointsInfoList[index].arriveTangent.Z);
                    let CurLT = new UE.Vector(this.data.pointsInfoList[index].leaveTangent.X, this.data.pointsInfoList[index].leaveTangent.Y, this.data.pointsInfoList[index].leaveTangent.Z);
                    this.CreatCameraMeshActor(uecoor, CurRotation, index, this.data.pointsInfoList[index].point_type, CurAT, CurLT);
                    for (let i = 0; i < this.CameraActor.Num(); i++) {
                        this.CameraActor.Get(i).IsAdding = false;
                    }
                    this.UpdateSpline(true);
                    if (this.data.isShowSplineMesh) {
                        this.CreatSplineMesh();
                    }
                }
                this.CalculateSplinePointsDistance();
                if (this.data.isPlaying) {
                    let msg = {
                        classDef: "SceneViewing",
                        funcDef: "StopPlay",
                        data: undefined,
                        callback: this.callback,
                        pageID: this.pageID,
                    };
                    this.StartPlay(msg);
                }
            }
        }
        return "success";
    }
    StartAddScenePoint() {
        let NotifiItem;
        let NotifiStyle = new MessageNotificationHandle_1.NotificationStyle();
        NotifiStyle.RegisterFrameStyle(MessageList_1.MessageTips.API.ScreenViewing_1, 600, 3, false);
        // NotifiStyle.AddNotifiButton("确定", () => { NotifiItem.SetCompletionState(UE.EDisplayState.CS_Pending) }, "cc", ENotifiButtonState.None)
        NotifiItem = MessagePupop_1.MessagePopup.ShowNotification(MessageList_1.MessageTips.OPERATION_MESSAGE.NOTIFICATION, NotifiStyle);
        NotifiItem.SetCompletionState(UE.EDisplayState.CS_None);
        NotifiItem.ExpireAndFadeout();
        let NotifiItem2;
        let NotifiStyle2 = new MessageNotificationHandle_1.NotificationStyle();
        NotifiStyle2.RegisterFrameStyle(MessageList_1.MessageTips.API.ScreenViewing_2, 600, 3, false);
        NotifiItem2 = MessagePupop_1.MessagePopup.ShowNotification(MessageList_1.MessageTips.OPERATION_MESSAGE.NOTIFICATION, NotifiStyle2);
        NotifiItem2.SetCompletionState(UE.EDisplayState.CS_None);
        NotifiItem2.ExpireAndFadeout();
        if (this.SceneViewingPawn === undefined) {
            let CurCamera = UE.GameplayStatics.GetPlayerCameraManager(this.CurrentWorld, 0);
            let CameraTransform = CurCamera.GetTransform();
            let CurTransform = new UE.Transform(CameraTransform.Rotator(), CameraTransform.GetLocation(), new UE.Vector(1, 1, 1));
            this.SceneViewingPawn = UE.WorldExtensionMethods.SpawnActor(this.CurrentWorld, UE.DefaultPawn.StaticClass(), CurTransform, UE.ESpawnActorCollisionHandlingMethod.AlwaysSpawn, undefined, undefined);
            this.SceneViewingPawn.MeshComponent.SetCollisionEnabled(UE.ECollisionEnabled.NoCollision);
            this.SceneViewingPawn.CollisionComponent.SetCollisionEnabled(UE.ECollisionEnabled.NoCollision);
            let temppawn = this.SceneViewingPawn.MovementComponent;
            temppawn.MaxSpeed = 1200000;
            temppawn.Acceleration = 8000;
            temppawn.Deceleration = 100000;
            temppawn.TurningBoost = 8;
        }
        let Controller = UE.GameplayStatics.GetPlayerController(this.CurrentWorld, 0);
        Controller.UnPossess();
        Controller.SetViewTargetWithBlend(this.SceneViewingPawn, 0, UE.EViewTargetBlendFunction.VTBlend_Linear, 0, false);
        Controller.Possess(this.SceneViewingPawn);
        this.IsAddPoint = true;
        for (let i = 0; i < this.CameraActor.Num(); i++) {
            this.CameraActor.Get(i).IsAdding = true;
        }
    }
    AddPoint() {
        let CurLocation = this.SceneViewingPawn.GetTransform().GetLocation();
        let CurRotation = UE.GameplayStatics.GetPlayerCameraManager(this.CurrentWorld, 0).GetTransform().Rotator();
        this.CreatCameraMeshActor(CurLocation, CurRotation, this.CameraActor.Num(), this.data.defaultPointsType, new UE.Vector(0, 0, 0), new UE.Vector(0, 0, 0));
    }
    CreatCameraMeshActor(location, Rotiton, Index, SplinePointType, ATangent, LTangent) {
        let transfrom = new UE.Transform(Rotiton, location, new UE.Vector(5, 5, 5));
        let CurCameraMeshActor = this.GetWorld().SpawnActor(this.CameraViewClass, transfrom, UE.ESpawnActorCollisionHandlingMethod.AlwaysSpawn, undefined, undefined);
        this.CameraActor.Add(CurCameraMeshActor);
        CurCameraMeshActor.SetSplinePointInfo(location, Rotiton, Index, SplinePointType, ATangent, LTangent);
        CurCameraMeshActor.SetOwnerActor(this);
        CurCameraMeshActor.IsAdding = true;
        if (!this.data.isShowPointCamera) {
            CurCameraMeshActor.SetActorHiddenInGame(true);
        }
    }
    //结束加点
    EndAddScenePoint() {
        this.IsAddPoint = false;
        for (let i = 0; i < this.CameraActor.Num(); i++) {
            this.CameraActor.Get(i).IsAdding = false;
        }
        this.SceneViewPawnToDefaultPawn();
        this.UpdateSpline(false);
        if (this.data.isShowSplineMesh) {
            this.CreatSplineMesh();
        }
        this.CalculateSplinePointsDistance();
    }
    SceneViewPawnToDefaultPawn() {
        let Controller = UE.GameplayStatics.GetPlayerController(this.CurrentWorld, 0);
        Controller.UnPossess();
        Controller.SetViewTargetWithBlend(this.defaultPawn, 0, UE.EViewTargetBlendFunction.VTBlend_Linear, 0, false);
        Controller.Possess(this.defaultPawn);
        UE.WidgetBlueprintLibrary.SetInputMode_GameAndUIEx(Controller, undefined, UE.EMouseLockMode.DoNotLock, false);
        if (this.SceneViewingPawn) {
            this.SceneViewingPawn.K2_DestroyActor();
            this.SceneViewingPawn = undefined;
        }
    }
    UpdateSpline(IsUsedPointInfos) {
        this.Spline.ClearSplinePoints();
        let CurType = undefined;
        let CurAT = new UE.Vector(0, 0, 0);
        let CurLT = new UE.Vector(0, 0, 0);
        if (!IsUsedPointInfos) {
            CurType = this.data.defaultPointsType;
            CurAT = new UE.Vector(0, 0, 0);
            CurLT = new UE.Vector(0, 0, 0);
        }
        for (let i = 0; i < this.CameraActor.Num(); i++) {
            let CurTransform = this.CameraActor.Get(i).CameraMesh.K2_GetComponentToWorld();
            if (IsUsedPointInfos) {
                CurType = this.CameraActor.Get(i).GetPointType();
                CurAT = this.CameraActor.Get(i).GetArriveTangent();
                CurLT = this.CameraActor.Get(i).GetLeaveTangent();
            }
            let CurSplinePoint = new UE.SplinePoint(i, CurTransform.GetLocation(), CurAT, CurLT, new UE.Rotator(0, 0, 0), new UE.Vector(1, 1, 1), CurType);
            this.Spline.AddPoint(CurSplinePoint, false);
        }
        if (this.data.isEndToEnd) {
            let CurTransform = this.CameraActor.Get(0).CameraMesh.K2_GetComponentToWorld();
            if (IsUsedPointInfos) {
                CurType = this.CameraActor.Get(0).GetPointType();
                CurAT = this.CameraActor.Get(0).GetArriveTangent();
                CurLT = this.CameraActor.Get(0).GetLeaveTangent();
            }
            let CurSplinePoint = new UE.SplinePoint(this.CameraActor.Num(), CurTransform.GetLocation(), CurAT, CurLT, new UE.Rotator(0, 0, 0), new UE.Vector(1, 1, 1), CurType);
            this.Spline.AddPoint(CurSplinePoint, false);
        }
        this.Spline.UpdateSpline();
    }
    CreatSplineMesh() {
        let SplineMeshNum = this.Spline.GetNumberOfSplinePoints() - 1;
        if (SplineMeshNum < 1) {
            return "No valid point currently exists";
        }
        if (this.SplineMesh) {
            for (let i = 0; i < this.SplineMesh.Num(); i++) {
                this.SplineMesh.Get(i).K2_DestroyComponent(this.SplineMesh.Get(i));
            }
            this.SplineMesh.Empty();
        }
        for (let i = 0; i < SplineMeshNum; i++) {
            let name = "SplineMesh_" + i;
            let CurSplineMesh = new UE.SplineMeshComponent(this, name);
            CurSplineMesh.SetMobility(UE.EComponentMobility.Movable);
            CurSplineMesh.SetStaticMesh(UE.StaticMesh.Load("/OpenZIAPI/Asset/Mesh/SceneSphere.SceneSphere"));
            CurSplineMesh.RegisterComponent();
            CurSplineMesh.K2_AttachToComponent(this.Root, name, UE.EAttachmentRule.KeepWorld, UE.EAttachmentRule.KeepWorld, UE.EAttachmentRule.KeepWorld, true);
            this.SplineMesh.Add(CurSplineMesh);
            let location_1_rev = (0, puerts_1.$ref)(new UE.Vector);
            let tangent_1_rev = (0, puerts_1.$ref)(new UE.Vector);
            this.Spline.GetLocationAndTangentAtSplinePoint(i, location_1_rev, tangent_1_rev, UE.ESplineCoordinateSpace.World);
            let location_2_rev = (0, puerts_1.$ref)(new UE.Vector);
            let tangent_2_rev = (0, puerts_1.$ref)(new UE.Vector);
            this.Spline.GetLocationAndTangentAtSplinePoint(i + 1, location_2_rev, tangent_2_rev, UE.ESplineCoordinateSpace.World);
            let tangent_1 = (0, puerts_1.$unref)(tangent_1_rev);
            let tangent_2 = (0, puerts_1.$unref)(tangent_2_rev);
            if (this.Spline.GetSplinePointType(i) === UE.ESplinePointType.Linear) {
                tangent_1 = new UE.Vector(0, 0, 0);
                tangent_2 = new UE.Vector(0, 0, 0);
            }
            CurSplineMesh.SetStartAndEnd((0, puerts_1.$unref)(location_1_rev), tangent_1, (0, puerts_1.$unref)(location_2_rev), tangent_2, true);
        }
    }
    StartPlay(msg) {
        this.callback = msg.callback;
        this.pageID = msg.pageID;
        this.EndAddScenePoint();
        if (this.Spline.GetNumberOfSplinePoints() >= 2) {
            this.defaultPawn = undefined;
            this.defaultPawn = UE.GameplayStatics.GetPlayerPawn(this.CurrentWorld, 0);
            this.Distance = 0;
            this.CurNum = 0;
            let CurPlayerController = UE.GameplayStatics.GetPlayerController(this, 0);
            CurPlayerController.SetViewTargetWithBlend(this, 0, UE.EViewTargetBlendFunction.VTBlend_Linear, 0, false);
            UE.WidgetBlueprintLibrary.SetInputMode_UIOnlyEx(CurPlayerController, undefined, UE.EMouseLockMode.DoNotLock);
            this.IsPlaying = true;
            this.HiddenCameraMeshActor(true);
            this.HiddenSplineMesh(true);
        }
        else {
            return "Currently there is no SceneViewing path";
        }
    }
    Playing(DeltaSeconds) {
        this.Distance = this.Distance + this.data.speed * DeltaSeconds;
        if (this.Distance >= this.Spline.GetSplineLength()) {
            if (this.data.isLoopPlay) {
                this.Distance = 0;
                this.CurNum = 1;
            }
            else {
                this.StopPlay();
            }
        }
        else {
            this.CurNum = this.DistanceOfSplinePoints(this.CurNum);
            if (this.data.isUsedLensRotation) {
                let TempRotator1;
                let TempRotator2;
                if (this.data.isEndToEnd && this.CurNum === this.Spline.GetNumberOfSplinePoints() - 1) {
                    TempRotator1 = this.CameraActor.Get(this.CurNum - 1).CameraMesh.K2_GetComponentToWorld().Rotator();
                    TempRotator2 = this.CameraActor.Get(0).CameraMesh.K2_GetComponentToWorld().Rotator();
                }
                else {
                    TempRotator1 = this.CameraActor.Get(this.CurNum - 1).CameraMesh.K2_GetComponentToWorld().Rotator();
                    TempRotator2 = this.CameraActor.Get(this.CurNum).CameraMesh.K2_GetComponentToWorld().Rotator();
                }
                let Alpha = (this.Distance - this.SplineDistance[this.CurNum - 1]) /
                    (this.SplineDistance[this.CurNum] - this.SplineDistance[this.CurNum - 1]);
                let CurRotator = UE.KismetMathLibrary.RLerp(TempRotator1, TempRotator2, Alpha, true);
                let CurTransform = this.Spline.GetTransformAtDistanceAlongSpline(this.Distance, UE.ESplineCoordinateSpace.World, false);
                let HitResult = (0, puerts_1.$ref)(new UE.HitResult);
                this.Camera.K2_SetWorldLocationAndRotation(CurTransform.GetLocation(), CurRotator, false, HitResult, false);
            }
            else {
                let CurTransform = this.Spline.GetTransformAtDistanceAlongSpline(this.Distance, UE.ESplineCoordinateSpace.World, false);
                let HitResult = (0, puerts_1.$ref)(new UE.HitResult);
                this.Camera.K2_SetWorldLocationAndRotation(CurTransform.GetLocation(), CurTransform.Rotator(), false, HitResult, false);
            }
        }
    }
    StopPlay() {
        this.IsPlaying = false;
        this.SceneViewPawnToDefaultPawn();
        let msg = {
            classDef: "SceneViewing",
            funcDef: "StopPlay",
            data: undefined,
            callback: this.callback,
            pageID: this.pageID,
        };
        msg.data = { "result": "StopPlay" };
        let message = (0, IAPIMessageHandle_1.PackCallBacKMessage)(msg, msg.data);
        WebSocketServer_1.WebSocketServer.GetInstance().OnSendWebMessage(message);
    }
    CalculateSplinePointsDistance() {
        this.SplineDistance.length = 0;
        for (let i = 0; i < this.Spline.GetNumberOfSplinePoints(); i++) {
            let CurDis = this.Spline.GetDistanceAlongSplineAtSplinePoint(i);
            this.SplineDistance.push(CurDis);
        }
    }
    DistanceOfSplinePoints(Num) {
        if (Num < this.SplineDistance.length) {
            if (this.Distance <= this.SplineDistance[Num]) {
                return Num;
            }
            else {
                let temp = this.DistanceOfSplinePoints(Num + 1);
                return temp;
            }
        }
        else {
            return Num - 1;
        }
    }
    HiddenCameraMeshActor(IsHidden) {
        if (this.CameraActor) {
            for (let i = 0; i < this.CameraActor.Num(); i++) {
                this.CameraActor.Get(i).SetActorHiddenInGame(IsHidden);
            }
        }
        else {
            return "No valid point currently exists";
        }
    }
    HiddenSplineMesh(IsHidden) {
        if (this.SplineMesh) {
            for (let i = 0; i < this.SplineMesh.Num(); i++) {
                this.SplineMesh.Get(i).SetHiddenInGame(IsHidden, false);
            }
        }
        else {
            if (!IsHidden) {
                this.CreatSplineMesh();
            }
        }
    }
    DeleteSlpineCamearActor(index) {
        if (index + 1 === this.CameraActor.Num()) {
            this.CameraActor.RemoveAt(index);
        }
        else if (index < this.CameraActor.Num()) {
            for (let i = index + 1; i < this.CameraActor.Num(); i++) {
                this.CameraActor.Get(i).SetIndex(i - 1);
                this.CameraActor.Get(i).SetPointSettingUI();
            }
            this.CameraActor.RemoveAt(index);
        }
        this.UpdateSpline(true);
        if (this.data.isShowSplineMesh) {
            this.CreatSplineMesh();
        }
        this.CalculateSplinePointsDistance();
    }
    GetSceneViewingInfos() {
        let jsonData = {
            id: this.data.id,
            GISType: this.data.GISType,
            pointsInfoList: this.data.pointsInfoList,
            speed: this.data.speed,
            isUsedPointsInfo: this.data.isUsedPointsInfo,
            isUsedLensRotation: this.data.isUsedLensRotation,
            defaultPointsType: this.data.defaultPointsType,
            isLoopPlay: this.data.isLoopPlay,
            isEndToEnd: this.data.isEndToEnd,
            isShowPointCamera: this.data.isShowPointCamera,
            isShowSplineMesh: this.data.isShowSplineMesh,
            isPlaying: this.data.isPlaying
        };
        jsonData.pointsInfoList.length = 0;
        for (let i = 0; i < this.CameraActor.Num(); i++) {
            let CurPointInfo = {
                "coordinates": "",
                "lensRotation": "",
                "point_type": 0,
                "arriveTangent": "",
                "leaveTangent": ""
            };
            let GeographicPos = (0, puerts_1.$ref)(new UE.GeographicCoordinates());
            this.CoordinateConverterMgr.EngineToGeographic(this.data.GISType, this.CameraActor.Get(i).CameraMesh.K2_GetComponentToWorld().GetLocation(), GeographicPos);
            let Cood = {
                X: (0, puerts_1.$unref)(GeographicPos).Longitude,
                Y: (0, puerts_1.$unref)(GeographicPos).Latitude,
                Z: (0, puerts_1.$unref)(GeographicPos).Altitude
            };
            CurPointInfo.coordinates = Cood.X + "," + Cood.Y + "," + Cood.Z;
            let CurRotation = this.CameraActor.Get(i).CameraMesh.K2_GetComponentToWorld().Rotator();
            UE.KismetMathLibrary.NearlyEqual_FloatFloat(CurRotation.Pitch, 0, 0.0000001);
            let CurRotation_X = CurRotation.Pitch;
            let CurRotation_Y = CurRotation.Yaw;
            let CurRotation_Z = CurRotation.Roll;
            if (UE.KismetMathLibrary.NearlyEqual_FloatFloat(CurRotation.Pitch, 0, 0.0000001)) {
                CurRotation_X = 0;
            }
            if (UE.KismetMathLibrary.NearlyEqual_FloatFloat(CurRotation.Yaw, 0, 0.0000001)) {
                CurRotation_Y = 0;
            }
            if (UE.KismetMathLibrary.NearlyEqual_FloatFloat(CurRotation.Roll, 0, 0.0000001)) {
                CurRotation_Z = 0;
            }
            CurPointInfo.lensRotation = CurRotation_X + "," + CurRotation_Y + "," + CurRotation_Z;
            CurPointInfo.point_type = this.CameraActor.Get(i).GetPointType();
            CurPointInfo.arriveTangent = this.CameraActor.Get(i).GetArriveTangent().X + "," + this.CameraActor.Get(i).GetArriveTangent().Y + "," + this.CameraActor.Get(i).GetArriveTangent().Z;
            CurPointInfo.leaveTangent = this.CameraActor.Get(i).GetLeaveTangent().X + "," + this.CameraActor.Get(i).GetLeaveTangent().Y + "," + this.CameraActor.Get(i).GetLeaveTangent().Z;
            jsonData.pointsInfoList.push(CurPointInfo);
        }
        return jsonData;
    }
    UpdatePonitInfoOfIndex(index) {
        this.UpdateSpline(true);
        if (index === 0) {
            let location_1_rev = (0, puerts_1.$ref)(new UE.Vector);
            let tangent_1_rev = (0, puerts_1.$ref)(new UE.Vector);
            this.Spline.GetLocationAndTangentAtSplinePoint(index, location_1_rev, tangent_1_rev, UE.ESplineCoordinateSpace.World);
            let location_2_rev = (0, puerts_1.$ref)(new UE.Vector);
            let tangent_2_rev = (0, puerts_1.$ref)(new UE.Vector);
            this.Spline.GetLocationAndTangentAtSplinePoint(index + 1, location_2_rev, tangent_2_rev, UE.ESplineCoordinateSpace.World);
            let tangent_1 = (0, puerts_1.$unref)(tangent_1_rev);
            let tangent_2 = (0, puerts_1.$unref)(tangent_2_rev);
            if (this.Spline.GetSplinePointType(index) === UE.ESplinePointType.Linear) {
                tangent_1 = new UE.Vector(0, 0, 0);
                tangent_2 = new UE.Vector(0, 0, 0);
            }
            this.SplineMesh.Get(index).SetStartAndEnd((0, puerts_1.$unref)(location_1_rev), tangent_1, (0, puerts_1.$unref)(location_2_rev), tangent_2, true);
        }
        else if (index === this.Spline.GetNumberOfSplinePoints() - 1) {
            let location_1_rev = (0, puerts_1.$ref)(new UE.Vector);
            let tangent_1_rev = (0, puerts_1.$ref)(new UE.Vector);
            this.Spline.GetLocationAndTangentAtSplinePoint(index - 1, location_1_rev, tangent_1_rev, UE.ESplineCoordinateSpace.World);
            let location_2_rev = (0, puerts_1.$ref)(new UE.Vector);
            let tangent_2_rev = (0, puerts_1.$ref)(new UE.Vector);
            this.Spline.GetLocationAndTangentAtSplinePoint(index, location_2_rev, tangent_2_rev, UE.ESplineCoordinateSpace.World);
            let tangent_1 = (0, puerts_1.$unref)(tangent_1_rev);
            let tangent_2 = (0, puerts_1.$unref)(tangent_2_rev);
            if (this.Spline.GetSplinePointType(index - 1) === UE.ESplinePointType.Linear) {
                tangent_1 = new UE.Vector(0, 0, 0);
                tangent_2 = new UE.Vector(0, 0, 0);
            }
            this.SplineMesh.Get(index - 1).SetStartAndEnd((0, puerts_1.$unref)(location_1_rev), tangent_1, (0, puerts_1.$unref)(location_2_rev), tangent_2, true);
        }
        else {
            let location_1_rev = (0, puerts_1.$ref)(new UE.Vector);
            let tangent_1_rev = (0, puerts_1.$ref)(new UE.Vector);
            this.Spline.GetLocationAndTangentAtSplinePoint(index - 1, location_1_rev, tangent_1_rev, UE.ESplineCoordinateSpace.World);
            let location_2_rev = (0, puerts_1.$ref)(new UE.Vector);
            let tangent_2_rev = (0, puerts_1.$ref)(new UE.Vector);
            this.Spline.GetLocationAndTangentAtSplinePoint(index, location_2_rev, tangent_2_rev, UE.ESplineCoordinateSpace.World);
            let tangent_1 = (0, puerts_1.$unref)(tangent_1_rev);
            let tangent_2 = (0, puerts_1.$unref)(tangent_2_rev);
            if (this.Spline.GetSplinePointType(index - 1) === UE.ESplinePointType.Linear) {
                tangent_1 = new UE.Vector(0, 0, 0);
                tangent_2 = new UE.Vector(0, 0, 0);
            }
            this.SplineMesh.Get(index - 1).SetStartAndEnd((0, puerts_1.$unref)(location_1_rev), tangent_1, (0, puerts_1.$unref)(location_2_rev), tangent_2, true);
            let location_3_rev = (0, puerts_1.$ref)(new UE.Vector);
            let tangent_3_rev = (0, puerts_1.$ref)(new UE.Vector);
            this.Spline.GetLocationAndTangentAtSplinePoint(index, location_3_rev, tangent_3_rev, UE.ESplineCoordinateSpace.World);
            let location_4_rev = (0, puerts_1.$ref)(new UE.Vector);
            let tangent_4_rev = (0, puerts_1.$ref)(new UE.Vector);
            this.Spline.GetLocationAndTangentAtSplinePoint(index + 1, location_4_rev, tangent_4_rev, UE.ESplineCoordinateSpace.World);
            let tangent_3 = (0, puerts_1.$unref)(tangent_3_rev);
            let tangent_4 = (0, puerts_1.$unref)(tangent_4_rev);
            if (this.Spline.GetSplinePointType(index) === UE.ESplinePointType.Linear) {
                tangent_3 = new UE.Vector(0, 0, 0);
                tangent_4 = new UE.Vector(0, 0, 0);
            }
            this.SplineMesh.Get(index).SetStartAndEnd((0, puerts_1.$unref)(location_3_rev), tangent_3, (0, puerts_1.$unref)(location_4_rev), tangent_4, true);
        }
        this.CalculateSplinePointsDistance();
    }
}
exports.SceneViewingView = SceneViewingView;
//# sourceMappingURL=SceneViewingView.js.map