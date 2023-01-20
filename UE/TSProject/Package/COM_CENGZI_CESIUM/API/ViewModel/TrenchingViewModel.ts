///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/10/17 11:05
///
import { makeUClass } from "puerts";
import { BaseViewModel } from "../../../../System/API/ViewModel/BaseViewModel";
import { TrenchingModel } from "../Model/TrenchingModel";
import { TrenchingView } from "../View/TrenchingView";

export class TrenchingViewModel extends BaseViewModel {

    constructor() {
        super()
        this._BaseModel = new TrenchingModel()
        this._OBJClass = makeUClass(TrenchingView)
        this._Type = "Trenching"
    }
}
