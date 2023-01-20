///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by behiever.
/// DateTime: 2022/9/23 15:15
///

import { GetViewModel } from "../../System/API/ApiViewModelSystem"
import * as IConsoleHandle from "../API/IHandle/IConsoleHandle"
import * as IMainControllerHandle from "../API/IHandle/IMainControllerHandle"
import { CoodinateConverterViewModel } from "./ViewModel/CoodinateConverterViewModel"

//@Console
export class Console {
    static Console(message) {
        IConsoleHandle.ConsoleCommand(message.data.Command)
        let Scale = GetViewModel(CoodinateConverterViewModel).GetScale()
        console.error(`CoodinateConverterViewModel: ${Scale}`)
    }
}

//@ChangePawn
export class ChangePawn {
    static ChangePawn(message) {
        IMainControllerHandle.ChangePawn(message)
    }

    static ChangeDefaultPawn(message) {
        IMainControllerHandle.ChangeDefaultPawn(message)
    }
}

//@Skyline
export class Skyline {
    static OpenSkyline(message) {
        IMainControllerHandle.OpenSkyline(message)
    }
    static CloseSkyline(message) {
        IMainControllerHandle.CloseSkyline(message)
    }
}

export function GetDefaultPawn(): void {
    IMainControllerHandle.GetDefaultPawn()
}

//@Axes
export class AxesTool {
    static OpenAxesTool(message) {
        IMainControllerHandle.OpenAxesTool(message)
    }

    static CloseAxesTool(message) {
        IMainControllerHandle.CloseAxesTool(message)
    }

    static SetAxesToolSelectMoth(message) {
        IMainControllerHandle.SetAxesToolSelectMoth(message)
    }

    static SetAxesSelectionOutline(message) {
        IMainControllerHandle.SetAxesSelectionOutline(message)
    }
}



