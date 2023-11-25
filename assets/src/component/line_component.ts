import DrawHelper from "../draw_helper";
import { GlobalValue } from "../global";
import TouchPanel from "./touch_panel";

let _tempVec3 = new cc.Vec3;
const { ccclass, property } = cc._decorator;

@ccclass
export default class LineComponent extends TouchPanel {
    @property
    isDotted: boolean = false;
    // _dic: cc.Vec2 = new cc.Vec2;
    a: number = 0;
    k: number = 1;
    // y = kx + a 
    protected onLoad (): void {
        // cc.Vec3.subtract(_tempVec3, this.nodes[0].position, this.nodes[1].position);
        let x1 = this.nodes[0].x;
        let y1 = this.nodes[0].y;
        let x2 = this.nodes[1].x;
        let y2 = this.nodes[1].y
        this.k = (y2 - y1) / (x2 - x1)
        this.a = y1 - x1 * this.k;
    }

    onTouchMove (event: cc.Event.EventTouch): void {
        super.onTouchMove(event);
        if (event.target != this.node) {
            event.target.getPosition(_tempVec3);
            _tempVec3.y = this.k * _tempVec3.x + this.a;
            event.target.setPosition(_tempVec3)
        }
    }

    updateDraw (drawHelper: DrawHelper): void {
        let vertexs: cc.Vec2[] = []
        this.nodes.forEach((node) => {
            vertexs.push(node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        });
        drawHelper.drawVertexs(vertexs, this.isDotted);
    }

    getLinePosition (position, out) {
        out.x = position.x;
        out.y = this.k * position.x + this.a;
        return out;
    }
}