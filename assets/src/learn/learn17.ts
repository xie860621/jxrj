
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
export default class Learn17 extends LearnBase {
    @property(AxleComponent)
    axle: AxleComponent;

    @property(FunctionComponent)
    fun: FunctionComponent;

    @property(cc.Node)
    pointA: cc.Node;
    @property(cc.Node)
    pointB: cc.Node;
    @property(cc.Node)
    pointC: cc.Node;
    @property(cc.Node)
    pointP: cc.Node;

    init (): void {
        this.updatePPoint(this.pointP.position)
    }

    drawACB (drawHelper: DrawHelper) {
        let nodes = [this.pointA, this.pointC, this.pointB];
        let vertexs = [];
        nodes.forEach((node) => {
            vertexs.push(this.getNodeWorldPosition(node));
        })

        let dic1 = new cc.Vec2
        let dic2 = new cc.Vec2

        cc.Vec2.subtract(dic1, vertexs[0], vertexs[1]);
        dic1.normalizeSelf();
        cc.Vec2.subtract(dic2, vertexs[2], vertexs[1]);
        dic2.normalizeSelf();
        drawHelper.drawAngle(vertexs[1], dic1, dic2, 1);

        drawHelper.drawVertexs(vertexs, false, false);
    }


    drawPXY (drawHelper: DrawHelper) {
        let vertexs = [];
        let nodes = [];
        let dic1 = new cc.Vec2
        let dic2 = new cc.Vec2

        nodes = [this.pointP, this.axle.node];
        nodes.forEach((node) => {
            vertexs.push(this.getNodeWorldPosition(node));
        })
        vertexs.push(this.getNodeWorldPosition(this.pointA))

        cc.Vec2.subtract(dic1, vertexs[0], vertexs[1]);
        dic1.normalizeSelf();
        cc.Vec2.subtract(dic2, vertexs[2], vertexs[1]);
        dic2.normalizeSelf();
        drawHelper.drawAngle(vertexs[1], dic1, dic2, 1);

        vertexs.length = 2
        drawHelper.drawVertexs(vertexs, false, false);
    }

    updateDraw (drawHelper: DrawHelper): void {
        this.drawACB(drawHelper);
        this.drawPXY(drawHelper);
    }

    updatePPoint (position) {
        position.x -= this.axle.node.x;
        position.y -= this.axle.node.y;
        if (position.y > 4 * GlobalValue.scale) {
            position.y = 4 * GlobalValue.scale
        } else if (position.y < -500) {
            position.y = -500
        }

        let dic = 1;
        if (position.x < GlobalValue.scale) {
            dic = -1
        }
        let y = position.y / GlobalValue.scale;
        let x = this.fun.doNFunction(y) * dic + (dic < 0 ? 2 : 0);

        let pos = new cc.Vec2(x * GlobalValue.scale + this.axle.node.x, y * GlobalValue.scale + this.axle.node.y)
        this.pointP.setPosition(pos);
    }

    onTouchMove (event: cc.Event.EventTouch): void {
        if (event.target == this.pointP) {
            let position = this.pointP.parent.convertToNodeSpaceAR(event.touch.getLocation())
            this.updatePPoint(position);
            this.sendUpdateDraw();
        }
    }

}
