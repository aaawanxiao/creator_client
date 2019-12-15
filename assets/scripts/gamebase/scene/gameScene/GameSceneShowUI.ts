import UIController from '../../../framework/uibase/UIController';
import GameSendGameHoodleMsg from './sendMsg/GameSendGameHoodle';
import UserInfo from '../../../framework/common/UserInfo';
import { UserState } from '../../common/State';
import RoomData from '../../common/RoomData';

const {ccclass, property} = cc._decorator;

let HEAD_PATH = "lobby/rectheader/1";
let MAX_PLAYER = 4;

@ccclass
export default class GameSceneShowUI extends UIController {

    onLoad () {
        super.onLoad()
    }

    start () {
        this.initUI()
    }

    initUI(){
       this.set_all_player_head_visible(false);
       this.set_all_player_ready_visible(false);
    }

    show_user_info(udata:any){
        this.set_all_player_head_visible(false)
        if(udata.userinfo){
            udata.userinfo.forEach(value => {
                let numberid = value.numberid;
                let infostr = value.userInfoString;
                let infoObj = JSON.parse(infostr);
                let seatid = infoObj.seatid;
                if(seatid){
                    let headNodeStr = "KW_PANEL_USER_INFO_" + seatid;
                    this.update_one_user_info(this.view[headNodeStr],infoObj);
                }
            });
        }
    }

    update_one_user_info(info_node:cc.Node,infoObj:any){
        if(!cc.isValid(info_node)){
            return;
        }

        this.set_visible(info_node, true)
        this.set_string(info_node.getChildByName("KW_TEXT_NAME"),infoObj.unick)
        let ufaceImg = HEAD_PATH + infoObj.uface;
        this.set_sprite_asyc(info_node.getChildByName("KW_IMG_HEAD"),ufaceImg)
        this.set_visible(info_node.getChildByName("KW_IMG_OFFINLE"), infoObj.isoffline)
        this.set_visible(info_node.getChildByName("KW_IMG_MASTER"), infoObj.ishost == true) // 房主
        this.set_visible(info_node.getChildByName("KW_IMG_READY"), infoObj.userstate == UserState.Ready);
        if(infoObj.seatid == RoomData.getInstance().get_self_seatid()){
            let userstate = infoObj.userstate
            if(userstate == UserState.Ready || userstate == UserState.Playing){
                this.set_visible(this.view["KW_BTN_READY"], false);
            }
        }
    }

    set_all_player_head_visible(visible:boolean){
        for(let i = 1; i <= MAX_PLAYER; i++){
            let viewstr = "KW_PANEL_USER_INFO_" + i;
            this.set_visible(this.view[viewstr], visible)
        }
    }

    set_all_player_ready_visible(visible:boolean){
        for(let seatid = 1; seatid <= MAX_PLAYER; seatid++){
            let headNodeStr = "KW_PANEL_USER_INFO_" + seatid;
            let headNode = this.view[headNodeStr];
            if(headNode){
                this.set_visible(headNode.getChildByName("KW_IMG_READY"),visible);
            }
        }
    }

    set_user_ready(seatid:number){
        let headNodeStr = "KW_PANEL_USER_INFO_" + seatid;
        let headNode = this.view[headNodeStr];
        if(headNode){
            this.set_visible(headNode.getChildByName("KW_IMG_READY"),true);
        }

        if(seatid == RoomData.getInstance().get_self_seatid()){
            this.set_visible(this.view["KW_BTN_READY"], false);           
        }
    }

}