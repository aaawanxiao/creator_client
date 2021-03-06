import { WSocket, ISocket, SocketState } from './Socket';
import ProtoTools from './ProtoTools';
import ProtoManater from '../manager/ProtoManager';
import EventManager from '../manager/EventManager';
import ProtoCmd from '../protocol/ProtoCmd';
import { Stype,StypeName } from '../protocol/Stype';
import EventDefine from '../config/EventDefine';
import GameAppConfig from '../config/GameAppConfig';

export interface ISocketDelegate {
    on_socket_open();
    on_socket_message(data:string | ArrayBuffer);
    on_socket_error(errMsg:any);
    on_socket_closed(msg:any);
    get_socket_state();
}

export class SocketDelegate implements ISocketDelegate {
    private _socket: ISocket;

    ///////////////////////////////////
    on_socket_open(){
        EventManager.emit(EventDefine.EVENT_NET_CONNECTED);
    }

    on_socket_message(data:string | ArrayBuffer){
        let decode_cmd = ProtoManater.decode_cmd(GameAppConfig.PROTO_TYPE,data)
        if(!decode_cmd){
            return
        }
        let cmd_name = ProtoCmd.getCmdName(decode_cmd.stype, decode_cmd.ctype)

        console.log("\n\n###########################>>>recvstart")
        if (cmd_name){
            console.log("Svr:", StypeName[decode_cmd.stype], ",xyname:", cmd_name, ",xyid:", decode_cmd.ctype);
            let cmdbody = ""
            try {
                cmdbody = JSON.stringify(decode_cmd.body)    
            } catch (error) {
            }
            console.log(cmdbody)
        }
        console.log("###########################>>>recvend\n\n")
        if (cmd_name) {
            EventManager.emit(cmd_name, decode_cmd.body)
        }
    }

    on_socket_error(errMsg:any){
        EventManager.emit(EventDefine.EVENT_NET_ERROR);
    }

    on_socket_closed(msg:any){
        if (this._socket) {
            this._socket.close();
        }
        this._socket = null;
        EventManager.emit(EventDefine.EVENT_NET_CLOSED);
    }

    ///////////////////////////////////
    connect(url: string) {
        console.log("socket is connecting address:", url)
        this._socket = new WSocket(url, this);
        this._socket.connect();
    }

    close_connect() {
        if (this._socket) {
            this._socket.close();
        }
    }

    get_socket_state(){
        if(this._socket){
            return this._socket.get_state()
        }
        return SocketState.CLOSED
    }

    send_msg(stype:number, ctype:number, body?:any){
        if(!this._socket || this._socket.get_state() != SocketState.OPEN){
            return
        }
        let encode_msg = ProtoManater.encode_cmd(stype,ctype,GameAppConfig.PROTO_TYPE,body)
        if(encode_msg){
            this._socket.send(encode_msg)
        }
    }
}