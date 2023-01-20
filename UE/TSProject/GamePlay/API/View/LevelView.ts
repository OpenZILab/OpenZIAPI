///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime:  2022/10/10 11:34
///

export enum LevelState {
    Removed = 0,
    Unloaded = 1,
    FailedToLoad = 2,
    Loading = 3,
    LoadedNotVisible = 4,
    MakingVisible = 5,
    LoadedVisible = 6,
    MakingInvisible = 7
}


import * as UE from "ue"
import { $ref, $unref, argv } from 'puerts'
import { BroadcastMessage } from "../IHandle/IMessageBroadcast"
import { LevelViewModel } from "../ViewModel/LevelViewModel"
export class LevelView {
    Name: string
    Ins: UE.LevelStreamingDynamic
    World: UE.World
    constructor(name: string) {
        this.World = (argv.getByName("GameInstance") as UE.GameInstance).GetWorld()
        this.Name = name
    }
    //@初始化关卡实例
    Init(): boolean {
        let bOutSuccess = $ref(Boolean())
        this.Ins = UE.LevelStreamingDynamic.LoadLevelInstance(this.World, this.Name, new UE.Vector(0, 0, 0), new UE.Rotator(0, 0, 0), bOutSuccess)
        if (this.Ins == null) {
            return false
        } else {
            this.Ins.SetShouldBeVisible(false)
            return $unref(bOutSuccess)
        }
    }
    //@打开关卡
    Open() {
        if (this.Init != null) {
            LevelViewModel.LevelChangeIndex = LevelViewModel.LevelChangeIndex + 1
            this.Ins.SetShouldBeVisible(true)
        }
    }

    //@关闭关卡
    Close() {
        if (this.Init != null) {
            LevelViewModel.LevelChangeIndex = LevelViewModel.LevelChangeIndex + 1
            this.Ins.SetShouldBeVisible(false)
        }
    }
    //@设置关卡显影
    SetVisble(bShow: boolean) {
        if (this.Init != null) {
            LevelViewModel.LevelChangeIndex = LevelViewModel.LevelChangeIndex + 1
            this.Ins.SetShouldBeVisible(bShow)
        }
    }

    //@获取当前关卡加载状态
    GetState(): any {
        return UE.WorldFactoryHelpFuntion.GetLevelStreamingState(this.Ins)
    }
}


