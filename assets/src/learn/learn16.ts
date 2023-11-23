
import AxleComponent from "../component/axle_component";
import FunctionComponent from "../component/function_component";
import TouchPanel from "../component/touch_panel";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
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

    protected start (): void {
        // this.pointP.position = 
    }

    updateDraw (drawHelper: DrawHelper): void {
        let vertexs = [this.triangle.BPosition, this.getNodeWorldPosition(this.pointP), this.triangle.CPosition];

        drawHelper.drawVertexs(vertexs);

        drawHelper.drawRightAngle(this.getNodeWorldPosition(this.pointP), 10)
    }

}
