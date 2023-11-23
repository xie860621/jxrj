// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import EditLabelComponent from "../component/edit_label_component";
import TouchPanel from "../component/touch_panel";
import DrawHelper from "../draw_helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LearnBase extends TouchPanel {
    @property(String)
    learnTitle: string = "";
    @property(Boolean)
    set save (value) {
        if (value) {
            let info = this.getInfo();
            cc.sys.localStorage.setItem('learn' + this.learnTitle, JSON.stringify(info));
            cc.log("保存成功");
        }
    }

    get save () {
        return false;
    }

    @property(Boolean)
    set load (value) {
        if (value) {
            let str = cc.sys.localStorage.getItem('learn' + this.learnTitle);
            if (str) {
                try {
                    let info = JSON.parse(str);
                    this.setInfo(info);

                    cc.log("读取成功");
                    setTimeout(() => {
                        this.node.dispatchEvent(new cc.Event.EventCustom('UpdateDraw', true));
                    });
                } catch (error) {

                }
            }
        }
    }

    get load () {
        return false;
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    updateDraw (drawHelper: DrawHelper) {

    }

    getInfo () {
        let comps = this.getComponentsInChildren(EditLabelComponent);
        let info: any = {};
        info.labels = {};
        comps.forEach((com) => {
            let label = com.node.getChildByName("label").getComponent(cc.Label);
            info.labels[label.uuid] = label.string;
        });
        return info;
    }

    setInfo (info) {
        let comps = this.getComponentsInChildren(EditLabelComponent);
        comps.forEach((com) => {
            let label = com.node.getChildByName("label").getComponent(cc.Label);
            if (info.labels.hasOwnProperty(label.uuid)) {
                label.string = info.labels[label.uuid]
            }
        });
    }
    getNodeWorldPosition (node: cc.Node) {
        return node.convertToWorldSpaceAR(cc.Vec2.ZERO)
    }
    // update (dt) {}
}
