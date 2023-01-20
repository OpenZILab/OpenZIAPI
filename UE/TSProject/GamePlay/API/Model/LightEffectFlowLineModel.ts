///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2023/01/12 10:57
///

import { BaseModel } from "../../../System/API/Model/BaseModel"

export class LightEffectFlowLineModel extends BaseModel {
    constructor()
    {
        super()
        this.DefaultData = {
            id: "LightEffectFlowLine_id",
            GISType: 0,
            coordinatesList: [
                {X: 104.06168732191, Y: 30.643138179075, Z: 1.5},
                {X: 104.06168645118, Y: 30.643228368068, Z: 1.5},
                {X: 104.06179075814, Y: 30.643229120905, Z: 1.5},
                {X: 104.06179162878, Y: 30.643138931909, Z: 1.5}
            ],
            loop: false,
            splinePointType: 2,
            lineColor:{ X: 1, Y: 0, Z: 0, W: 1 },       //基线颜色
            lineGlow: 2,            //基线的发光强度
            lineRadius: 0.5,        //基线的半径比例
            flowNumber:1,           //光流粒子个数
            flowColor:{ X: 0, Y: 0, Z: 1, W: 1 },       //光流颜色
            flowScale: 40,          //光流粒子缩放
            flowRate: 1,             //光流率（控制流动速度时间及光流粒子多少）
            lifeTime:0.1            //粒子生命周期，影像拖尾长度
        }
        this.DefaultDataRange = {

        }
    }
}
