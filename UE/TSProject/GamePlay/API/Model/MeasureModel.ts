///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/10/08 11:22
///

import { BaseModel } from "../../../System/API/Model/BaseModel"

export class MeasureModel extends BaseModel {
    constructor()
    {
        super()
        this.DefaultData = {
            id: "Measure_id",
            measureType: 1,
            pointColor: { X: 1, Y: 0, Z: 0, W: 1 },
            lineColor: { X: 0, Y: 1, Z: 0, W: 1 },
            //如果最大值小于最小值，会自动交换
            MinDistance: 100000, // 最小距离决定UI的透明度，按照 最小距离/相机到Actor的距离，获取透明度比值  如果值较小，需要距离Actor较劲才可以看到UI
            MaxDistance: 1000000, //如果相机到Actor的距离大于最大距离，UI将被隐藏
        }
        this.DefaultDataRange = {
            pointColor: {Range: {"min": {X: 0, Y: 0, Z: 0, W: 0}, "max":{X: 1, Y: 1, Z: 1, W: 1}}},
            lineColor: {Range: {"min": {X: 0, Y: 0, Z: 0, W: 0}, "max":{X: 1, Y: 1, Z: 1, W: 1}}},
            MinDistance: {Range: {"min": 0, "max":10000000}},
            MaxDistance: {Range: {"min": 0, "max":10000000}},
        }
    }

}
