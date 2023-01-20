///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime. 2022/10/17 11.05
///
import { $ref, $unref } from "puerts"
import * as UE from "ue"
import { Cesium3DTilesetView } from "./Cesium3DTilesetView"

export class FlattenView extends UE.FlattenActor {

    DrawTool: UE.DrawPolygonWireFrame
    Constructor() { }
    ReceiveBeginPlay(): void {

    }
    ReceiveEndPlay(EndPlayReason: UE.EEndPlayReason): void {
        let OutActorList = $ref(UE.NewArray(UE.Actor))
        UE.GameplayStatics.GetAllActorsOfClass(this, UE.Cesium3DTileset.StaticClass(), OutActorList)
        if ($unref(OutActorList).Num() > 0) {
            for(let i = 0;i<$unref(OutActorList).Num();i++){
                let Tileset = $unref(OutActorList).Get(i) as Cesium3DTilesetView
                if(Tileset){
                    let Tags = Tileset.Tags
                    let bCesiumTerrain = false
                    for(let i = 0;i<Tags.Num();i++){
                        if(Tags.Get(i) == "CesiumTerrain"){
                            bCesiumTerrain = true
                        }
                    }
                    if(bCesiumTerrain == false){
                        Tileset.PolygonWire.Polygons.RemoveAt(Tileset.PolygonWire.Polygons.FindIndex(this.DrawTool))
                        Tileset.PolygonWire.Refresh()
                    }
                }
            }

        }
        this.DrawTool.K2_DestroyActor()
        this.DrawTool = null
    }
    ReceiveTick(DeltaSeconds: number): void {
        this.ListenKeyAction()
    }

    RefreshView(jsonData) {
        this.DrawTool = this.GetWorld().SpawnActor(UE.DrawPolygonWireFrame.StaticClass(), undefined, UE.ESpawnActorCollisionHandlingMethod.Undefined, undefined, undefined) as UE.DrawPolygonWireFrame
        this.DrawTool.StartDrawRange()
        return "success"
    }

    private MakeKey(keyName): any {
        let Key = new UE.Key()
        Key.KeyName = keyName
        return Key
    }


    ListenKeyAction() {
        let CurPlayerController = UE.GameplayStatics.GetPlayerController(this, 0)
        let LeftMouse = this.MakeKey("LeftMouseButton")
        let RightMouse = this.MakeKey("RightMouseButton")
        let Touch1 = this.MakeKey("Touch1")
        let IsMouse1 = CurPlayerController.WasInputKeyJustPressed(LeftMouse)
        let IsTouch1 = CurPlayerController.WasInputKeyJustPressed(Touch1)
        let IsRightMouse = CurPlayerController.WasInputKeyJustPressed(RightMouse)
        if (IsMouse1 || IsTouch1 ) {
            this.DrawTool.DrawPolygonWire()
        }
        if (IsRightMouse) {
            if (this.DrawTool.GetBAllowDrawRange()) {
                this.DrawTool.EndDrawRange()
                this.StartFlattnMesh()
            }
        }
    }

    StartFlattnMesh() {
        let vectors = this.DrawTool.GetDrawPoints()
        this.FindActorInRange(vectors)
        this.SpawnProceduralMesh()
        this.FlattenMesh(vectors)
        let OutActorList = $ref(UE.NewArray(UE.Actor))
        UE.GameplayStatics.GetAllActorsOfClass(this, UE.Cesium3DTileset.StaticClass(), OutActorList)
        if ($unref(OutActorList).Num() > 0) {
            for(let i = 0;i<$unref(OutActorList).Num();i++){
                let Tileset = $unref(OutActorList).Get(i) as Cesium3DTilesetView
                if(Tileset){
                    let Tags = Tileset.Tags
                    let bCesiumTerrain = false
                    for(let i = 0;i<Tags.Num();i++){
                        if(Tags.Get(i) == "CesiumTerrain"){
                            bCesiumTerrain = true
                        }
                    }
                    if(bCesiumTerrain == false){
                        Tileset.PolygonWire.Polygons.Add(this.DrawTool)
                        Tileset.PolygonWire.Refresh()
                    }
                }
            }
        }
    }
}