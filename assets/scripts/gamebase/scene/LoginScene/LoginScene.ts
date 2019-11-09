import UIFunction from '../../../framework/common/UIFunciton';
import BaseScene from '../../../framework/uibase/BaseScene';

export default class LoginScene extends BaseScene {

    constructor(){
        super();
        this._prefab_name   = "ui_prefabs/LoginUI"
        this._script_name   = "LoginSceneCtrl"
        this._scene_name    = "LoginScene";
    }

    async preload(process_callfunc:Function, finished_callfunc:Function){
        
    }

    async enter(){
        this._scene_ui = await UIFunction.getInstance().add_prefab_to_scene_async(this._prefab_name,this._script_name);
    }

    destroy(is_release_res:boolean){
        if(this._scene_ui){
            this._scene_ui.destroy()
        }

        if(is_release_res){
            
        }
    }

}
