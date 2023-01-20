///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/12/16 11:43
///

import * as UE from 'ue'
import {BaseView} from "../../../System/API/View/BaseView";
import {$ref} from "puerts";
import {PackBroadcastMessage, PackCallBacKMessage} from "../../../System/API/IHandle/IAPIMessageHandle";
import {WebSocketServer} from "../../../System/API/Handle/WebSocketServer";

type DynamicWeather_type = UE.OpenZIAPI.DynamicWeather.DynamicWeather.Blueprints.BP_DynamicSKY.BP_DynamicSKY_C

export interface DynamicWeatherView extends DynamicWeather_type {
};

export class DynamicWeatherView extends BaseView {


    //@ts
    data: any
    jsondata: any
    callback: any

    ReceiveBeginPlay(): void {
        super.ReceiveBeginPlay()
        this.Stop24Hour.Add(()=>{
            this.Stop24HourMes()
        })
        this.jsondata = undefined
        this.callback = undefined
    }

    //
    ReceiveTick(DeltaSeconds: number): void {
        if (this.IsAutoChangeTime){
            this.UpdateSkyTime()
        }
    }

    Init(): void {
        this.ClimatePreset()
        this.SetSunAndMoonRotation()
        this.Set_Climate()
        this.SetRainSnowEffect()
        this.Set_Wind()
        this.SetSKY()
        this.Set_RainSnow()
    }

    RefreshView(jsonData): string {
        this.jsondata = jsonData
        this.data = jsonData.data
        this.DayTime = this.data.time
        this.Init()
        let FHitResult = $ref(new UE.HitResult)
        this.K2_SetActorLocation(new UE.Vector(0,0,0),false,FHitResult,false)
        return "success"
    }

    //设置天气
    SetSKY() {
        this.SetSun()
        this.SetMoon()
        this.SetWindowLight()
        this.SetSkyAtmosphere()
        this.SetFog()
        this.SetCloudMode()
        this.SetChangeOfColoud()
        this.SetFourSeasons()
    }

    //时间变换
    ChangeHour(DayTime) {
        this.DayTime = DayTime
        this.UpdateSkyTime()
    }

    UpdateSkyTime(){
        this.SetSunAndMoonRotation()
        this.SetSun()
        this.SetMoon()
        this.SetWindowLight()
        this.SetSkyAtmosphere()
        this.SetFog()
        this.SetChangeOfColoud()
    }

    Auto24HourChange(DayVariation, IsStartFormCurrentTime, IsLoop, Callback) {
        this.callback = Callback
        this.DayVariation = DayVariation
        this.TempDayTime = this.DayTime
        this.IsLoop = IsLoop
        this.Time_0.SetPlayRate(this.DayVariation / 100)
        this.Time_0.SetLooping(IsLoop)
        let playposition
        if (IsStartFormCurrentTime) {
            playposition = this.DayTime / 24
        } else {
            playposition = 0
        }
        this.Time_0.SetPlaybackPosition(playposition, false, false)
        if (!IsLoop) {
            this.Time_1.SetPlayRate(DayVariation / 100)
            this.Time_1.SetLooping(false)
            this.Time_1.SetPlaybackPosition(0, false, false)
            // this.TimeTwoPlay()
        }
        this.TimePlay()
    }

    Stop24HourChange(){
        this.IsAutoChangeTime = false
        this.Stop24HourMes()
    }

    Stop24HourMes(){
        let msg ={
            classDef : "DynamicWeather",
            funcDef : "Stop24HourChange",
            data : undefined,
            callback : this.callback,
            pageID : this.jsondata.pageID,
        }
        msg.data = {"result":"stop 24 hours change"}
        let message = PackCallBacKMessage(msg,  msg.data)
        WebSocketServer.GetInstance().OnSendWebMessage(message)
    }

    ChangeFourSeasons(Seasons) {
        this.Seasons = Seasons
        this.SetFourSeasons()
    }

    ChangeClimate(climate) {
        this.Climate = climate
        this.ClimatePreset()
        this.Set_Climate()
        this.SetRainSnowEffect()
        this.SetFog()
        this.SetChangeOfColoud()
        this.Set_Wind()
    }

