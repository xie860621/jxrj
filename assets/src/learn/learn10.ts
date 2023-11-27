import CircleComponent from "../component/circle_component";
import LineComponent from "../component/line_component";
import Parallelogram from "../component/parallelogram_component";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec3 = new cc.Vec3
@ccclass
export default class Learn10 extends LearnBase {
    @property(TriangleComponent)
    triangle: TriangleComponent;
    @property(CircleComponent)
    circle: CircleComponent;

    // update (dt) {}

    @property(cc.Node)
    pointP: cc.Node;

    init () {
        this.updatePpoint(this.getNodeWorldPosition(this.pointP))

        // cc.Vec3.add(_tempVec3, this.triangle.B.position, this.triangle.C.position)
        // _tempVec3.multiplyScalar(0.1);
        // this.updatePpoint(_tempVec3);
    }

    updatePpoint (position) {
        _tempVec3 = this.node.convertToNodeSpaceAR(position);
        _tempVec3.x = 0;

        this.pointP.position = _tempVec3;

        let pos = this.circle.node.convertToNodeSpaceAR(this.getNodeWorldPosition(this.pointP));
        this.circle.pointP.setPosition(pos);
    }

    onTouchMove (event: cc.Event.EventTouch): void {
        if (event.target != this.pointP) {
            return;
        }
        this.updatePpoint(event.getLocation());

        this.sendUpdateDraw();
    }

}
