///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/9/21 22:05
///

import { $ref, $unref } from 'puerts'
import * as UE from 'ue'
import { WebSocketServer } from '../../../System/API/Handle/WebSocketServer'
import { PackBroadcastMessage } from '../../../System/API/IHandle/IAPIMessageHandle'
import { BaseView } from "../../../System/API/View/BaseView"
import { CoodinateConverterViewModel } from '../ViewModel/CoodinateConverterViewModel'
import { EventDispatcher } from '../../../System/Core/EventDispatcher'
import { GetViewModel } from '../../../System/API/ApiViewModelSystem'

export class PointView extends BaseView {

    //@C++
    RootScene: UE.SceneComponent
    Widget: UE.WidgetComponent
    Label: UE.WidgetComponent
    StaticMesh: UE.StaticMeshComponent
    CoordinateConverterMgr: UE.CoordinateConverterMgr
    id: string

    //@blueprint
    WBP_PointWidget: UE.OpenZIAPI.API.Plot.General.Point.WBP_PointWidget.WBP_PointWidget_C
    WBP_PointLabel: UE.OpenZIAPI.API.Plot.General.Point.WBP_PointLabel.WBP_PointLabel_C

    //@ts
    data: any

    Constructor() {
        this.PrimaryActorTick.bCanEverTick = true;
        this.RootScene = this.CreateDefaultSubobjectGeneric<UE.SceneComponent>("Scene", UE.SceneComponent.StaticClass())
        this.Widget = this.CreateDefaultSubobjectGeneric<UE.WidgetComponent>("Widget", UE.WidgetComponent.StaticClass())
        this.Label = this.CreateDefaultSubobjectGeneric<UE.WidgetComponent>("Label", UE.WidgetComponent.StaticClass())
        this.StaticMesh = this.CreateDefaultSubobjectGeneric<UE.StaticMeshComponent>("StaticMesh", UE.StaticMeshComponent.StaticClass())
        this.RootComponent = this.RootScene
        this.Widget.SetupAttachment(this.RootComponent, "Widget")
        this.Label.SetupAttachment(this.RootComponent, "Label")
        this.StaticMesh.SetupAttachment(this.RootComponent, "StaticMesh")

        this.StaticMesh.StaticMesh = UE.StaticMesh.Load("/Engine/BasicShapes/Cone.Cone");
        this.StaticMesh.SetHiddenInGame(true)
        //Init-widget
        this.InitWidget(this.Widget, "/OpenZIAPI/API/Plot/General/Point/WBP_PointWidget.WBP_PointWidget_C")
        //Init-label
        this.InitWidget(this.Label, "/OpenZIAPI/API/Plot/General/Point/WBP_PointLabel.WBP_PointLabel_C")
    }

    ReceiveBeginPlay(): void {
        //@blueprint
        type wbp_pointWidget = UE.OpenZIAPI.API.Plot.General.Point.WBP_PointWidget.WBP_PointWidget_C
        type wbp_PointLabel = UE.OpenZIAPI.API.Plot.General.Point.WBP_PointLabel.WBP_PointLabel_C
        this.WBP_PointWidget = this.Widget.GetWidget() as wbp_pointWidget
        this.WBP_PointLabel = this.Label.GetWidget() as wbp_PointLabel

        this.WBP_PointWidget.PointBtn.OnClicked.Add(() => {
            this.OnMouseClicked()
        })
        this.WBP_PointLabel.LabelBtn.OnClicked.Add(() => {
            this.OnMouseClicked()
        })
        this.CoordinateConverterMgr = UE.CoordinateConverterMgr.GetCoodinateConverterMgr()
    }

    ReceiveTick(DeltaSeconds: number): void {
        this.UpdateShow<UE.Actor>(this)
        this.UpdateShow<UE.WidgetComponent>(this.Label)
    }

    OnMouseHovered() {

        console.log("OnMouseHovered")
    }

    OnUnMousehovered() {
        console.log("OnUnMousehovered")
    }

    OnMouseClicked(): void {
        console.log("OnMouseClicked")
        let InputData = {location:this.K2_GetActorLocation(),distance:this.data.focusDistance}
        EventDispatcher.GetInstance().Fire("OnPointBeClicked",InputData)
        UE.AxesToolSubsystem.Get().SetSelectObjectsFormLogic(this,false)

        let Msg = PackBroadcastMessage({ classDef: "POI", funcDef: "OnMouseClicked" }, { id: this.id })
        WebSocketServer.GetInstance().OnSendWebMessage(Msg)
    }

    Focus(msg) {
        let data = msg.data
        let InputData = { location: this.K2_GetActorLocation(), distance: data.focusDistance }
        EventDispatcher.GetInstance().Fire("OnPointBeClicked", InputData)
    }

