///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/10/10 11:34
///

import { BaseModel } from "../../../System/API/Model/BaseModel";

export class LevelModel extends BaseModel {
    constructor() {
        super()
        this.DefaultData = {
            LevelName: String,
            LevelHeight: Number,
            LevelRoot: String,
            StartToLoad: Boolean,
            LevelPage: String
        }
        this.DefaultDataRange = {
        }
    }
    //@添加数据
    AddData(id, inData) {
        if (this.AllData.has(id))
            return undefined
        //let ruleData = this.ProcessData(inData)
        this.AllData.set(id, inData)
        return true
    }
    //@解析CSV数据，并储存
    AnalysisData(InData):void {
        for (let i = 0; i < InData.length; i++) {
            // if(InData[0][i] == undefined){
            //     continue
            // }
            let temp = {
                LevelName: String,
                LevelHeight: Number,
                LevelRoot: String,
                StartToLoad: Boolean,
                LevelPage: String
            }
            temp.LevelName = InData[i][0]
            temp.LevelHeight = InData[i][1]
            temp.LevelRoot = InData[i][2]
            temp.StartToLoad = InData[i][3]
            temp.LevelPage = InData[i][4]
            this.AddData(temp.LevelName,temp)
        }
    }
}