    SetSunAndMoonRotation() {
        this.SunLightComponent = this.SunLight
        this.MoonLightComponent = this.MoonLight
        this.SetDawnAndDuskTime()
        let temp1 = UE.KismetMathLibrary.MapRangeUnclamped(this.InternalTime, 0.0, 24.0, 0.0, 360.0)
        let tempSun = new UE.Rotator(0,0,0)
        this.ConvertAngleToTime(this.SunTiltAngle, this.SunRotatAngle, this.SunRotatAngle, temp1, $ref(tempSun))
        let FHitResult = $ref(new UE.HitResult)
        this.SunLightComponent.K2_SetWorldRotation(tempSun, false, FHitResult, false)
        let temp2 = UE.KismetMathLibrary.MapRangeUnclamped(this.InternalTime + this.MoonRiseTilt, 0.0, 24.0, 0.0, 360.0) + 180.0
        let tempMoon = new UE.Rotator(0,0,0)
        this.ConvertAngleToTime(this.MoonTiltAngle, this.MoonRotatAngle, this.MoonRotatAngle, temp2, $ref(tempMoon))
        this.MoonLightComponent.K2_SetWorldRotation(tempMoon, false, FHitResult, false)
        this.Arrow.K2_SetWorldRotation(new UE.Rotator(tempMoon.Pitch, tempMoon.Yaw,this.MoonRotat), false, FHitResult, false)
        let temptime = UE.KismetMathLibrary.Fraction(this.InternalTime / 24) * 24
        let tempValue
        if (temptime < 12) {
            tempValue = UE.KismetMathLibrary.MapRangeClamped(temptime, 5.5, 6.2, 1.0, 0.0)
        } else {
            tempValue = UE.KismetMathLibrary.MapRangeClamped(temptime, 17.9, 18.5, 0.0, 1.0)
        }
        this.Stars_MID.SetScalarParameterValue("BP_StarsO", tempValue)
        let tempV1 = UE.KismetMathLibrary.Conv_VectorToLinearColor(UE.KismetMathLibrary.Normal(UE.KismetMathLibrary.Conv_RotatorToVector(this.SunLightComponent.K2_GetComponentRotation()), 0.0001))
        this.Stars_MID.SetVectorParameterValue("BP_Sun_Position", tempV1)
        let tempV2 = UE.KismetMathLibrary.Conv_VectorToLinearColor(UE.KismetMathLibrary.Multiply_VectorFloat(UE.KismetMathLibrary.Conv_RotatorToVector(this.MoonLightComponent.K2_GetComponentRotation()), 100000))
        this.Stars_MID.SetVectorParameterValue("BP_Moon_Position", tempV2)
        let CurBoolSky = UE.KismetMathLibrary.InRange_FloatFloat(this.InternalTime,7.0,18.0,true,true)
        if (CurBoolSky){
            this.SkyLight.SetCubemap(UE.TextureCube.Load("/OpenZIAPI/DynamicWeather/A_property_collect/Master_material/M_window/Texture/cubemap_1.cubemap_1"))
        }
        else {
            this.SkyLight.SetCubemap(UE.TextureCube.Load("/OpenZIAPI/DynamicWeather/A_property_collect/Master_material/M_window/Texture/daylight3.daylight3"))
        }
    }

    SetDawnAndDuskTime() {
        let temptime = UE.KismetMathLibrary.Fraction(this.DayTime / 24) * 24

        if (UE.KismetMathLibrary.InRange_FloatFloat(temptime, this.DawnTime, this.DuskTime, true, true)) {
            this.InternalTime = UE.KismetMathLibrary.MapRangeClamped(temptime, this.DawnTime, this.DuskTime, 6.0, 18.0)
        } else {
            if (temptime < this.DawnTime) {
                this.InternalTime = UE.KismetMathLibrary.MapRangeClamped(temptime, 0.0, this.DawnTime, 0.0, 6.0)
            } else {
                this.InternalTime = UE.KismetMathLibrary.MapRangeClamped(temptime, this.DuskTime, 24., 18.0, 24.0)
            }
        }
    }

    ConvertAngleToTime2(Pitch: number, AngleDeg: number, AngleDeg2: number, AngleDeg3: number): UE.Rotator {
        let tempR = new UE.Rotator(0, Pitch, 0)
        let Vect1 = UE.KismetMathLibrary.GreaterGreater_VectorRotator(new UE.Vector(0, 0, 1), tempR)
        let Vect2 = UE.KismetMathLibrary.GreaterGreater_VectorRotator(new UE.Vector(1, 0, 0), tempR)
        let tempV1 = UE.KismetMathLibrary.RotateAngleAxis(Vect1, AngleDeg, new UE.Vector(0, 0, 1))
        let tempV2 = UE.KismetMathLibrary.RotateAngleAxis(Vect2, AngleDeg2, new UE.Vector(0, 0, 1))
        let tempV3 = UE.KismetMathLibrary.RotateAngleAxis(tempV1, AngleDeg3, tempV2)
        let value = UE.KismetMathLibrary.Conv_VectorToRotator(tempV3)
        return value
    }

