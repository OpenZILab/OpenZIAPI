///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/10/08 18:18
///

import { makeUClass} from 'puerts'
import {MeasureViewModel} from "./MeasureViewModel";
import {MeasureAreaModel} from "../Model/MeasureAreaModel";
import {MeasureAreaView} from "../View/MeasureAreaView";

export class MeasureAreaViewModel extends MeasureViewModel  {
    constructor() {
        super()
        this._BaseModel = new MeasureAreaModel()
        this._OBJClass = makeUClass(MeasureAreaView)
        this._Type = "MeasureArea"
        MeasureViewModel.RegisterViewModel(this)
    }
}