///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/10/17 11:05
///

import { makeUClass } from "puerts";
import { BaseViewModel } from "../../../../System/API/ViewModel/BaseViewModel";
import { FlattenModel } from "../Model/FlattenModel";
import { FlattenView } from "../View/FlattenView";

export class FlattenViewModel extends BaseViewModel {

    constructor() {
        super()
        this._BaseModel = new FlattenModel()
        this._OBJClass = makeUClass(FlattenView)
        this._Type= "Flatten" 
    }
}

