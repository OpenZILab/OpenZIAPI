///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by behiever.
/// DateTime: 2022/9/18 23:55
///

export enum GameEngineList {
    UE = "UE",
    Unity = "Unity",
}

export var WebSocketUrl: string = "ws://127.0.0.1:89/"
export const GameEngineType = GameEngineList.UE
export var bShowMouse = true
export var bCloudRenderingMode = false

export function WriteSetting(Path): void{
    const configJson = require(Path)
    WebSocketUrl = configJson.WebSocketUrl
    bShowMouse = configJson.bShowMouse
    bCloudRenderingMode = configJson.bCloudRenderingMode
}

