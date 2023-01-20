///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/10/17 11:05
///

import { $ref, $unref, makeUClass } from "puerts"
import * as UE from "ue"
import { Cesium3DTilesetView } from "./Cesium3DTilesetView"
export class TrenchingView extends UE.TrenchingActor {

    bStart: boolean
    DrawTool: UE.DrawPolygonWireFrame
    DynamicMeshMgr: UE.DynamicMeshMgrActor
    id: string
    ButtomMaterial: UE.MaterialInterface
    SideMaterial: UE.MaterialInterface

    Constructor() { }

    ReceiveBeginPlay(): void {
        this.bStart = false
        this.DrawTool = null
        let OutActorList = $ref(UE.NewArray(UE.Actor))

        UE.GameplayStatics.GetAllActorsOfClass(this, UE.DynamicMeshMgrActor.StaticClass(), OutActorList)

        if ($unref(OutActorList).Num() > 0) {
            this.DynamicMeshMgr = $unref(OutActorList).Get(0) as UE.DynamicMeshMgrActor
        }
        else {
            this.DynamicMeshMgr = this.GetWorld().SpawnActor(UE.DynamicMeshMgrActor.StaticClass(), undefined, UE.ESpawnActorCollisionHandlingMethod.Undefined, undefined, undefined) as UE.DynamicMeshMgrActor
        }

    }

    ReceiveEndPlay(EndPlayReason: UE.EEndPlayReason): void {
        let OutActorList = $ref(UE.NewArray(UE.Actor))
        UE.GameplayStatics.GetAllActorsOfClass(this, UE.Cesium3DTileset.StaticClass(), OutActorList)
        if ($unref(OutActorList).Num() > 0) {
            for(let i = 0;i<$unref(OutActorList).Num();i++){
                let Tileset = $unref(OutActorList).Get(i) as Cesium3DTilesetView
                if(Tileset){
                    Tileset.PolygonWire.Polygons.RemoveAt(Tileset.PolygonWire.Polygons.FindIndex(this.DrawTool))
                    Tileset.PolygonWire.Refresh()
                }
            }
        }
        this.DynamicMeshMgr.WhenTrenchingActorDelete(this.ToolMesh)
        this.DrawTool.K2_DestroyActor()
        this.DrawTool = null
        this.DynamicMeshMgr.TrenchingActorIds.RemoveAt(this.DynamicMeshMgr.TrenchingActorIds.FindIndex(this.id))
        if (this.DynamicMeshMgr.TrenchingActorIds.Num() == 0) {
            this.DynamicMeshMgr.K2_DestroyActor()
        }
    }

    ReceiveTick(DeltaSeconds: number): void {
        this.ListenKeyAction()
    }


    RefreshView(jsonData) {
        this.DrawTool = this.GetWorld().SpawnActor(UE.DrawPolygonWireFrame.StaticClass(), undefined, UE.ESpawnActorCollisionHandlingMethod.Undefined, undefined, undefined) as UE.DrawPolygonWireFrame
        this.bStart = true
        this.id = jsonData.data.id
        this.PolygonHeight = jsonData.data.depth
        this.DrawTool.StartDrawRange()
        this.ButtomMaterial = UE.MaterialInterface.Load(jsonData.data.ButtomMaterial)
        this.SideMaterial = UE.MaterialInterface.Load(jsonData.data.SideMaterial)
        return "success"
    }

    private MakeKey(keyName): any {
        let Key = new UE.Key()
        Key.KeyName = keyName
        return Key
    }

    ListenKeyAction() {
        if(this.bStart == false)
            return 
        let CurPlayerController = UE.GameplayStatics.GetPlayerController(this, 0)
        let LeftMouse = this.MakeKey("LeftMouseButton")
        let RightMouse = this.MakeKey("RightMouseButton")
        let Touch1 = this.MakeKey("Touch1")
        let IsMouse1 = CurPlayerController.WasInputKeyJustPressed(LeftMouse)
        let IsTouch1 = CurPlayerController.WasInputKeyJustPressed(Touch1)
        let IsRightMouse = CurPlayerController.WasInputKeyJustPressed(RightMouse)
        if (IsMouse1  || IsTouch1 ) {
            this.DrawTool.DrawPolygonWire()
        }
        if (IsRightMouse ) {
            if (this.DrawTool.GetBAllowDrawRange()) {
                this.DrawTool.EndDrawRange()
                this.StartTrenching()
                this.bStart = false
            }
        }
    }
    StartTrenching() {
        let Vectors = this.PointsToLocal(this.DrawTool.GetDrawPoints())
        if( this.DynamicMeshMgr==null){
            let OutActorList = $ref(UE.NewArray(UE.Actor))

            UE.GameplayStatics.GetAllActorsOfClass(this, UE.DynamicMeshMgrActor.StaticClass(), OutActorList)
    
            if ($unref(OutActorList).Num() > 0) {
                this.DynamicMeshMgr = $unref(OutActorList).Get(0) as UE.DynamicMeshMgrActor
            }
        }
        let ProcessType = this.DynamicMeshMgr.MakeSureBeTrenchingSMC(this.DrawTool.GetHitActors())
        if (ProcessType == 0) {
            return
        }
        else if (ProcessType == 1) {
            let OutActorList = $ref(UE.NewArray(UE.Actor))
            UE.GameplayStatics.GetAllActorsOfClass(this, UE.Cesium3DTileset.StaticClass(), OutActorList)
            if ($unref(OutActorList).Num() > 0) {
                for(let i = 0;i<$unref(OutActorList).Num();i++){
                    let Tileset = $unref(OutActorList).Get(i) as Cesium3DTilesetView
                    if(Tileset){
                        Tileset.PolygonWire.Polygons.Add(this.DrawTool)
                        Tileset.PolygonWire.Refresh()
                    }
                }
            }
            this.DrawMeshForSection(Vectors, this.ButtomMaterial, this.SideMaterial)
        }
        else {
            let OutActorList = $ref(UE.NewArray(UE.Actor))
            UE.GameplayStatics.GetAllActorsOfClass(this, UE.Cesium3DTileset.StaticClass(), OutActorList)
            if ($unref(OutActorList).Num() > 0) {
                for(let i = 0;i<$unref(OutActorList).Num();i++){
                    let Tileset = $unref(OutActorList).Get(i) as Cesium3DTilesetView
                    if(Tileset){
                        Tileset.PolygonWire.Polygons.Add(this.DrawTool)
                        Tileset.PolygonWire.Refresh()
                    }
                }
            }
            this.DrawMeshForBoolean(Vectors)
            this.PMC_DMC()
            this.DynamicMeshMgr.TrenchingMeshBoolean(this.GetToolMesh())
            this.DynamicMeshMgr.TrenchingActorIds.Add(this.id)
            this.DrawMeshForSection(Vectors, this.ButtomMaterial, this.SideMaterial)
        }
    }
}