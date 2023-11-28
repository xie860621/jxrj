import CircleComponent from "../component/circle_component";
import LineComponent from "../component/line_component";
import Parallelogram from "../component/parallelogram_component";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec3 = new cc.Vec3;
let _tempVec3_2 = new cc.Vec3;

let _tempVec2 = new cc.Vec2;
let _tempVec2_2 = new cc.Vec2;
@ccclass
export default class Learn20 extends LearnBase {
    @property(cc.Node)
    pointA: cc.Node;
    @property(cc.Node)
    pointB: cc.Node;
    @property(cc.Node)
    pointC: cc.Node;

    @property(cc.Node)
    pointD: cc.Node;
    @property(cc.Node)
    pointM: cc.Node;

    @property(cc.Node)
    pointO: cc.Node;

    @property(cc.Node)
    pointE: cc.Node;
    @property(cc.Node)
    pointF: cc.Node;
    @property(cc.Node)
    pointN: cc.Node;
    @property(cc.Node)
    pointB1: cc.Node;


    init () {
        this.updateMpoint(this.getNodeWorldPosition(this.pointM))

        // cc.Vec3.add(_tempVec3, this.triangle.B.position, this.triangle.C.position)
        // _tempVec3.multiplyScalar(0.1);
        // this.updatePpoint(_tempVec3);
    }

    updateMpoint (position) {
        _tempVec3 = this.pointB.parent.convertToNodeSpaceAR(position);
        _tempVec3.x = this.pointB.position.x;
        _tempVec3.y = cc.misc.clampf(_tempVec3.y, this.pointB.position.y + 1, this.pointC.position.y - 1)

        this.pointM.position = _tempVec3;

        let MPosition = this.pointM.position;
        let OPosition = this.pointO.position;
        let BPosition = this.pointB.position;

        cc.Vec3.subtract(_tempVec3, MPosition, OPosition);
        _tempVec2.x = _tempVec3.x;
        _tempVec2.y = _tempVec3.y;
        cc.Vec3.subtract(_tempVec3, BPosition, OPosition);

        let angle = cc.Vec2.angle(_tempVec2, new cc.Vec2(1, 0))
        console.log("angle = ", angle)
        _tempVec3.rotateSelf(angle * 2)
        cc.Vec3.add(_tempVec3, _tempVec3, OPosition);

        this.pointB1.position = _tempVec3;

        this.getCrossPoint(_tempVec3, MPosition, this.pointB1.position, this.pointA.position, this.pointD.position);
        this.pointN.position = _tempVec3;
        this.getCrossPoint(_tempVec3, MPosition, this.pointB1.position, this.pointA.position, this.pointC.position);
        this.pointF.position = _tempVec3;
        this.getCrossPoint(_tempVec3, this.pointN.position, this.pointO.position, this.pointA.position, this.pointC.position);
        this.pointE.position = _tempVec3;
    }

    onTouchMove (event: cc.Event.EventTouch): void {
        if (event.target == this.pointM) {
            this.updateMpoint(event.getLocation());
            this.sendUpdateDraw();
        } else if (event.target == this.pointD) {
            let pos = this.pointB.parent.convertToNodeSpaceAR(event.getLocation());
            this.pointD.getPosition(_tempVec3)
            _tempVec3.y = pos.y;
            this.pointD.setPosition(_tempVec3);
            this.sendUpdateDraw();
        }
    }


    updateDraw (drawHelper: DrawHelper): void {
        // DACMOB1
        let nodes = [this.pointD, this.pointA, this.pointC, this.pointM, this.pointO, this.pointB1]
        let vertexs = [];
        nodes.forEach((node) => {
            vertexs.push(node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        });
        drawHelper.drawVertexs(vertexs, false, false);

        // MN
        nodes = [this.pointM, this.pointN];
        vertexs.length = 0;
        nodes.forEach((node) => {
            vertexs.push(node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        });
        drawHelper.drawVertexs(vertexs, false, false);

        nodes = [this.pointA, this.pointO];
        vertexs.length = 0;
        nodes.forEach((node) => {
            vertexs.push(node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        });
        drawHelper.drawVertexs(vertexs, false, false);

        // mbon
        nodes = [this.pointM, this.pointB, this.pointO, this.pointN];
        vertexs.length = 0;
        nodes.forEach((node) => {
            vertexs.push(node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        });
        drawHelper.drawVertexs(vertexs, true, false);

        let BPosition = this.pointB.position;
        let OPosition = this.pointO.position;

        cc.Vec3.subtract(_tempVec3, OPosition, BPosition);
        _tempVec2.x = _tempVec3.x;
        _tempVec2.y = _tempVec3.y;
        drawHelper.drawRightAngle(this.getNodeWorldPosition(this.pointB), _tempVec2.normalizeSelf(), 0.5, -1);


        let B1Position = this.pointB1.position;

        cc.Vec3.subtract(_tempVec3, OPosition, B1Position);
        _tempVec2.x = _tempVec3.x;
        _tempVec2.y = _tempVec3.y;
        drawHelper.drawRightAngle(this.getNodeWorldPosition(this.pointB1), _tempVec2.normalizeSelf(), 0.5);


    }
}
