///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/9/29 14:52
///

import { makeUClass} from 'puerts'
import {DrawViewModel} from "./DrawViewModel";
import {DrawPlaneView} from "../View/DrawPlaneView";
import {DrawPlaneModel} from "../Model/DrawPlaneModel";

export class DrawPlaneViewModel extends DrawViewModel  {
    constructor() {
        super()
        this._BaseModel = new DrawPlaneModel()
        this._OBJClass = makeUClass(DrawPlaneView)
        this._Type = "DrawPlane"
        DrawViewModel.RegisterViewModel(this)
    }
}