    SetMoon() {
        let temptime = UE.KismetMathLibrary.Fraction(this.InternalTime / 24) * 24
        let tempValue
        if (temptime < 12) {
            tempValue = UE.KismetMathLibrary.MapRangeClamped(temptime, 5.5, 6.2, 1.0, 0.0)
        } else {
            tempValue = UE.KismetMathLibrary.MapRangeClamped(temptime, 17.9, 18.5, 0.0, 1.0)
        }
        this.MoonLightComponent.SetIntensity(this.MoonlightIntensity * tempValue)
        this.MoonLightComponent.SetLightColor(this.MoonlightColor, true)
        if (this.UseMoonModel) {
            this.SM_Moon.SetVisibility(true, false)
            this.SM_Moon.SetWorldScale3D(UE.KismetMathLibrary.Conv_FloatToVector(this.MoonSize * 100000.0))
            this.Stars_MID.SetTextureParameterValue("BP_T_Stars", this.StarrySkyMap)
            this.Stars_MID.SetVectorParameterValue("BP_StarsColor", new UE.LinearColor(this.StarrySkyColor.R, this.StarrySkyColor.G, this.StarrySkyColor.B, this.StarsBrightness))
            this.Moon_MID.SetVectorParameterValue("BP_MoonColor", new UE.LinearColor(this.MoonColor.R, this.MoonColor.G, this.MoonColor.B, this.MoonColorBrightness))
            this.Moon_MID.SetScalarParameterValue("BP_MoonPhase", this.MoonPhases)
            this.Stars_MID.SetScalarParameterValue("BP_Moon_Scale", 0.0)
        } else {
            this.SM_Moon.SetVisibility(false, false)
            this.Stars_MID.SetVectorParameterValue("BP_MoonColor", new UE.LinearColor(this.MoonColor.R, this.MoonColor.G, this.MoonColor.B, this.MoonColorBrightness))
            this.Stars_MID.SetScalarParameterValue("BP_Moon_Scale", this.MoonSize * 10000)
            let temp = UE.KismetMathLibrary.GreaterGreater_VectorRotator(new UE.Vector(0, -1, 0), new UE.Rotator(0, 0, UE.KismetMathLibrary.MapRangeClamped(this.MoonPhases, 0.0, 30.0, 0.0, 360.0)))
            this.Stars_MID.SetVectorParameterValue("BP_MoonPhase", UE.KismetMathLibrary.Conv_VectorToLinearColor(temp))
        }
    }

    SetSun() {
        let temptime = UE.KismetMathLibrary.Fraction(this.InternalTime / 24) * 24
        let tempValue
        if (UE.KismetMathLibrary.InRange_FloatFloat(temptime, this.DawnTime, this.DuskTime, true, true)) {
            tempValue = 3.0
        } else {
            tempValue = 5.0
        }
        this.SkyLight.SetIntensity(tempValue * this.SkylightIntensity)
        let tempValue1
        if (temptime < 12) {
            tempValue1 = UE.KismetMathLibrary.MapRangeClamped(temptime, 5.5, 6.2, 0.0, 1.0)
        } else {
            tempValue1 = UE.KismetMathLibrary.MapRangeClamped(temptime, 17.9, 18.5, 1.0, 0.0)
        }
        this.SunLightComponent.SetIntensity(this.SunlightIntensity * tempValue1)
        this.SunLightComponent.SetLightColor(this.SunlightColor, true)
        this.SunLightComponent.SetTemperature(this.ColorTemperature)
        this.Stars_MID.SetScalarParameterValue("BP_Sun_Radius", this.SunSize)
        this.Stars_MID.SetScalarParameterValue("BP_Sun_Brightness", this.SolarColorIntensity)
        this.Stars_MID.SetVectorParameterValue("BP_SunColor", this.CLC_Sun_Color.GetLinearColorValue(UE.KismetMathLibrary.MapRangeClamped(temptime, 0, 12, 0, 1)))
    }

