///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/10/08 16:18
///

import { makeUClass} from 'puerts'
import {MeasureViewModel} from "./MeasureViewModel";
import {MeasureDistanceModel} from "../Model/MeasureDistanceModel";
import {MeasureDistanceView} from "../View/MeasureDistanceView";

export class MeasureDistanceViewModel extends MeasureViewModel  {
    constructor() {
        super()
        this._BaseModel = new MeasureDistanceModel()
        this._OBJClass = makeUClass(MeasureDistanceView)
        this._Type = "MeasureDistance"
        MeasureViewModel.RegisterViewModel(this)
    }
}