
import AxleComponent from "../component/axle_component";
import FunctionComponent from "../component/function_component";
import TouchPanel from "../component/touch_panel";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
import { GlobalValue } from "../global";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec2 = new cc.Vec2;


@ccclass
export default class Learn16 extends LearnBase {
    @property(AxleComponent)
    axle: AxleComponent;

    @property(TriangleComponent)
    triangle: TriangleComponent;

    @property(FunctionComponent)
    fun: FunctionComponent;

    @property(cc.Node)
    pointP: cc.Node;

    @property(cc.Node)
    pointQ: cc.Node;

    @property(cc.Node)
    pointMinP: cc.Node;


    init () {
        this.updateQPoint(this.pointQ.position);
    }

    updateDraw (drawHelper: DrawHelper): void {
        let pPosition = this.getNodeWorldPosition(this.pointP)
        let vertexs = [this.triangle.BPosition, pPosition, this.triangle.CPosition];

        cc.Vec2.subtract(_tempVec2, this.triangle.BPosition, pPosition);
        drawHelper.drawRightAngle(pPosition, _tempVec2.normalizeSelf(), 0.5);

        drawHelper.drawVertexs(vertexs);

        vertexs = [this.triangle.APosition, this.getNodeWorldPosition(this.pointQ)];
        drawHelper.drawVertexs(vertexs);

        // drawMin
    }

    updateQPoint (position) {
        position.x -= this.triangle.node.x;
        position.y -= this.triangle.node.y;
        if (position.y > 4 * GlobalValue.scale) {
            position.y = 4 * GlobalValue.scale
        } else if (position.y < -500) {
            position.y = -500
        }

        let dic = 1;
        if (position.x < 1 * GlobalValue.scale) {
            dic = -1
        }
        let y = position.y / GlobalValue.scale;
        let x = this.fun.doNFunction(y) * dic + (dic < 0 ? 2 : 0);

        let pos = new cc.Vec2(x * GlobalValue.scale + this.triangle.node.x, y * GlobalValue.scale + this.triangle.node.y)
        this.pointQ.setPosition(pos);
    }

    onTouchMove (event: cc.Event.EventTouch): void {
        if (event.target == this.pointQ) {
            let position = this.pointQ.parent.convertToNodeSpaceAR(event.touch.getLocation())
            this.updateQPoint(position);
            this.sendUpdateDraw();
        }
    }

}
