///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/12/16 11:37
///

import { makeUClass} from 'puerts'
import {BaseViewModel} from "../../../System/API/ViewModel/BaseViewModel"
import {DynamicWeatherModel} from "../Model/DynamicWeatherModel";
import {DynamicWeatherView} from "../View/DynamicWeatherView";
import * as UE from "ue";

export class DynamicWeatherViewModel extends BaseViewModel  {
    constructor() {
        super()
        this._BaseModel = new DynamicWeatherModel()
        this._OBJClass = UE.Class.Load("/OpenZIAPI/DynamicWeather/DynamicWeather/Blueprints/BP_DynamicSKY.BP_DynamicSKY_C")
        this._Type = "DynamicWeather"

    }

    ChangeHour(msg: any) {
        let _data = msg.data
        let id = _data.id
        if (this._BaseModel !== null && this._OBJMaps.get(id)) {
            this._OBJMaps.get(id).ChangeHour(_data.time)
            return "Change Hour"
        }
        return "The current id does not exist"
    }

    Auto24HourChange(msg: any) {
        let _data = msg.data
        let id = _data.id
        if (this._BaseModel !== null && this._OBJMaps.get(id)) {
            this._OBJMaps.get(id).Auto24HourChange(_data.DayVariation, _data.IsStartFormCurrentTime, _data.IsLoop, msg.callback)
            return "24 Hour Change"
        }
        return "The current id does not exist"
    }

    Stop24HourChange(msg: any) {
        let _data = msg.data
        let id = _data.id
        if (this._BaseModel !== null && this._OBJMaps.get(id)) {
            this._OBJMaps.get(id).Stop24HourChange()
            return "Stop 24 Hour Change"
        }
        return "The current id does not exist"
    }

    ChangeFourSeasons(msg: any) {
        let _data = msg.data
        let id = _data.id
        if (this._BaseModel !== null && this._OBJMaps.get(id)) {
            this._OBJMaps.get(id).ChangeFourSeasons(_data.Seasons)
            return "Change Four Seasons"
        }
        return "The current id does not exist"
    }

    ChangeClimate(msg: any) {
        let _data = msg.data
        let id = _data.id
        if (this._BaseModel !== null && this._OBJMaps.get(id)) {
            this._OBJMaps.get(id).ChangeClimate(_data.climate)
            return "Change Climate"
        }
        return "The current id does not exist"
    }
}