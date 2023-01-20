import * as UE from "ue";
import {blueprint} from "puerts";

/**
 * 针对 Unreal 蓝图类执行Mixin，可以覆写其蓝图、cpp函数和事件
 *     class MyTsBlueprint { Add(a:number, b:number){ return a-b; } }
 *     Execute_BlueprintMixin("/Game/BlueprintMixin.BlueprintMixin_C", MyTsBlueprint)
 * @param blueprintPath
 * @param mixinMethods
 * @constructor
 */
export function Execute_BlueprintMixin<T extends typeof UE.Object, R extends InstanceType<T>>(blueprintPath: string, mixinMethods: new (...args: any) => R): void {
    let BlueprintClass = UE.Class.Load(blueprintPath);
    const toJsClass = blueprint.tojs<T>(BlueprintClass)
    blueprint.mixin<T, R>(toJsClass, mixinMethods)
    /**
     *         function mixin<T extends typeof Object, R extends InstanceType<T>>(to:T, mixinMethods:new (...args: any) => R, config?: MixinConfig) : {
     *             new (Outer?: Object, Name?: string, ObjectFlags?: number) : R;
     *             StaticClass(): Class;
     *         };
     */
}

/**
 * 针对 Unreal Cpp 执行Mixin，可以覆写其cpp函数
 *      class MyTsObject { Add(a:number, b:number){ return a-b; } }
 *      Execute_CppMixin(UE.MyObject, MyTsObject);
 * @param cppClass
 * @param mixinMethods
 * @constructor
 */
export function Execute_CppMixin<T extends typeof UE.Object, R extends InstanceType<T>>(cppClass: T, mixinMethods: new (...args: any) => R): void {
    blueprint.mixin<T, R>(cppClass, mixinMethods)
    /**
     *         function mixin<T extends typeof Object, R extends InstanceType<T>>(to:T, mixinMethods:new (...args: any) => R, config?: MixinConfig) : {
     *             new (Outer?: Object, Name?: string, ObjectFlags?: number) : R;
     *             StaticClass(): Class;
     *         };
     */
}
