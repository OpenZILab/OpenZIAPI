///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/9/28 16:43
///

import {DrawView} from "./DrawView";
import * as UE from "ue";

export class DrawLineView extends DrawView {
    Constructor(){
        super.Constructor()
    }

    ReceiveBeginPlay(): void {
        super.ReceiveBeginPlay()
    }

    ReceiveTick(DeltaSeconds: number): void {
        super.ReceiveTick(DeltaSeconds)
    }

    ReceiveEndPlay(EndPlayReason): void{
        super.ReceiveEndPlay(EndPlayReason)
    }

    Init(): void {
        super.Init()
    }

    RefreshView(jsonData): string {
        return super.RefreshView(jsonData)
    }

    GetUnderHit(): UE.HitResult{
        return super.GetUnderHit()
    }

    ListenKeyAction(): void{
        super.ListenKeyAction()
    }

    MakeKey(KeyName): UE.Key{
        return super.MakeKey(KeyName)
    }

    DrawDown(): void{
        super.DrawDown()
    }

    DrawUp(): void{
        super.DrawUp()
    }

    Uping(): void{
        super.Uping()
    }

    DrawPoint(CurLocation): void{
        super.DrawPoint(CurLocation)
    }

    DrawCable(StartParam,StartNameId,EndParam,EndName): void{
        super.DrawCable(StartParam,StartNameId,EndParam,EndName)
    }

    GetPoi(index): any{
        return super.GetPoi(index)
    }

    EndDraw(): void{
        super.EndDraw()
    }

    SetScale(CameraLocation): void{
        super.SetScale(CameraLocation)
    }

    DrawDownEvent(CurLocation): void{
        this.DrawDownLine(CurLocation)
    }

    DrawDownLine(CurLocation): void{
        this.DrawPoint(CurLocation)
        if (this.PointLocation.Num() > 1){
            let temp1 = this.GetPoi(2)
            let StartParam = temp1[0]
            let StartName = temp1[1]
            let temp2 = this.GetPoi(1)
            let EndParam = temp2[0]
            let EndName = temp2[1]
            this.DrawCable(StartParam,1,EndParam,EndName)
        }
    }

    EndDrawEvent(): void{
    }
}
