const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPopLayer extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    onLoad () {}

    start () {

    }

    // update (dt) {}
}
