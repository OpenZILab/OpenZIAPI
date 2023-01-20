///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by Mixzy.
/// DateTime: 2022/12/08 18:37
///

import { BaseModel } from "../../../System/API/Model/BaseModel"

export class SceneViewingModel extends BaseModel {
    constructor()
    {
        super()
        this.DefaultData = {
            id: "SceneViewing_id",
            GISType: 0,
            pointsInfoList: [
                {
                    "coordinates":{X: 104.06168732191, Y: 30.643138179075, Z: 1.5},
                    "lensRotation":{X: 0, Y: 0, Z: 0},
                    "point_type":0,
                    "arriveTangent":{X: 0, Y: 0, Z: 0},
                    "leaveTangent":{X: 0, Y: 0, Z: 0}
                },
                {
                    "coordinates":{X: 104.06168732191, Y: 30.643138179075, Z: 1.5},
                    "lensRotation":{X: 0, Y: 0, Z: 0},
                    "point_type":0,
                    "arriveTangent":{X: 0, Y: 0, Z: 0},
                    "leaveTangent":{X: 0, Y: 0, Z: 0}
                },
                {
                    "coordinates":{X: 104.06168732191, Y: 30.643138179075, Z: 1.5},
                    "lensRotation":{X: 0, Y: 0, Z: 0},
                    "point_type":0,
                    "arriveTangent":{X: 0, Y: 0, Z: 0},
                    "leaveTangent":{X: 0, Y: 0, Z: 0}
                },
                {
                    "coordinates":{X: 104.06168732191, Y: 30.643138179075, Z: 1.5},
                    "lensRotation":{X: 0, Y: 0, Z: 0},
                    "point_type":0,
                    "arriveTangent":{X: 0, Y: 0, Z: 0},
                    "leaveTangent":{X: 0, Y: 0, Z: 0}
                }
            ],
            speed: 2000,
            isUsedPointsInfo: false,    //是否使用给定的点位信息，如果为否，则自定义在场景中添加点
            isUsedLensRotation: false,  //是否使用镜头旋转设置漫游视角
            defaultPointsType: 0,   //手动添加点时，生成样条线使用的type
            isLoopPlay: false,    //是否循环播放
            isEndToEnd: false,      //是否首尾相连
            isShowPointCamera: false,  //是否显示点的相机物体
            isShowSplineMesh: false,   //是否显示样条线的Mesh
            isPlaying: false   //是否生成马上开始播放
        }
        this.DefaultDataRange = {}
    }
}