import DrawHelper from "../draw_helper";
import { GlobalValue } from "../global";
import TouchPanel from "./touch_panel";

let _tempVec3 = new cc.Vec3;
const { ccclass, property } = cc._decorator;

@ccclass
export default class CircleComponent extends TouchPanel {
    @property(cc.Node)
    pointP: cc.Node = null;

    _radius: number = 0;

    updateDraw (drawHelper: DrawHelper): void {
        cc.Vec3.subtract(_tempVec3, this.pointP.position, this.node.position)
        this._radius = _tempVec3.len();

        drawHelper.drawCicle(this.getNodeWorldPosition(this.node), this._radius);
    }
}