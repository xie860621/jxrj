
import TouchPanel from "../component/touch_panel";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec2 = new cc.Vec2;

@ccclass
export default class Learn18 extends LearnBase {
    @property(cc.Node)
    pointF: cc.Node

    @property(TriangleComponent)
    triangle: TriangleComponent;

    updateDraw (drawHelper: DrawHelper): void {
        if (this.pointF.x > this.triangle.C.x) {
            this.pointF.active = false;
        } else {
            this.pointF.active = true;
        }
    }

}
