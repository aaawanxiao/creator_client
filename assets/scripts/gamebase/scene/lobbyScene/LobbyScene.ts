import UIFunction from '../../../framework/common/UIFunciton';
import BaseScene from '../../../framework/uibase/BaseScene';

export default class LobbyScene extends BaseScene {

    constructor(){
        super();
        this._prefab_name   = "ui_prefabs/lobby/LobbyUI"
        this._script_name   = "LobbySceneCtrl"
        this._scene_name    = "LobbyScene";
    }

    async enter(){
        this._scene_ui = UIFunction.getInstance().add_prefab_to_scene_async(this._prefab_name,this._script_name);
    }

    destroy(is_release_res:boolean){
        if(this._scene_ui){
            this._scene_ui.destroy()
        }
    }
}