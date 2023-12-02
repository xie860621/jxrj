import CircleComponent from "../component/circle_component";
import LineComponent from "../component/line_component";
import Parallelogram from "../component/parallelogram_component";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec3 = new cc.Vec3
@ccclass
export default class Learn22 extends LearnBase {
    @property(TriangleComponent)
    triangle: TriangleComponent;
    @property(TriangleComponent)
    triangle1: TriangleComponent;

    @property(cc.Node)
    pointP: cc.Node;

    init () {
        this.triangle.init();
        this.updateTriangle(this.getNodeWorldPosition(this.pointP));
    }

    updateTriangle (position) {
        let width = 300;
        position = this.pointP.parent.convertToNodeSpaceAR(position);
        position.y = 0;
        position.x = cc.misc.clampf(position.x, -width, width);

        this.pointP.position = position;

        let skew = (this.pointP.position.x) / width;
        skew = cc.misc.clampf(skew, -1, 1);

        _tempVec3 = this.triangle.A.position;
        _tempVec3.x = (skew - 1) * width - skew * _tempVec3.x; // 400
        this.triangle1.A.position = _tempVec3;

        _tempVec3 = this.triangle.C.position;
        _tempVec3.x = (skew - 1) * width - skew * _tempVec3.x
        this.triangle1.C.position = _tempVec3;

        _tempVec3 = this.triangle.B.position;
        _tempVec3.x = (skew - 1) * width - skew * _tempVec3.x
        this.triangle1.B.position = _tempVec3;
    }

    onTouchMove (event: cc.Event.EventTouch): void {
        if (event.target == this.pointP) {
            this.updateTriangle(event.getLocation());

        } else {
            this.updateTriangle(this.getNodeWorldPosition(this.pointP));
            this.updateBase();
        }
        this.sendUpdateDraw()
    }

    updateBase () {

    }

}
