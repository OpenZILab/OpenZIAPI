///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by behiever.
/// DateTime: 2022/9/1 16:21
///

import { CoodinateConverterViewModel } from "../../GamePlay/API/ViewModel/CoodinateConverterViewModel"
import { AlarmAnchorViewModel } from "../../GamePlay/API/ViewModel/AlarmAnchorViewModel"
import { GeoFenceViewModel } from "../../GamePlay/API/ViewModel/GeoFenceViewModel"
import { TrafficCongestionMapViewModel } from "../../GamePlay/API/ViewModel/TrafficCongestionMapViewModel"
import { GeoOverlayViewModel } from "../../GamePlay/API/ViewModel/GeoOverlayViewModel"
import { HeatMapViewModel } from "../../GamePlay/API/ViewModel/HeatMapViewModel"
import { WindowViewModel } from "../../GamePlay/API/ViewModel/WindowViewModel"
import { ScreenCoordinatesViewModel } from "../../GamePlay/API/ViewModel/ScreenCoordinatesViewModel"
import { ObserverPawnViewModel } from "../../GamePlay/API/ViewModel/ObseverPawnViewModel"
import { DrawPointViewModel } from "../../GamePlay/API/ViewModel/DrawPointViewModel"
import { DrawLineViewModel } from "../../GamePlay/API/ViewModel/DrawLineViewModel"
import { DrawPlaneViewModel } from "../../GamePlay/API/ViewModel/DrawPlaneViewModel"
import { MeasureAreaViewModel } from "../../GamePlay/API/ViewModel/MeasureAreaViewModel"
import { MeasureDistanceViewModel } from "../../GamePlay/API/ViewModel/MeasureDistanceViewModel"
import { MeasureCoordinatesViewModel } from "../../GamePlay/API/ViewModel/MeasureCoordinatesViewModel"
import { CesiumTerrainViewModel } from "../../Package/COM_CENGZI_CESIUM/API/ViewModel/CesiumTerrainViewModel"
import { FlattenViewModel } from "../../Package/COM_CENGZI_CESIUM/API/ViewModel/FlattenViewModel"
import { CesiumSunViewModel } from "../../Package/COM_CENGZI_CESIUM/API/ViewModel/CesiumSunViewModel"
import { TrenchingViewModel } from "../../Package/COM_CENGZI_CESIUM/API/ViewModel/TrenchingViewModel"
import {
    CesiumRasterOverlayViewModel
} from "../../Package/COM_CENGZI_CESIUM/API/ViewModel/CesiumRasterOverlayViewModel"
import { Cesium3DTilesetViewModel } from "../../Package/COM_CENGZI_CESIUM/API/ViewModel/Cesium3DTilesetViewModel"
import { BaseViewModel } from "./ViewModel/BaseViewModel"
import { Sigleton } from "../Core/Sigleton"
import { PointViewModel } from "../../GamePlay/API/ViewModel/PointViewModel"
import { LevelViewModel } from "../../GamePlay/API/ViewModel/LevelViewModel"
import { DrawViewModel } from "../../GamePlay/API/ViewModel/DrawViewModel"
import { MeasureViewModel } from "../../GamePlay/API/ViewModel/MeasureViewModel"
import { ColumnarMapViewModel } from "../../GamePlay/API/ViewModel/ColumnarMapViewModel";
import { ViewshedAnalysisViewModel } from "../../GamePlay/API/ViewModel/ViewshedAnalysisViewModel";
import { SceneViewingViewModel } from "../../GamePlay/API/ViewModel/SceneViewingViewModel";
import { DynamicWeatherViewModel } from "../../GamePlay/API/ViewModel/DynamicWeatherViewModel";
import { OriginDestinationLineViewModel } from "../../GamePlay/API/ViewModel/OriginDestinationLineViewModel";
import { OpticalFlowLineViewModel } from "../../GamePlay/API/ViewModel/OpticalFlowLineViewModel";
import { LightEffectFlowLineViewModel } from "../../GamePlay/API/ViewModel/LightEffectFlowLineViewModel"

interface TType<T> extends Function {
    new(...args: any[]): T
}

export class APIViewModelSystem extends Sigleton {
    ViewModels: Array<BaseViewModel> = new Array<BaseViewModel>()

    static GetInstance(): APIViewModelSystem {
        return super.TakeInstance(APIViewModelSystem)
    }

    public OnInit() {
        this.RegisterLink(Cesium3DTilesetViewModel)
        this.RegisterLink(FlattenViewModel)
        this.RegisterLink(TrenchingViewModel)
        this.RegisterLink(CesiumRasterOverlayViewModel)
        this.RegisterLink(CesiumTerrainViewModel)

        //Game
        this.RegisterLink(CoodinateConverterViewModel)
        this.RegisterLink(AlarmAnchorViewModel)
        this.RegisterLink(GeoFenceViewModel)
        this.RegisterLink(TrafficCongestionMapViewModel)
        this.RegisterLink(ColumnarMapViewModel)
        this.RegisterLink(GeoOverlayViewModel)
        this.RegisterLink(HeatMapViewModel)
        this.RegisterLink(WindowViewModel)
        this.RegisterLink(ScreenCoordinatesViewModel)
        this.RegisterLink(ObserverPawnViewModel)
        this.RegisterLink(DrawPointViewModel)
        this.RegisterLink(DrawLineViewModel)
        this.RegisterLink(DrawPlaneViewModel)
        this.RegisterLink(DrawViewModel)
        this.RegisterLink(MeasureAreaViewModel)
        this.RegisterLink(MeasureDistanceViewModel)
        this.RegisterLink(MeasureCoordinatesViewModel)
        this.RegisterLink(MeasureViewModel)
        this.RegisterLink(PointViewModel)
        this.RegisterLink(LevelViewModel)
        this.RegisterLink(ViewshedAnalysisViewModel)
        this.RegisterLink(SceneViewingViewModel)
        this.RegisterLink(DynamicWeatherViewModel)
        this.RegisterLink(OriginDestinationLineViewModel)
        this.RegisterLink(OpticalFlowLineViewModel)
        this.RegisterLink(LightEffectFlowLineViewModel)
    }

    RegisterLink<T extends BaseViewModel>(Class: TType<T>) {
        this.ViewModels.push(new Class())
    }

    GetViewModel<T extends BaseViewModel>(Class: TType<T>): T {
        let FindViewModel: BaseViewModel = this.ViewModels.find((ViewModel: BaseViewModel) => {
            return ViewModel.constructor.name === Class.name
        })
        return FindViewModel as T
    }

    GetViewModelByType(_type) {
        let FindViewModel: BaseViewModel = this.ViewModels.find((ViewModel: BaseViewModel) => {
            return ViewModel.GetType() === _type
        })
        return FindViewModel
    }

    GetAllViewModel() {
        return this.ViewModels
    }
}

export function GetViewModelByType(type:string){
    return APIViewModelSystem.GetInstance().GetViewModelByType(type)
}

export function GetViewModel<T extends BaseViewModel>(TClass: TType<T>): T {
    return APIViewModelSystem.GetInstance().GetViewModel(TClass);
}