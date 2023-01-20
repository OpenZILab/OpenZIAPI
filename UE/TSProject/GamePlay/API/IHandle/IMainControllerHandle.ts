///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/10/17 10:50
///

import * as MainControllerHandle from "../Handle/MainControllerHandle";

export function GetDefaultPawn(): void{
    MainControllerHandle.GetDefaultPawn()
}
export function ChangePawn(jsondata): void{
    MainControllerHandle.ChangePawn(jsondata)
}
export function ChangeDefaultPawn(jsondata): void{
    MainControllerHandle.ChangeDefaultPawn()
}
export function OpenSkyline(jsondata): void{
    MainControllerHandle.OpenSkyline()
}
export function CloseSkyline(jsondata): void{
    MainControllerHandle.CloseSkyline()
}
export function OpenAxesTool(jsondata): void{
    MainControllerHandle.OpenAxesTool()
}
export function CloseAxesTool(jsondata): void{
    MainControllerHandle.CloseAxesTool()
}

export function GetAxesTool(): any{
    return MainControllerHandle.GetAxesTool()
}

export function SetAxesToolSelectMoth(jsondata): void{
    MainControllerHandle.SetAxesToolSelectMoth(jsondata)
}

export function GetAxesToolSelectMoth(): any{
    return MainControllerHandle.GetAxesToolSelectMoth()
}

export function SetAxesSelectionOutline(jsondata): void{
    MainControllerHandle.SetAxesSelectionOutline(jsondata)
}
