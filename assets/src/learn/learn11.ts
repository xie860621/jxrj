import CircleComponent from "../component/circle_component";
import LineComponent from "../component/line_component";
import Parallelogram from "../component/parallelogram_component";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec3 = new cc.Vec3
@ccclass
export default class Learn11 extends LearnBase {
    @property(cc.Node)
    pointP: cc.Node;

    @property(LineComponent)
    line: LineComponent;

    @property(CircleComponent)
    circleA: CircleComponent;
    // update (dt) {}

    init (): void {
        super.init();
        this.updatePointP(this.pointP.position);
    }

    updateCircles () {
        let world = this.getNodeWorldPosition(this.pointP)
        this.circleA.pointP.setPosition(this.circleA.node.convertToNodeSpaceAR(world));
    }

    onTouchMove (event: cc.Event.EventTouch): void {
        // super.onTouchMove(event);
        if (event.target == this.pointP) {
            let node = event.target as cc.Node;
            let position = node.parent.convertToNodeSpaceAR(event.getLocation());
            this.updatePointP(position);
            this.sendUpdateDraw();
        }
    }

    updatePointP (position) {
        position.x = cc.misc.clampf(position.x, this.line.nodes[0].x, this.line.nodes[1].x)
        position.y = cc.misc.clampf(position.y, this.line.nodes[0].y, this.line.nodes[1].y)
        this.line.getLinePosition(position, _tempVec3)
        this.pointP.setPosition(_tempVec3);
        this.updateCircles();
    }
}
