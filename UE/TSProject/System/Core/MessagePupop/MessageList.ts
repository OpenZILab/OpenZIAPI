///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by xLin.,
/// DateTime:  2022/12/07
///

const MessageTips_cn = {
    SCENE_MESSAGE: {
        CREATE_SCENE:"请输入一个场景名字",
        CREATE_SCENE_FILE: "创建场景失败,当前场景已经存在",
        RENAME_SCENE:"请输入一个新场景名字",
        RENAME_SCENE_FILE: "重命名失败,当前命名已经存在",
        DELETE_SCENE: "删除场景后将无法还原,你确定要删除当前场景吗?",
    },
    OUTLINE_MESSAGE: {

    },
    DETAIL_MESSAGE: {},
    TEST_MESSAGE:{
        NOTIFICATION:"消息弹出框测试"
    },
    OPERATION_MESSAGE:{
        NOTIFICATION:"操作消息提示"
    },
    DIGITALTWIN:{
        CREATE_TIMELINE:"请输入一个时间线",
        CREATE_TWIN:"请输入一个数字孪生体名字"
    },
    PREFAB:{
        CREATE_PREFAB:"请输入一个预制体名称"
    }
}   

const MessageTips_en = {
    SCENE_MESSAGE: {
        CREATE_SCENE:"Please enter a new scene name",
        CREATE_SCENE_FILE: "Description Failed to create a scenario because the current scenario already exists",
        RENAME_SCENE:"Please enter a scene name",
        RENAME_SCENE_FILE: "Failed to rename. The current name already exists. Procedure",
        DELETE_SCENE: "Deleted scenes will not be restored. Are you sure you want to delete the current scene",

    },
    OUTLINE_MESSAGE: {

    },
    DETAIL_MESSAGE: {},
    TEST_MESSAGE:{
        NOTIFICATION:"Message pop-up test"
    },
    OPERATION_MESSAGE:{
        NOTIFICATION:"Operation message prompt"
    },
    DIGITALTWIN:{
        CREATE_TIMELINE:"Please enter a timeline",
        CREATE_TWIN: "Please enter a new digital twin name"
    },
    PREFAB:{
        CREATE_PREFAB:"Please enter a prefab name"
    }
}

export enum language {
    cn,
    en
}

export let MessageTips = MessageTips_cn

export function SetMessageLanguage(lan: language) {
    if (lan == language.cn) {
        MessageTips = MessageTips_cn
    } else if (lan == language.en) {
        MessageTips = MessageTips_en
    }
}