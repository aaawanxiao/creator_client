import UIController from '../../../framework/uibase/UIController';
import EventManager from '../../../framework/manager/EventManager';
import { Cmd, CmdName } from "../../../framework/protocol/GameHoodleProto";
import Response from '../../../framework/protocol/Response';
import SceneManager from '../../../framework/manager/SceneManager';
import UserInfo from '../../../framework/common/UserInfo';
import GameScene from '../gameScene/GameScene';
import DialogManager from '../../../framework/manager/DialogManager';
import LobbyScene from './LobbyScene';
import LobbySendGameHoodleMsg from './sendMsg/LobbySendGameHoodle';
import RoomData from '../../common/RoomData';
import WeChatLogin from '../../../framework/utils/WeChatLogin';

const {ccclass, property} = cc._decorator;

@ccclass
export default class LobbySceneRecvGameHoodleMsg extends UIController {

    onLoad () {
        super.onLoad()
    }

    start () {
        this.add_event_dispatcher()
    }

    add_event_dispatcher(){
        EventManager.on(CmdName[Cmd.eLoginLogicRes], this, this.on_event_login_logic)
        EventManager.on(CmdName[Cmd.eCreateRoomRes], this, this.on_event_create_room)
        EventManager.on(CmdName[Cmd.eJoinRoomRes], this, this.on_event_join_room)
        EventManager.on(CmdName[Cmd.eExitRoomRes], this, this.on_event_exit_room)
        EventManager.on(CmdName[Cmd.eDessolveRes], this, this.on_event_dessolve_room)
        EventManager.on(CmdName[Cmd.eGetRoomStatusReq], this, this.on_event_get_room_status)
        EventManager.on(CmdName[Cmd.eBackRoomRes], this, this.on_event_back_room)
        EventManager.on(CmdName[Cmd.eUserMatchRes], this, this.on_event_match)
        EventManager.on(CmdName[Cmd.eUserStopMatchRes], this, this.on_event_match_stop)
        EventManager.on(CmdName[Cmd.eUserGameInfoRes], this, this.on_event_ugame_info)
    }

    on_event_login_logic(event:cc.Event.EventCustom){
        let udata =  event.getUserData()
        console.log("hcc>>Lobbyscene>>on_event_login_logic",udata)
        if(udata){
            if(udata.status == Response.OK){
                LobbySendGameHoodleMsg.send_get_room_status();
                LobbySendGameHoodleMsg.send_get_ugame_info();
                LobbySendGameHoodleMsg.send_get_uball_info();
                DialogManager.getInstance().show_weak_hint("登录游戏服务成功!")
            }
        }
    }

    on_event_create_room(event:cc.Event.EventCustom){
        let udata =  event.getUserData()
        console.log("on_event_create_room",udata)
        if(udata){
            let status = udata.status
            if(status == Response.OK){
                SceneManager.getInstance().enter_scene_asyc(new GameScene())
                DialogManager.getInstance().show_weak_hint("房间创建成功!")
            }else{
                DialogManager.getInstance().show_weak_hint("房间创建失败!")
            }
        }
    }

    on_event_join_room(event:cc.Event.EventCustom){
        let udata =  event.getUserData()
        console.log("on_event_join_room",udata)
        if(udata){
            let status = udata.status
            if(status == Response.OK){
                SceneManager.getInstance().enter_scene_asyc(new GameScene())
                DialogManager.getInstance().show_weak_hint("加入房间成功!")
            }else{
                DialogManager.getInstance().show_weak_hint("加入房间失败!")
            }
        }
        RoomData.getInstance().set_share_roomid("");
    }

    on_event_exit_room(event:cc.Event.EventCustom){
        let udata =  event.getUserData()
        console.log("on_event_exit_room",udata)
        if(udata){
            let status = udata.status
            if(status == Response.OK){
                SceneManager.getInstance().enter_scene_asyc(new LobbyScene())
                RoomData.getInstance().clear_room_data();
                DialogManager.getInstance().show_weak_hint("退出房间成功!")
            }else{
                DialogManager.getInstance().show_weak_hint("退出房间失败!")
            }
        }
    }