    private UpdateImage() {
        //@blueprint
        let Wbp_PointWidget = this.Widget.GetWidget() as UE.OpenZIAPI.API.Plot.General.Point.WBP_PointWidget.WBP_PointWidget_C
        this.Widget.SetPivot(new UE.Vector2D(0.5, 2))
    }
    private InitWidget(widget: UE.WidgetComponent, bpPath: string) {
        widget.WidgetClass = UE.Class.Load(bpPath);
        widget.SetDrawAtDesiredSize(true)
        widget.Pivot = new UE.Vector2D(0.5, 1)
        widget.Space = UE.EWidgetSpace.Screen
    }

    RefreshView(jsonData): string {
        this.id = jsonData.data.id
        this.data = jsonData.data
        let GeographicPos = new UE.GeographicCoordinates(this.data.coordinates.X, this.data.coordinates.Y, this.data.coordinates.Z)
        let EngineLocation = $ref(new UE.Vector(0, 0, 0))
        this.CoordinateConverterMgr.GeographicToEngine(this.data.GISType, GeographicPos, EngineLocation)
        if ($unref(EngineLocation) == null)
            return "coordinates is error"
        if (!this.data.bAutoHeight) {
            this.K2_SetActorLocation(new UE.Vector($unref(EngineLocation).X, $unref(EngineLocation).Y, $unref(EngineLocation).Z), false, null, false)
        } else {

            let startPos = new UE.Vector($unref(EngineLocation).X, $unref(EngineLocation).Y, 1000000)
            let endPos = new UE.Vector($unref(EngineLocation).X, $unref(EngineLocation).Y, -1000000)
            let hit = $ref(new UE.HitResult())
            let isFinish: boolean
            isFinish = UE.KismetSystemLibrary.LineTraceSingle(this, startPos, endPos, UE.ETraceTypeQuery.TraceTypeQuery1, true, null, UE.EDrawDebugTrace.None, hit, true, new UE.LinearColor(1, 0, 0, 1), new UE.LinearColor(0, 1, 0, 1))
            if (isFinish) {
                this.K2_SetActorLocation($unref(hit).ImpactPoint, false, null, false)
            } else {
                this.K2_SetActorLocation(new UE.Vector($unref(EngineLocation).X, $unref(EngineLocation).Y, this.data.coordinates.Z), false, null, false)
            }
        }

        this.Widget.SetPivot(new UE.Vector2D(this.data.imagePivot.X, this.data.imagePivot.Y))
        this.SetImageSize(new UE.Vector2D(this.data.imageSize.X, this.data.imageSize.Y))
        this.WBP_PointWidget.WidgetRoot.SetRenderTranslation(new UE.Vector2D(this.data.imageOffset.X, this.data.imageOffset.Y))
        if (this.data.imageAddress != null && this.data.imageAddress != "") {
            if (this.data.imageType == 0) {
                let Texture = UE.Texture2D.Load(this.data.imageAddress)
                if (Texture) {
                    this.WBP_PointWidget.PointImage.SetBrushFromTexture(Texture)
                }
            } else if (this.data.imageType == 1) {
                let str = ""
                if(this.data.imageAddress.charAt(0) != "/"){
                    str = "/"
                }
                let FilePath = UE.BlueprintPathsLibrary.ProjectDir()+"Script/Web/APITextures"+str+this.data.imageAddress
                if (UE.BlueprintPathsLibrary.FileExists(FilePath)) {
                    let Texture = $ref(new UE.Texture2D())
                    let x = $ref(Number())
                    let y = $ref(Number())
                    let bSuccess = UE.PictureToolsLibrary.LoadImageToTexture2D(FilePath, Texture, x, y)
                    if (bSuccess) {
                        this.WBP_PointWidget.PointImage.SetBrushFromTexture($unref(Texture))
                    }
                }
            } else if (this.data.imageType == 2) {
                this.WBP_PointWidget.PointImage.UpdateImageByURL(this.data.imageAddress, this.data.imageForceRefresh)
            }
        } else {
            let Texture = UE.Texture2D.Load('/OpenZIAPI/Asset/Texture/T_Point.T_Point')
            if (Texture) {
                this.WBP_PointWidget.PointImage.SetBrushFromTexture(Texture)
            }
        }

        if (this.data.labelImageAddress != null && this.data.labelImageAddress != "") {
            if (this.data.labelImageType == 0) {
                let Texture = UE.Texture2D.Load(this.data.labelImageAddress)
                if (Texture) {
                    this.WBP_PointLabel.LabelImage.SetBrushFromTexture(Texture)
                    let LineColor = new UE.LinearColor(1, 1, 1, 1)
                    this.WBP_PointLabel.LabelImage.SetColorAndOpacity(LineColor)
                    this.SetLabelImageSize(new UE.Vector2D(this.data.labelImageSize.X, this.data.labelImageSize.Y))
                }
            } else if (this.data.labelImageType == 1) {
                let str = ""
                if(this.data.labelImageAddress.charAt(0) != "/"){
                    str = "/"
                }
                let FilePath = UE.BlueprintPathsLibrary.ProjectDir()+"Script/APITextrues"+str+this.data.labelImageAddress
                if (UE.BlueprintPathsLibrary.FileExists(FilePath)) {
                    let Texture = $ref(new UE.Texture2D())
                    let x = $ref(Number())
                    let y = $ref(Number())
                    let bSuccess = UE.PictureToolsLibrary.LoadImageToTexture2D(FilePath, Texture, x, y)
                    if (bSuccess) {
                        this.WBP_PointLabel.LabelImage.SetBrushFromTexture($unref(Texture))
                        let LineColor = new UE.LinearColor(1, 1, 1, 1)
                        this.WBP_PointLabel.LabelImage.SetColorAndOpacity(LineColor)
                        this.SetLabelImageSize(new UE.Vector2D(this.data.labelImageSize.X, this.data.labelImageSize.Y))
                    }
                }
            } else if (this.data.labelImageType == 2) {
                this.WBP_PointLabel.LabelImage.UpdateImageByURL(this.data.imageAddress, this.data.imageForceRefresh)
                let LineColor = new UE.LinearColor(1, 1, 1, 1)
                this.WBP_PointLabel.LabelImage.SetColorAndOpacity(LineColor)
                this.SetLabelImageSize(new UE.Vector2D(this.data.labelImageSize.X, this.data.labelImageSize.Y))
            }
        } else {
            let LineColor = new UE.LinearColor(0, 0, 0, 0)
            this.WBP_PointLabel.LabelImage.SetColorAndOpacity(LineColor)
            this.SetLabelImageSize(new UE.Vector2D(0, 0))
        }
        if (this.data.labe == "") {
            this.Label.SetHiddenInGame(true)
        }
        else {
            this.Label.SetHiddenInGame(false)
            this.Label.SetPivot(new UE.Vector2D(this.data.labelPivot.X, this.data.labelPivot.Y))
            this.WBP_PointLabel.LabelText.SetText(this.data.label)
            this.WBP_PointLabel.SetFontFamily(this.data.labelFontName)
            this.WBP_PointLabel.SetFontSize(this.data.labelFontSize)
            let BackColor = new UE.LinearColor(this.data.labelBackgroundColor.X, this.data.labelBackgroundColor.Y, this.data.labelBackgroundColor.Z, this.data.labelBackgroundColor.W)
            this.WBP_PointLabel.LabelBorder.SetBrushColor(BackColor)
            let LineColor = new UE.LinearColor(this.data.labelFontColor.X, this.data.labelFontColor.Y, this.data.labelFontColor.Z, this.data.labelFontColor.W)
            let FontColor = new UE.SlateColor(LineColor, UE.ESlateColorStylingMode.UseColor_Specified)
            this.WBP_PointLabel.LabelText.SetColorAndOpacity(FontColor)
            this.WBP_PointLabel.LabelBorder.SetRenderTranslation(new UE.Vector2D(this.data.labelOffset.X, this.data.labelOffset.Y))
            this.Label.SetHiddenInGame(!this.data.labelAlwaysVisible)
        }
        this.SetActorHiddenInGame(!this.data.poiAlwaysVisible)
        return "success"
    }