    SetSkyAtmosphere() {
        let temp1 = this.InternalTime + this.MoonRiseTilt
        let temptime = UE.KismetMathLibrary.Fraction(temp1 / 24) * 24
        let value
        if (temptime < 12) {
            let tempValue1
            if (temptime < 6) {
                tempValue1 = UE.KismetMathLibrary.MapRangeClamped(temptime, 4, 6, 0, 0.5)
            } else {
                tempValue1 = 1.0
            }
            if (UE.KismetMathLibrary.InRange_FloatFloat(this.InternalTime, 0.0, 6.0, false, false)) {
                value = tempValue1
            } else {
                value = 0.0
            }
        } else {
            let tempValue2
            if (temptime < 18.5) {
                tempValue2 = UE.KismetMathLibrary.MapRangeClamped(temptime, 18.0, 18.1, 0.0, 0.5)
            } else {
                tempValue2 = UE.KismetMathLibrary.MapRangeClamped(temptime, 19.5, 20.0, 0.5, 1.0)
            }
            if (this.InternalTime < temp1) {
                value = 0.0
            } else {
                value = tempValue2
            }
        }
        this.SkyAtmosphere.SetRayleighScattering(this.NCB_SkyAtmosphereColor.GetLinearColorValue(value))
    }

    SetVolmetric() {
        this.VolumetricCloud.SetLayerBottomAltitude(this.BottomHeight)
        this.VolumetricCloud.SetLayerHeight(this.Height)
        this.VolumetricCloud.SetTracingStartMaxDistance(this.TraceStartMaxDistance)
        this.VolumetricCloud.SetTracingMaxDistance(this.TraceMaxDistance)
        this.VolumetricCloud_MID.SetScalarParameterValue("BP_GlobalSize", this.CloudSize)
        this.VolumetricCloud_MID.SetScalarParameterValue("BP_AddCloudDetails", this.AddCloudDetail)
        this.VolumetricCloud_MID.SetVectorParameterValue("BP_UserOffset", new UE.LinearColor(this.CloudMigrationX, this.CloudMigrationY, 0, 0))
        let temp = UE.KismetMathLibrary.Conv_VectorToLinearColor(this.WindDirection.GetForwardVector())
        this.VolumetricCloud_MID.SetVectorParameterValue("BP_WindSpeed", new UE.LinearColor(temp.R, temp.G, 0.5, this.CloudWindSpeed * this.WindSpeed))
        this.VolumetricCloud_MID.SetScalarParameterValue("BP_CloudDensity", this.CloudCoverage * this.Climate_CloudCoverage)
    }

    SetFog() {
        let temptime = UE.KismetMathLibrary.Fraction(this.InternalTime / 24) * 24
        let tempValue
        if (temptime < 12) {
            tempValue = UE.KismetMathLibrary.MapRangeClamped(temptime, 0, 12, 0, 0.5)
        } else {
            tempValue = UE.KismetMathLibrary.MapRangeClamped(temptime, 12, 24, 0.5, 1.0)
        }
        this.HeightFogComponent = this.ExponentialHeightFog
        this.HeightFogComponent.SetFogDensity(this.FogDensity * this.Climate_FogDensity * this.CF_FogDensity.GetFloatValue(tempValue))
        this.HeightFogComponent.SetFogHeightFalloff(this.CF_FogHeightFalloff.GetFloatValue(temptime) * this.FogHeightAttenuation)
        this.HeightFogComponent.SetFogInscatteringColor(UE.KismetMathLibrary.Multiply_LinearColorLinearColor(this.CLC_FogColor.GetLinearColorValue(tempValue), this.FogColor))
        this.HeightFogComponent.SetDirectionalInscatteringColor(this.CLC_InscatteringColor.GetLinearColorValue(temptime))
        this.ExponentialHeightFog.SetDirectionalInscatteringExponent(this.CF_InscatteringExponent.GetFloatValue(temptime))
    }

