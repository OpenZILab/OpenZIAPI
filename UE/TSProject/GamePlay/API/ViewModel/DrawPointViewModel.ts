///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/9/29 14:46
///

import { makeUClass} from 'puerts'
import {DrawViewModel} from "./DrawViewModel";
import {DrawPointView} from "../View/DrawPointView";
import {DrawPointModel} from "../Model/DrawPointModel";

export class DrawPointViewModel extends DrawViewModel  {
    constructor() {
        super()
        this._BaseModel = new DrawPointModel()
        this._OBJClass = makeUClass(DrawPointView)
        this._Type = "DrawPoint"
        DrawViewModel.RegisterViewModel(this)
    }
}