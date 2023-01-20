///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/10/08 11:20
///

import { makeUClass } from 'puerts'
import { BaseViewModel } from "../../../System/API/ViewModel/BaseViewModel"
import { MeasureModel } from "../Model/MeasureModel";
import { MeasureView } from "../View/MeasureView";

export class MeasureViewModel extends BaseViewModel {
    constructor() {
        super()
        this._BaseModel = new MeasureModel()
        this._OBJClass = makeUClass(MeasureView)
        this._Type = "Measure"
    }

    EndDraw(jsonData): string {
        for (let value of this._OBJMaps.values()) {
            if (value !== null) {
                value.EndDraw()
            }
        }
        return "End Draw"
    }
    StartMeasure(jsonData) {
        MeasureViewModel._EndAllMeasure(jsonData)
        this.Add(jsonData)
    }
    EndMeasure(jsonData) {
        MeasureViewModel._EndAllMeasure(jsonData)
    }
    ClearMeasure(jsonData) {
        MeasureViewModel._ClearAllMeasure(jsonData)

    }
    DeleteMeasure(jsonData) {
        MeasureViewModel._DeleteMeasure(jsonData)

    }

    private static MeasureViewModels = new Array<MeasureViewModel>()

    static RegisterViewModel<T extends MeasureViewModel>(ViewModel: T) {
        MeasureViewModel.MeasureViewModels.push(ViewModel)
    }
    static _EndAllMeasure(jsonData) {
        if (MeasureViewModel.MeasureViewModels.length > 0) {
            MeasureViewModel.MeasureViewModels.forEach((value) => {
                value.EndDraw(jsonData)
            })
        }
    }
    static _ClearAllMeasure(jsonData) {
        if (MeasureViewModel.MeasureViewModels.length > 0) {
            MeasureViewModel.MeasureViewModels.forEach((value) => {
                value.Clear(jsonData)
            })
        }
    }
    static _DeleteMeasure(jsonData) {
        if (MeasureViewModel.MeasureViewModels.length > 0) {
            MeasureViewModel.MeasureViewModels.forEach((value) => {
                if (value.GetType() === jsonData.data.measureType) {
                    value.Delete(jsonData)
                }
            })
        }
    }
}