    SetLight() {
        let IsTrue
        if (this.InternalTime < 12) {
            IsTrue = UE.KismetMathLibrary.InRange_FloatFloat(this.InternalTime, 5.95, 6.1, true, true)
        } else {
            IsTrue = UE.KismetMathLibrary.InRange_FloatFloat(this.InternalTime, 17.95, 18.1, true, true)
        }
        if (IsTrue) {
            this.AllLight.Empty()
            UE.GameplayStatics.GetAllActorsOfClass(this, UE.PointLight.StaticClass(), $ref(this.PointLight))
            UE.GameplayStatics.GetAllActorsOfClass(this, UE.SpotLight.StaticClass(), $ref(this.SpotLight))
            UE.GameplayStatics.GetAllActorsOfClass(this, UE.RectLight.StaticClass(), $ref(this.RectLight))
            for (let i = 0; i < this.PointLight.Num(); i++) {
                this.AllLight.Add(this.PointLight.Get(i))
            }
            for (let i = 0; i < this.SpotLight.Num(); i++) {
                this.AllLight.Add(this.SpotLight.Get(i))
            }
            for (let i = 0; i < this.RectLight.Num(); i++) {
                this.AllLight.Add(this.RectLight.Get(i))
            }
            for (let i = 0; i < this.AllLight.Num(); i++) {
                let CurLights = this.AllLight.Get(i).K2_GetComponentsByClass(UE.LightComponent.StaticClass())
                for (let i = 0; i < CurLights.Num(); i++) {
                    this.ArrayElement = CurLights.Get(i) as UE.LightComponent
                    if (UE.KismetMathLibrary.InRange_FloatFloat(this.InternalTime, 6, 18, true, true)) {
                        this.ArrayElement.SetVisibility(false, false)
                    } else {
                        this.ArrayElement.SetVisibility(true, false)
                    }
                }
            }
        }
    }

