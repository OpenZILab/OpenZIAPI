///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/12/16 11:45
///

import { BaseModel } from "../../../System/API/Model/BaseModel"

export class DynamicWeatherModel extends BaseModel {
    constructor() {
        super()
        this.DefaultData = {
            id: "DynamicWeather_id",
            time: 12
        }
        this.DefaultDataRange = {
        }
    }
}
