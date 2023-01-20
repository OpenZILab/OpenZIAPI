///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/12/24 10:01
///

import { BaseModel } from "../../../System/API/Model/BaseModel"

export class OriginDestinationLineModel extends BaseModel {
    constructor() {
        super()
        this.DefaultData = {
            id: "OriginDestinationLine_id",
            GISType: 0,
            start: {X: 104.06168732191, Y: 30.643138179075, Z: 1.5},
            end: {X: 104.06168732191, Y: 30.643138179075, Z: 1.5},
            middleHeight: 5000,
            lineColor:{ X: 1, Y: 0, Z: 0, W: 1 },       //基线颜色
            lineGlow: 2,            //基线的发光强度
            lineRadius: 0.5,        //基线的半径比例
            flowColor:{ X: 0, Y: 0, Z: 1, W: 1 },       //光流颜色
            flowScale: 40,          //光流粒子缩放
            flowRate: 1             //光流率（控制流动速度时间及光流粒子多少）
        }
        this.DefaultDataRange = {
        }
    }
}