    Set_RainSnow() {
        let CurMPC_Climate = UE.MaterialParameterCollection.Load("/OpenZIAPI/DynamicWeather/DynamicWeather/Materials/Climate/zengzi_MPC_DynamicWeather.zengzi_MPC_DynamicWeather")
        UE.KismetMaterialLibrary.SetVectorParameterValue(this, CurMPC_Climate, "WaterColor", this.WaterColor)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "Rain", this.RainIntensity)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "2Rain_Ripple_Speed", this.LightRainPuddlesRainRippleSpeed)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "2Rain_Ripple_In", this.LightRainPuddleRainRippleIntensity)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "2Rain_RippleUV", this.LightRainPuddlesRainRippleSize)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "3Rain_RaindropsUV", this.HeavyRainPuddlesRainPointSize)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "4Rain_WaterSlope_In", this.EndRainPuddleSlopeStrength)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "5Rain_DisappearMaskUV", this.EndRainRainDisappearMaskSize)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "Snow", this.SnowIntensity)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "SnowUV", this.SnowUVSize)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "GradientMaskUV", this.SnowMaskUVSize)
        let CurMPC_Clouds = UE.MaterialParameterCollection.Load("/OpenZIAPI/DynamicWeather/DynamicWeather/Materials/VolumetricCloud/zengzi_MPC_Clouds.zengzi_MPC_Clouds")
        let temp = UE.KismetMathLibrary.MapRangeClamped(this.RainIntensity, 2.0, 2.5, 0.0, 1.0)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Clouds, "LightningIntensity", temp)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Clouds, "LightningSpeed", this.LightningSpeed)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Clouds, "LightningIntervalTime", this.LightningIntervalTime)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Clouds, "LightningContinuedTime", this.LightningDuration)
    }

    Set_Wind() {
        let FHitResult = $ref(new UE.HitResult)
        this.WindDirection.K2_SetWorldRotation(new UE.Rotator(this.WindDirection.K2_GetComponentRotation().Roll, this.WindDirection.K2_GetComponentRotation().Pitch, this.WindDirectionValue), false, FHitResult, false)
        let CurMPC_Climate = UE.MaterialParameterCollection.Load("/OpenZIAPI/DynamicWeather/DynamicWeather/Materials/Climate/zengzi_MPC_DynamicWeather.zengzi_MPC_DynamicWeather")
        UE.KismetMaterialLibrary.SetVectorParameterValue(this, CurMPC_Climate, "WindDirection", UE.KismetMathLibrary.Conv_VectorToLinearColor(this.WindDirection.GetForwardVector()))
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "WindSpeed", this.WindSpeed)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "WindStrength", this.WindStrength * this.ClimateWindStrength)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "WindSwayHeight", this.VegetationWindSwayingHeight)
    }

    SetFourSeasons() {
        let CurMPC_Climate = UE.MaterialParameterCollection.Load("/OpenZIAPI/DynamicWeather/DynamicWeather/Materials/Climate/zengzi_MPC_DynamicWeather.zengzi_MPC_DynamicWeather")
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "Seasons", this.Seasons)
        UE.KismetMaterialLibrary.SetScalarParameterValue(this, CurMPC_Climate, "ColorRandom", this.SeasonalColorRandomness)
        UE.KismetMaterialLibrary.SetVectorParameterValue(this, CurMPC_Climate, "SpringColor", this.SpringPlantColor)
        UE.KismetMaterialLibrary.SetVectorParameterValue(this, CurMPC_Climate, "AutumnColor", this.AutumnPlantColor)
        UE.KismetMaterialLibrary.SetVectorParameterValue(this, CurMPC_Climate, "WinterColor", this.WinterPlantWiltColor)
        UE.KismetMaterialLibrary.SetVectorParameterValue(this, CurMPC_Climate, "WinterColorGrass", this.WinterGrassWitheredColor)
    }

    SetCloudMode() {
        if (this.SkyModel === 0) {
            this.VolumetricCloud.SetVisibility(true, false)
        } else {
            this.VolumetricCloud.SetVisibility(false, false)
        }
        if (this.SkyModel === 1) {
            this.VolumetricCloud.SetVisibility(false, false)
            this.SM_HDR_SKY.SetVisibility(false, false)
        }
        if (this.SkyModel === 2) {
            this.VolumetricCloud.SetMaterial(this.StaticCloud_MID)
            this.VolumetricCloud.SetVisibility(true, false)
        } else {
            this.VolumetricCloud.SetMaterial(this.VolumetricCloud_MID)
        }
        if (this.SkyModel === 3) {
            this.SM_HDR_SKY.SetVisibility(true, false)
            this.SkyAtmosphere.SetMieScatteringScale(0.0)
            this.SkyAtmosphere.SetRayleighScatteringScale(0.0)
        } else {
            this.SM_HDR_SKY.SetVisibility(false, false)
            this.SkyAtmosphere.SetMieScatteringScale(0.003996)
            this.SkyAtmosphere.SetRayleighScatteringScale(0.0331)
        }
        if (this.SkyModel === 4) {
            if (this.TwoD_LessCloudy_Cloudy) {
                this.SM_LessCloud.SetVisibility(false, false)
                this.SM_ManyCloud.SetVisibility(true, false)
            } else {
                this.SM_LessCloud.SetVisibility(true, false)
                this.SM_ManyCloud.SetVisibility(false, false)
            }
        } else {
            this.SM_LessCloud.SetVisibility(false, false)
            this.SM_ManyCloud.SetVisibility(false, false)
        }
    }

    SetChangeOfColoud() {
        if (this.SkyModel === 0 || this.SkyModel === 2) {
            this.SetVolmetric()
        }

        if (this.SkyModel === 3) {
            let temp = this.InternalTime + this.MoonRiseTilt
            let temptime = UE.KismetMathLibrary.Fraction(temp / 24) * 24
            let tempValue
            if (temptime < 12) {
                if (temptime < 7) {
                    tempValue = UE.KismetMathLibrary.MapRangeClamped(temptime, 5.9, 6.5, 0.0, 1.0)
                } else {
                    tempValue = UE.KismetMathLibrary.MapRangeClamped(temptime, 7, 8, 1, 2)
                }
            } else {
                if (temptime < 18) {
                    tempValue = UE.KismetMathLibrary.MapRangeClamped(temptime, 17, 17.5, 2, 3)
                } else {
                    tempValue = UE.KismetMathLibrary.MapRangeClamped(temptime, 18, 18.5, 3, 4)
                }
            }
            this.HDR_SKY_MID.SetScalarParameterValue("BP_Time", tempValue)
            this.HDR_SKY_MID.SetScalarParameterValue("HDR_360_RotationAngle", this.HDR360Rotation)
            this.HDR_SKY_MID.SetScalarParameterValue("HDR_RotationSpeed", this.HDR360RotationSpeed)
            this.HDR_SKY_MID.SetScalarParameterValue("HDR_Brightness", this.HDR_Brightness)
            this.HDR_SKY_MID.SetScalarParameterValue("Desaturation", this.HDR_Desaturation)
            this.HDR_SKY_MID.SetTextureParameterValue("T_HDR_Night", this.T_HDR_Night)
            this.HDR_SKY_MID.SetTextureParameterValue("T_HDR_Sunrise", this.T_HDR_Sunrise)
            this.HDR_SKY_MID.SetTextureParameterValue("T_HDR_Day", this.T_HDR_Day)
            this.HDR_SKY_MID.SetTextureParameterValue("T_HDR_Dusk", this.T_HDR_Dusk)
        }
    }

    Set_Climate() {
        if (UE.KismetMathLibrary.InRange_FloatFloat(this.RainIntensity, 0.01, 5, true, true)) {
            if (this.RainIntensity < 3) {
                this.Climate_CloudCoverage = UE.KismetMathLibrary.MapRangeClamped(this.RainIntensity, 0, 0.5, 1.0, 10)
                this.Climate_FogDensity = UE.KismetMathLibrary.MapRangeClamped(this.RainIntensity, 1, 2.5, 1.0, 5)
                this.ClimateWindStrength = UE.KismetMathLibrary.MapRangeClamped(this.RainIntensity, 2.5, 3, 1.0, 15)
            } else {
                this.Climate_CloudCoverage = UE.KismetMathLibrary.MapRangeClamped(this.RainIntensity, 3, 4, 10.0, 1)
                this.Climate_FogDensity = UE.KismetMathLibrary.MapRangeClamped(this.RainIntensity, 3, 4, 5.0, 1)
                this.ClimateWindStrength = UE.KismetMathLibrary.MapRangeClamped(this.RainIntensity, 3, 4, 15.0, 1)
            }
        }
        if (UE.KismetMathLibrary.InRange_FloatFloat(this.SnowIntensity, 0.01, 4.6, true, true)) {
            if (this.SnowIntensity < 2) {
                this.Climate_FogDensity = UE.KismetMathLibrary.MapRangeClamped(this.SnowIntensity, 0.5, 1.5, 1.0, 10)
                this.Climate_CloudCoverage = UE.KismetMathLibrary.MapRangeClamped(this.SnowIntensity, 0.0, 0.5, 1.0, 10)
            } else {
                this.Climate_FogDensity = UE.KismetMathLibrary.MapRangeClamped(this.SnowIntensity, 2, 3, 10.0, 1)
                this.Climate_CloudCoverage = UE.KismetMathLibrary.MapRangeClamped(this.SnowIntensity, 2, 3, 10.0, 1)
            }
        }

        if (UE.KismetMathLibrary.InRange_FloatFloat(this.RainIntensity, 0.01, 5, true, true) || UE.KismetMathLibrary.InRange_FloatFloat(this.SnowIntensity, 0.01, 4.6, true, true)) {
            let FHitResult = $ref(new UE.HitResult)
            UE.GameplayStatics.GetPlayerPawn(this, 0).K2_GetActorLocation()
            this.SceneCaptureComponent2D.K2_SetWorldLocation(new UE.Vector(UE.GameplayStatics.GetPlayerPawn(this, 0).K2_GetActorLocation().X, UE.GameplayStatics.GetPlayerPawn(this, 0).K2_GetActorLocation().Y, UE.GameplayStatics.GetPlayerPawn(this, 0).K2_GetActorLocation().Z + 3000), false, FHitResult, false)
            let CurMPC_Climate = UE.MaterialParameterCollection.Load("/OpenZIAPI/DynamicWeather/DynamicWeather/Materials/Climate/zengzi_MPC_DynamicWeather.zengzi_MPC_DynamicWeather")
            UE.KismetMaterialLibrary.SetVectorParameterValue(this, CurMPC_Climate, "Pos", UE.KismetMathLibrary.Conv_VectorToLinearColor(this.SceneCaptureComponent2D.K2_GetComponentLocation()))
            UE.KismetMaterialLibrary.SetVectorParameterValue(this, CurMPC_Climate, "AT", UE.KismetMathLibrary.Conv_VectorToLinearColor(UE.KismetMathLibrary.Add_VectorVector(this.SceneCaptureComponent2D.K2_GetComponentLocation(), UE.KismetMathLibrary.GetForwardVector(this.SceneCaptureComponent2D.K2_GetComponentRotation()))))
            UE.KismetMaterialLibrary.SetVectorParameterValue(this, CurMPC_Climate, "Up", UE.KismetMathLibrary.Conv_VectorToLinearColor(UE.KismetMathLibrary.GetUpVector(this.SceneCaptureComponent2D.K2_GetComponentRotation())))
        }
    }
}
