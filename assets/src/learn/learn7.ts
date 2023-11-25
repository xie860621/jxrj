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

    @property(cc.Node)
    pointD: cc.Node;

    init () {
        this.triangle.A.getPosition(_tempVec3);
        _tempVec3.multiplyScalar(0.5);
        this.pointD.position = _tempVec3;
    }

    updateDraw (drawHelper: DrawHelper): void {
        // c D
        let vertexs = [this.triangle.CPosition, this.getNodeWorldPosition(this.pointD)];
        drawHelper.drawVertexs(vertexs);
    }
    // update (dt) {}
}
