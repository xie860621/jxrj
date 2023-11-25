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
        this._radius = this.pointP.position.len();

        drawHelper.drawCircle(this.getNodeWorldPosition(this.node), this._radius);
    }
}