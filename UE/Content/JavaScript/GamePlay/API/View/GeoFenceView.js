"use strict";
///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/9/26 14:43
///
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoFenceView = void 0;
const UE = require("ue");
const PlaneBase_1 = require("./PlaneBase");
const puerts_1 = require("puerts");
const ue_1 = require("ue");
class GeoFenceView extends PlaneBase_1.PlaneBase {
    //@C++
    DyMIFence;
    DyMIBottom;
    CoordinateConverterMgr;
    bRenderBottom;
    //@ts
    data;
    Constructor() {
        super.Constructor();
        this.DyMIFence = undefined;
        this.DyMIBottom = undefined;
        this.bRenderBottom = true;
    }
    ReceiveBeginPlay() {
        super.ReceiveBeginPlay();
        this.Init();
    }
    ReceiveTick(DeltaSeconds) {
    }
    ClearAllData() {
        this.Spline.ClearSplinePoints(false);
        this.ProceduralMesh.ClearAllMeshSections();
        this.BottomVertices.Empty();
        this.TopVertices.Empty();
        this.BodyVertices.Empty();
    }
    Init() {
        this.CoordinateConverterMgr = UE.CoordinateConverterMgr.GetCoodinateConverterMgr();
    }
    UpdateHeightandColor(FencewallColor, FencebottomColor, FencewallLineNumber) {
        this.DyMIFence.SetVectorParameterValue("Color", FencewallColor);
        this.DyMIFence.SetScalarParameterValue("NumberLine", FencewallLineNumber);
        this.DyMIBottom.SetVectorParameterValue("Color", FencebottomColor);
    }
    Rebuild() {
        this.ProceduralMesh.ClearAllMeshSections();
        let num = this.Spline.GetNumberOfSplinePoints();
        for (let index = 0; index < num; index++) {
            this.Spline.SetSplinePointType(index, UE.ESplinePointType.Linear, false);
            let vector = this.Spline.GetLocationAtSplinePoint(index, UE.ESplineCoordinateSpace.Local);
            this.BottomVertices.Add(vector);
            let vector2 = UE.KismetMathLibrary.Add_VectorVector(vector, new UE.Vector(0, 0, this.Height));
            this.TopVertices.Add(vector2);
        }
        this.Spline.UpdateSpline();
        if (this.bRenderBottom) {
            let OutRectCenter = (0, puerts_1.$ref)(new UE.Vector(0, 0, 0));
            let OutRectRotation = (0, puerts_1.$ref)(new UE.Rotator(0, 0, 0));
            let OutSideLengthX = (0, puerts_1.$ref)(11);
            let OutSideLengthY = (0, puerts_1.$ref)(11);
            UE.KismetMathLibrary.MinAreaRectangle(this, this.BottomVertices, new UE.Vector(0, 0, 1), OutRectCenter, OutRectRotation, OutSideLengthX, OutSideLengthY);
            let max = UE.KismetMathLibrary.FMax((0, puerts_1.$unref)(OutSideLengthX), (0, puerts_1.$unref)(OutSideLengthY));
            let R = this.DrawPlane(0, this.BottomVertices, this.DyMIBottom, max, 0, new UE.Vector2D(0, 0), true);
        }
        for (let key = 0; key < this.BottomVertices.Num(); key++) {
            this.BodyVertices.Add(this.BottomVertices.Get(key));
            let CurValue1 = UE.KismetMathLibrary.SelectInt(0, key + 1, UE.KismetMathLibrary.EqualEqual_IntInt(key + 1, this.BottomVertices.Num()));
            this.BodyVertices.Add(this.BottomVertices.Get(CurValue1));
            let CurValue2 = UE.KismetMathLibrary.SelectInt(0, key + 1, UE.KismetMathLibrary.EqualEqual_IntInt(key + 1, this.BottomVertices.Num()));
            this.BodyVertices.Add(this.TopVertices.Get(CurValue1));
            this.BodyVertices.Add(this.TopVertices.Get(key));
            let R = this.DrawPlane(key + 1, this.BodyVertices, this.DyMIFence, this.Height, 0, new UE.Vector2D(0, 0), true);
            this.BodyVertices.Empty();
        }
    }
    DrawPlane(SectionIndex, Vertices, Material, UVSize, UVRot, UVOffset, bReverse) {
        return super.DrawPlane(SectionIndex, Vertices, Material, UVSize, UVRot, UVOffset, bReverse);
    }
    RefreshView(jsonData) {
        this.ClearAllData();
        this.data = jsonData.data;
        if (this.data.coordinatesList.length == 0) {
            return "success";
        }
        let CurVector = new UE.Vector(0, 0, 0);
        let AllPoints = (0, ue_1.NewArray)(UE.Vector);
        for (let i = 0; i < this.data.coordinatesList.length; i++) {
            if (this.data.coordinatesList[i] === "") {
                return "coordinatesList: index " + i + "is empty !";
            }
            let GeographicPos = new UE.GeographicCoordinates(this.data.coordinatesList[i].X, this.data.coordinatesList[i].Y, this.data.coordinatesList[i].Z);
            let CurEngineLocation = (0, puerts_1.$ref)(new UE.Vector(0, 0, 0));
            this.CoordinateConverterMgr.GeographicToEngine(this.data.GISType, GeographicPos, CurEngineLocation);
            let EngineLocation = (0, puerts_1.$unref)(CurEngineLocation);
            CurVector = new UE.Vector(CurVector.X + EngineLocation.X, CurVector.Y + EngineLocation.Y, CurVector.Z + EngineLocation.Z);
            AllPoints.Add(EngineLocation);
        }
        CurVector = new UE.Vector(CurVector.X / this.data.coordinatesList.length, CurVector.Y / this.data.coordinatesList.length, CurVector.Z / this.data.coordinatesList.length);
        let originCoordinate = (0, puerts_1.$ref)(new UE.GeographicCoordinates(0, 0, 0));
        this.CoordinateConverterMgr.EngineToGeographic(this.data.GISType, CurVector, originCoordinate);
        this.CoordinatesToRelative(this.data.coordinatesList, { X: (0, puerts_1.$unref)(originCoordinate).Longitude, Y: (0, puerts_1.$unref)(originCoordinate).Latitude, Z: (0, puerts_1.$unref)(originCoordinate).Altitude });
        let FHitResult = (0, puerts_1.$ref)(new UE.HitResult);
        this.K2_SetActorLocation(CurVector, false, FHitResult, false);
        for (let i = 0; i < AllPoints.Num(); i++) {
            this.Spline.AddSplinePointAtIndex(AllPoints.Get(i), i, UE.ESplineCoordinateSpace.World, true);
            this.Spline.SetSplinePointType(i, UE.ESplinePointType.Linear, false);
        }
        this.Spline.UpdateSpline();
        this.Height = this.data.height;
        this.bRenderBottom = this.data.bottomVisible;
        if (this.data.FencewallUseCustomMaterial) {
            let Material_1 = UE.MaterialInstance.Load(this.data.FencewallMaterial);
            this.DyMIFence = UE.KismetMaterialLibrary.CreateDynamicMaterialInstance(this, Material_1, "None", UE.EMIDCreationFlags.None);
        }
        else {
            let Material_1 = UE.MaterialInstance.Load("/OpenZIAPI/Asset/Material/M_LINE_Inst");
            this.DyMIFence = UE.KismetMaterialLibrary.CreateDynamicMaterialInstance(this, Material_1, "None", UE.EMIDCreationFlags.None);
            let color1 = new UE.LinearColor(this.data.FencewallColor.X, this.data.FencewallColor.Y, this.data.FencewallColor.Z, this.data.FencewallColor.W);
            this.DyMIFence.SetVectorParameterValue("Color", color1);
            this.DyMIFence.SetScalarParameterValue("NumberLine", this.data.FencewallLineNumber);
        }
        if (this.data.FencebottomUseCustomMaterial) {
            let Material_2 = UE.MaterialInstance.Load(this.data.FencebottomMaterial);
            this.DyMIBottom = UE.KismetMaterialLibrary.CreateDynamicMaterialInstance(this, Material_2, "None", UE.EMIDCreationFlags.None);
        }
        else {
            let Material_2 = UE.MaterialInstance.Load("/OpenZIAPI/Asset/Material/M_Master_material_Inst");
            this.DyMIBottom = UE.KismetMaterialLibrary.CreateDynamicMaterialInstance(this, Material_2, "None", UE.EMIDCreationFlags.None);
            let color2 = new UE.LinearColor(this.data.FencebottomColor.X, this.data.FencebottomColor.Y, this.data.FencebottomColor.Z, this.data.FencebottomColor.W);
            this.DyMIBottom.SetVectorParameterValue("Color", color2);
        }
        this.Rebuild();
        return "success";
    }
}
exports.GeoFenceView = GeoFenceView;
//# sourceMappingURL=GeoFenceView.js.map