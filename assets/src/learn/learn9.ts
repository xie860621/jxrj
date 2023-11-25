import CircleComponent from "../component/circle_component";
import LineComponent from "../component/line_component";
import Parallelogram from "../component/parallelogram_component";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec3 = new cc.Vec3
@ccclass
export default class Learn9 extends LearnBase {
    @property(cc.Node)
    pointP: cc.Node;

    @property(LineComponent)
    line: LineComponent;

    @property(CircleComponent)
    circleA: CircleComponent;

    @property(CircleComponent)
    circleB: CircleComponent;

    init () {
        this.updateCircles();
    }

    updateCircles () {
        let world = this.getNodeWorldPosition(this.pointP)
        this.circleA.pointP.setPosition(this.circleA.node.convertToNodeSpaceAR(world));
        this.circleB.pointP.setPosition(this.circleB.node.convertToNodeSpaceAR(world));
    }

    onTouchMove (event: cc.Event.EventTouch): void {
        // super.onTouchMove(event);
        if (event.target == this.pointP) {
            let node = event.target as cc.Node;
            let position = node.parent.convertToNodeSpaceAR(event.getLocation());
            position.x = cc.misc.clampf(position.x, this.nodes[0].x, this.nodes[2].x)
            position.y = cc.misc.clampf(position.y, this.nodes[0].y, this.nodes[2].y)
            this.line.getLinePosition(position, _tempVec3)
            node.setPosition(_tempVec3);
            this.updateCircles();
            this.sendUpdateDraw();
        }
    }

    updateDraw (drawHelper: DrawHelper): void {
        let vertexs: cc.Vec2[] = []
        this.nodes.forEach((node) => {
            vertexs.push(node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        });
        vertexs.length = 4;
        drawHelper.drawVertexs(vertexs);
    }

    // update (dt) {}
}