    on_event_dessolve_room(event:cc.Event.EventCustom){
        let udata =  event.getUserData()
        console.log("on_event_dessolve_room",udata)
        if(udata){
            let status = udata.status
            if(status == Response.OK){
                SceneManager.getInstance().enter_scene_asyc(new LobbyScene())
                RoomData.getInstance().clear_room_data();
                DialogManager.getInstance().show_weak_hint("解散房间成功!")
            }else{
                DialogManager.getInstance().show_weak_hint("解散房间失败!")
            }
        }
    }

    on_event_get_room_status(event:cc.Event.EventCustom){
        let udata =  event.getUserData()
        console.log("on_event_get_room_status",udata)
        if(udata){
            let status = udata.status
            if(status == Response.OK){
                
            }else{

            }
        }
    }

    on_event_back_room(event:cc.Event.EventCustom){
        let udata =  event.getUserData()
        console.log("on_event_back_room",udata)
        if(udata){
            let status = udata.status
            if(status == Response.OK){
                SceneManager.getInstance().enter_scene_asyc(new GameScene())
                DialogManager.getInstance().show_weak_hint("返回房间成功!")
            }else{
                DialogManager.getInstance().show_weak_hint("返回房间失败!")
            }
        }
    }

    on_event_match(event: cc.Event.EventCustom){
        let udata =  event.getUserData()
        console.log("on_event_match",udata)
        if(udata){
            let status = udata.status
            if(status == Response.OK){
                let matchsuccess = udata.matchsuccess;
                if(matchsuccess == true){
                    DialogManager.getInstance().show_weak_hint("匹配完成!")
                    this.scheduleOnce(function(dt:number){
                        DialogManager.getInstance().close_dialog("MatchDialog");
                        SceneManager.getInstance().enter_scene_asyc(new GameScene())
                    },1.0)
                }else{
                    // DialogManager.getInstance().show_weak_hint("正在匹配中。。。。。")
                }
                let userinfo = udata.userinfo;
                if(!matchsuccess && userinfo){
                    let matchDialog = DialogManager.getInstance().get_dialog("MatchDialog");
                    if (matchDialog && cc.isValid(matchDialog)){
                        let script = matchDialog.getComponent("MatchDialog");
                        if (script) {
                            script.show_math_user_info(userinfo);
                        }
                    }else{
                        DialogManager.getInstance().show_dialog_asyc("ui_prefabs/dialog/DialogMatch","MatchDialog",function(resNode:cc.Node){
                            if(resNode && cc.isValid(resNode)){
                                let script = resNode.getComponent("MatchDialog");
                                if(script){
                                    script.show_math_user_info(userinfo);
                                }
                            }
                        })
                    }
                }
            }else if(status == Response.NOT_YOUR_TURN){
                DialogManager.getInstance().show_weak_hint("请稍等候，正在匹配中。。。。")
            }else{
                DialogManager.getInstance().show_weak_hint("匹配失败!")
            }
        }
    }

    on_event_match_stop(event: cc.Event.EventCustom){
        let udata =  event.getUserData()
        console.log("on_event_match_stop",udata)
        if(udata){
            let status = udata.status
            if(status == Response.OK){
                DialogManager.getInstance().show_weak_hint("取消匹配!")
            }else{
                DialogManager.getInstance().show_weak_hint("取消失败!")
            }
        }
    }

    on_event_ugame_info(event: cc.Event.EventCustom){
        let udata =  event.getUserData()
        console.log("on_event_ugame_info",udata)
        if(udata){
            let status = udata.status
            if(status == Response.OK){
                let ugame_info = JSON.parse(udata.userinfostring);
                UserInfo.set_ugame_info(ugame_info);
                let lobyShowUI = this.get_script("LobbySceneShowUI")
                if(lobyShowUI){
                    lobyShowUI.show_user_info();
                }
            }
        }
    }

}
