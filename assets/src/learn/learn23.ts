import CircleComponent from "../component/circle_component";
import LineComponent from "../component/line_component";
import Parallelogram from "../component/parallelogram_component";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec3 = new cc.Vec3
@ccclass
export default class Learn23 extends LearnBase {
    @property(TriangleComponent)
    triangle: TriangleComponent;
    @property(TriangleComponent)
    triangle2: TriangleComponent;

    @property(cc.Node)
    pointD: cc.Node;

    @property(cc.Node)
    pointE: cc.Node;

    @property(cc.Node)
    pointM: cc.Node;

    @property(cc.Node)
    pointN: cc.Node;

    @property(cc.Node)
    pointP: cc.Node;


    _lenAD: number = 0;

    init () {
        this.triangle.init();
        this.triangle2.init();
        cc.Vec3.subtract(_tempVec3, this.triangle.A.position, this.pointD.position);
        this._lenAD = _tempVec3.len();


        this.updateDpoint(this.getNodeWorldPosition(this.pointD))
        // _tempVec3.multiplyScalar(0.1);
        // this.updatePpoint(_tempVec3);
    }

    updateDpoint (position) {
        _tempVec3 = this.pointD.parent.convertToNodeSpaceAR(position);

        cc.Vec3.subtract(_tempVec3, _tempVec3, this.triangle.A.position);
        _tempVec3.normalizeSelf();
        cc.Vec3.scaleAndAdd(_tempVec3, this.triangle.A.position, _tempVec3, this._lenAD);
        this.pointD.position = _tempVec3;

        cc.Vec3.rotateZ(_tempVec3, _tempVec3, this.triangle.A.position, Math.PI / 2);

        this.pointE.position = _tempVec3;

        // M为DE中点
        cc.Vec3.subtract(_tempVec3, this.pointE.position, this.pointD.position);
        let len = _tempVec3.len();
        _tempVec3.normalizeSelf();
        cc.Vec3.scaleAndAdd(_tempVec3, this.pointD.position, _tempVec3, len / 2);
        this.pointM.position = _tempVec3;

        // P为DC中点
        cc.Vec3.subtract(_tempVec3, this.triangle.C.position, this.pointD.position);
        len = _tempVec3.len();
        _tempVec3.normalizeSelf();
        cc.Vec3.scaleAndAdd(_tempVec3, this.pointD.position, _tempVec3, len / 2);
        this.pointP.position = _tempVec3;

        // N为BC中点
        cc.Vec3.subtract(_tempVec3, this.triangle.B.position, this.triangle.C.position);
        len = _tempVec3.len();
        _tempVec3.normalizeSelf();
        cc.Vec3.scaleAndAdd(_tempVec3, this.triangle.C.position, _tempVec3, len / 2);
        this.pointN.position = _tempVec3;
    }

    onTouchMove (event: cc.Event.EventTouch): void {
        if (event.target != this.pointD) {
            return;
        }
        this.updateDpoint(event.getLocation());

        this.sendUpdateDraw();
    }

    updateDraw (drawHelper: DrawHelper): void {
        let nodes = [this.triangle.B, this.pointD, this.triangle.C, this.pointE]
        let vertexs = [];
        nodes.forEach((node) => {
            vertexs.push(node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        });
        drawHelper.drawVertexs(vertexs, false, false);

        nodes = [this.pointM, this.pointP, this.pointN];
        vertexs = [];
        nodes.forEach((node) => {
            vertexs.push(node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        });
        drawHelper.drawVertexs(vertexs, false, false);
    }

}
