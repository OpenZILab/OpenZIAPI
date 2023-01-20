///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/10/08 12:08
///

import { BaseModel } from "../../../System/API/Model/BaseModel"

export class MeasureCoordinatesModel extends BaseModel {
    constructor()
    {
        super()
        this.DefaultData = {
            id: "Measure_id",
            measureType: 0,
            pointColor: { X: 1, Y: 0, Z: 0, W: 1 },
            lineColor: { X: 0, Y: 1, Z: 0, W: 1 },
            MinDistance: 100000,
            MaxDistance: 1000000,
        }
        this.DefaultDataRange = {
            pointColor: {Range: {"min": {X: 0, Y: 0, Z: 0, W: 0}, "max":{X: 1, Y: 1, Z: 1, W: 1}}},
            lineColor: {Range: {"min": {X: 0, Y: 0, Z: 0, W: 0}, "max":{X: 1, Y: 1, Z: 1, W: 1}}},
            MinDistance: {Range: {"min": 0, "max":10000000}},
            MaxDistance: {Range: {"min": 0, "max":10000000}},
        }
        this.typeName = "MeasureCoordinates"
        this.funcName = "StartMeasure"
        this.InitDataAndRange()
    }
}
