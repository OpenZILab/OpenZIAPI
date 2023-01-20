///
/// Copyright by Cengzi Technology Co., Ltd. All Rights Reserved.  Office Website : www.openzi.com || www.cengzi.com 成都曾自科技版权所有 保留所有权利
/// Created by behiever.
/// DateTime: 2022/9/20 2:40
///

import {Sigleton} from "../../Core/Sigleton";
import * as UE from "ue";
import {MessageQueueList} from "../../Core/NetWork/MessageQueue"
import {MessageType} from "../../Core/NetWork/MessageProcesser"
import {Timer} from "../../Core/Timer";

export class WebSocketServer extends Sigleton {

    static GetInstance(): WebSocketServer {
        return super.TakeInstance(WebSocketServer);
    }

    private SocketInstance: any
    static ListenMessageId: number

    public StartServer(url){
        this.SocketInstance = UE.WebSocketFunctionLibrary.CreateWebSocket(url,"ws")
        this.SocketInstance.Connect()
        this.SocketInstance.OnWebSocketConnected.Add(this.OnWebSocketOpened)
        this.SocketInstance.OnWebSocketMessageReceived.Add(this.OnWebSocketMessageReceived)
        this.SocketInstance.OnWebSocketClosed.Add(this.OnWebSocketClosed)
        this.SocketInstance.OnWebSocketMessageSent.Add(this.OnWebSocketMessageSent)
    }

    public CloseServer(code,reason){
        this.OnWebSocketClosed(code,reason)
    }

    public OnWebSocketOpened(){
        WebSocketServer.ListenMessageId = Timer.GetInstance().AddTimer(0.1,WebSocketServer.ListenWaitCallBack,true,"")
    }

    public OnWebSocketMessageReceived(message){
        MessageQueueList.GetInstance().AddMessage(MessageType.API,message,0)
    }

    public OnSendWebMessage(message){
        this.SocketInstance.SendMessage(message)
    }

    public OnWebSocketClosed(code,reason){
        this.SocketInstance.Close(code,reason)
        console.warn("OnWebSocketClosed")
    }

    public OnWebSocketMessageSent(message){
        console.warn("OnWebSocketMessageSent" + " " + message)
    }

    public OnSendListenerMessage(message){
        let result = new Map()
        result["data"] = message
        result["callback"] = "GlobalEventCallBack"
        let listenMessage = JSON.stringify(result)
        this.SocketInstance.SendMessage(listenMessage)
    }

    static ListenWaitCallBack(message){
        WebSocketServer.GetInstance().OnSendListenerMessage("OnWebSocketOpened")
        Timer.GetInstance().DelTimer(WebSocketServer.ListenMessageId)
    }
}