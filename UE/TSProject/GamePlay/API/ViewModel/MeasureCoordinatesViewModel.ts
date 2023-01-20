///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/10/08 11:45
///

import { makeUClass} from 'puerts'
import {MeasureViewModel} from "./MeasureViewModel";
import {MeasureCoordinatesView} from "../View/MeasureCoordinatesView";
import {MeasureCoordinatesModel} from "../Model/MeasureCoordinatesModel";

export class MeasureCoordinatesViewModel extends MeasureViewModel  {
    constructor() {
        super()
        this._BaseModel = new MeasureCoordinatesModel()
        this._OBJClass = makeUClass(MeasureCoordinatesView)
        this._Type = "MeasureCoordinates"
        MeasureViewModel.RegisterViewModel(this)
    }
}