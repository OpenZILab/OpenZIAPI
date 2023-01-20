///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/9/29 14:39
///

import { makeUClass} from 'puerts'
import {BaseViewModel} from "../../../System/API/ViewModel/BaseViewModel"
import {DrawModel} from "../Model/DrawModel";
import {DrawView} from "../View/DrawView";

export class DrawViewModel extends BaseViewModel  {
    constructor() {
        super()
        this._BaseModel = new DrawModel()
        this._OBJClass = makeUClass(DrawView)
        this._Type = "Draw"
    }

    EndDraw(jsonData): string {
        for (let value of this._OBJMaps.values()) {
            if (value !== null) {
                value.EndDraw()
            }
        }
        return "End Draw"
    }
    StartDraw(jsonData) {
        DrawViewModel._EndAllDraw(jsonData)
        this.Add(jsonData)
    }
    EndAllDraw(jsonData) {
        DrawViewModel._EndAllDraw(jsonData)
    }
    ClearAllDraw(jsonData) {
        DrawViewModel._ClearAllDraw(jsonData)

    }
    DeleteDraw(jsonData) {
        DrawViewModel._DeleteDraw(jsonData)

    }

    private static DrawViewModels = new Array<DrawViewModel>()

    static RegisterViewModel<T extends DrawViewModel>(ViewModel: T) {
        DrawViewModel.DrawViewModels.push(ViewModel)
    }
    static _EndAllDraw(jsonData) {
        if (DrawViewModel.DrawViewModels.length > 0) {
            DrawViewModel.DrawViewModels.forEach((value) => {
                value.EndDraw(jsonData)
            })
        }
    }
    static _ClearAllDraw(jsonData) {
        if (DrawViewModel.DrawViewModels.length > 0) {
            DrawViewModel.DrawViewModels.forEach((value) => {
                value.Clear(jsonData)
            })
        }
    }
    static _DeleteDraw(jsonData) {
        if (DrawViewModel.DrawViewModels.length > 0) {
            DrawViewModel.DrawViewModels.forEach((value) => {
                if (value.GetType() === jsonData.data.drawType) {
                    value.Delete(jsonData)
                }
            })
        }
    }
}


