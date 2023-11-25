import CircleComponent from "../component/circle_component";
import LineComponent from "../component/line_component";
import Parallelogram from "../component/parallelogram_component";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec3 = new cc.Vec3
@ccclass
export default class Learn8 extends LearnBase {
    @property(LineComponent)
    line: LineComponent;

    @property(CircleComponent)
    circleA: CircleComponent;

    @property(CircleComponent)
    circleB: CircleComponent;

    init () {
        this.line.getLinePosition(this.circleA.node.position, _tempVec3);
        this.circleA.node.setPosition(_tempVec3);

        this.line.getLinePosition(this.circleB.node.position, _tempVec3);
        this.circleB.node.setPosition(_tempVec3);
    }

    onTouchMove (event: cc.Event.EventTouch): void {
        // super.onTouchMove(event);

        let node = event.target as cc.Node;
        let position = node.parent.convertToNodeSpaceAR(event.getLocation())
        this.line.getLinePosition(position, _tempVec3);
        node.setPosition(_tempVec3);

        this.sendUpdateDraw();
    }



    // update (dt) {}
}
