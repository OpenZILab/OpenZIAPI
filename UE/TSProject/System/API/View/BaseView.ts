///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.
/// DateTime: 2022/9/26 10:45
///

import * as UE from "ue"
import {blueprint} from 'puerts';

//@no-blueprint
declare module "ue" {
    interface Object {
        CreateDefaultSubobjectGeneric<T extends UE.Object>(SubobjectFName: string, ReturnType: UE.Class): T
    }
}

UE.Object.prototype.CreateDefaultSubobjectGeneric = function CreateDefaultSubobjectGeneric<T extends UE.Object>(SubobjectFName: string, ReturnType: UE.Class): T {
    return this.CreateDefaultSubobject(SubobjectFName, ReturnType, ReturnType, /*bIsRequired =*/ true, /*bIsAbstract =*/ false, /*bTransient =*/ false) as T;
}

//@blueprint
export function GenClass<T extends typeof UE.Object>(path:string):T{
    let ucls = UE.Class.Load(path);
    const BluePrint = blueprint.tojs<T>(ucls);
    return BluePrint
}

//@C++
export class BaseView extends UE.Actor{
    //@virtual 
    RefreshView(jsonData):string {
        return "current View not Implementation BaseVeiw"
    }
}


