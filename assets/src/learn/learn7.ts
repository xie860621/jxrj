import CircleComponent from "../component/circle_component";
import Parallelogram from "../component/parallelogram_component";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec3 = new cc.Vec3
@ccclass
export default class Learn7 extends LearnBase {
    @property(TriangleComponent)
    triangle: TriangleComponent;
    @property(CircleComponent)
    circle: CircleComponent;

    @property(cc.Node)
    pointD: cc.Node;

    @property(cc.Node)
    pointP: cc.Node;

    init () {
        this.triangle.A.getPosition(_tempVec3);
        _tempVec3.multiplyScalar(0.5);
        this.pointD.position = _tempVec3;

        this.updatePpoint(this.getNodeWorldPosition(this.pointP))

        // cc.Vec3.add(_tempVec3, this.triangle.B.position, this.triangle.C.position)
        // _tempVec3.multiplyScalar(0.1);
        // this.updatePpoint(_tempVec3);
    }

    updatePpoint (position) {
        _tempVec3 = this.node.convertToNodeSpaceAR(position);

        _tempVec3.x = 0;

        this.pointP.position = _tempVec3;

        this.circle.pointP.position = this.pointP.position;
    }

    onTouchMove (event: cc.Event.EventTouch): void {
        if (event.target != this.pointP) {
            return;
        }
        this.updatePpoint(event.getLocation());

        this.sendUpdateDraw();
    }

    updateDraw (drawHelper: DrawHelper): void {
        // c D
        let vertexs = [this.triangle.CPosition, this.getNodeWorldPosition(this.pointD)];
        drawHelper.drawVertexs(vertexs);
    }
    // update (dt) {}
}
