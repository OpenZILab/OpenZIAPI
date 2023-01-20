///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/10/17 11:05
///

import { CesiumRasterOverlayModel } from "./CesiumRasterOverlayModel"

export class CesiumWMSRasterOverlayModel extends CesiumRasterOverlayModel {
    constructor()
    {
        super()
        this.DefaultData = {
            url: "",
            layers: "",
            tileWidth: 256,
            tileHeight: 256,
            minimumLevel: 0,
            maximumLevel: 14
        }
    }
}