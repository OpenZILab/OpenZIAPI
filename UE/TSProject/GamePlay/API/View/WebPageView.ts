///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by behiever.
/// DateTime: 2022/9/20 1:08
///

import {Widget} from "../../../System/Core/Widget"
import * as UE from "ue";

export function OnWebPageChange(url){
    let widget = Widget.GetInstance().SwitchCurrWidget("WebBrowserView") as UE.OpenZIAPI.OpenZIFrameWork.BP.WebBrowser.WebBrowserView.WebBrowserView_C
    widget.OpenZIBrowser.LoadURL(url)
}