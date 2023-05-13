"use strict";
///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/9/28 16:43
///
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawPointView = void 0;
const DrawView_1 = require("./DrawView");
const UE = require("ue");
const IAPIMessageHandle_1 = require("../../../System/API/IHandle/IAPIMessageHandle");
const WebSocketServer_1 = require("../../../System/API/Handle/WebSocketServer");
const MessagePupop_1 = require("../../../System/Core/MessagePupop/MessagePupop");
const MessageList_1 = require("../../../System/Core/MessagePupop/MessageList");
const MessageNotificationHandle_1 = require("../../../System/API/Handle/MessageNotificationHandle");
class DrawPointView extends DrawView_1.DrawView {
    Constructor() {
        super.Constructor();
    }
    ReceiveBeginPlay() {
        super.ReceiveBeginPlay();
    }
    ReceiveTick(DeltaSeconds) {
        super.ReceiveTick(DeltaSeconds);
    }
    ReceiveEndPlay(EndPlayReason) {
        super.ReceiveEndPlay(EndPlayReason);
    }
    Init() {
        super.Init();
    }
    ClearAllData() {
        super.ClearAllData();
    }
    RefreshView(jsonData) {
        if (!jsonData.data.isAuto) {
            if (this.IsAuto) {
                let NotifiItem;
                let NotifiStyle = new MessageNotificationHandle_1.NotificationStyle();
                NotifiStyle.RegisterFrameStyle(MessageList_1.MessageTips.API.DrawPoint, 600, 3, false);
                // NotifiStyle.AddNotifiButton("确定", () => { NotifiItem.SetCompletionState(UE.EDisplayState.CS_Pending) }, "cc", ENotifiButtonState.None)
                NotifiItem = MessagePupop_1.MessagePopup.ShowNotification(MessageList_1.MessageTips.OPERATION_MESSAGE.NOTIFICATION, NotifiStyle);
                NotifiItem.SetCompletionState(UE.EDisplayState.CS_None);
                NotifiItem.ExpireAndFadeout();
            }
        }
        let result = super.RefreshView(jsonData);
        return result;
    }
    Draw() {
        return this.DrawPoints();
    }
    DrawPoints() {
        return super.DrawPoints();
    }
    DrawPointsAndCable() {
        return super.DrawPointsAndCable();
    }
    GetUnderHit() {
        return super.GetUnderHit();
    }
    ListenKeyAction() {
        super.ListenKeyAction();
    }
    MakeKey(KeyName) {
        return super.MakeKey(KeyName);
    }
    DrawDown() {
        super.DrawDown();
    }
    DrawUp() {
        super.DrawUp();
    }
    Uping() {
        super.Uping();
    }
    DrawPoint(CurLocation) {
        super.DrawPoint(CurLocation);
    }
    DrawCable(StartParam, StartNameId, EndParam, EndName) {
        super.DrawCable(StartParam, StartNameId, EndParam, EndName);
    }
    GetPoi(index) {
        return super.GetPoi(index);
    }
    EndDraw() {
        super.EndDraw();
    }
    SetScaleTargetArmLength(TargetArmLength) {
        super.SetScaleTargetArmLength(TargetArmLength);
    }
    DrawDownEvent(CurLocation) {
        this.DrawPoint(CurLocation);
    }
    EndDrawEvent() {
        super.EndDrawEvent();
        let msg = {
            classDef: "DrawPoint",
            funcDef: "Stop",
            data: undefined,
            callback: this.JsonData.callback,
            pageID: this.JsonData.pageID,
        };
        msg.data = { "result": "stop" };
        let message = (0, IAPIMessageHandle_1.PackCallBacKMessage)(msg, msg.data);
        WebSocketServer_1.WebSocketServer.GetInstance().OnSendWebMessage(message);
    }
}
exports.DrawPointView = DrawPointView;
//# sourceMappingURL=DrawPointView.js.map