    SetImageSize(value: UE.Vector2D) {
        let SlateBrush = this.WBP_PointWidget.PointImage.Brush
        SlateBrush.ImageSize = value
        this.WBP_PointWidget.PointImage.SetBrush(SlateBrush)
    }
    SetLabelImageSize(value: UE.Vector2D) {
        let SlateBrush = this.WBP_PointLabel.LabelImage.Brush
        SlateBrush.ImageSize = value
        this.WBP_PointLabel.LabelImage.SetBrush(SlateBrush)
    }

    UpdateShow<T>(obj: T) {
        if (this.data.poiAlwaysVisible == false) {
            let cameraPos = UE.GameplayStatics.GetPlayerCameraManager(this, 0).K2_GetActorLocation()
            let dis = UE.KismetMathLibrary.Vector_Distance(this.K2_GetActorLocation(), cameraPos) /GetViewModel(CoodinateConverterViewModel).GetScale()
            if (dis > this.data.poiVisibleRange.X && dis < this.data.poiVisibleRange.Y) {
                if (obj instanceof UE.Actor) {
                    let actor = obj as UE.Actor
                    actor.SetActorHiddenInGame(false)
                    return true
                }
                else {
                    let com = obj as UE.SceneComponent
                    com.SetHiddenInGame(false)
                    return true
                }
            }
            else {
                if (obj instanceof UE.Actor) {
                    let actor = obj as UE.Actor
                    actor.SetActorHiddenInGame(true)
                    return false
                }
                else {
                    let com = obj as UE.WidgetComponent
                    com.SetHiddenInGame(true)
                    return false
                }
            }
        }
        return true
    }
}



