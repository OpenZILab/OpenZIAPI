///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/9/20 23:52
///

import { makeUClass} from 'puerts'
import {BaseViewModel} from "../../../System/API/ViewModel/BaseViewModel"
import {AlarmAnchorModel} from "../Model/AlarmAnchorModel";
import {AlarmAnchorView} from "../View/AlarmAnchorView";

export class AlarmAnchorViewModel extends BaseViewModel  {
    constructor() {
        super()
        this._BaseModel = new AlarmAnchorModel()
        this._OBJClass = makeUClass(AlarmAnchorView)
        this._Type = "AlarmAnchor"

    }

}