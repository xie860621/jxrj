import CircleComponent from "../component/circle_component";
import LineComponent from "../component/line_component";
import Parallelogram from "../component/parallelogram_component";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec3 = new cc.Vec3
let _tempVec3_2 = new cc.Vec3
@ccclass
export default class Learn21 extends LearnBase {
    @property(Parallelogram)
    rect1: Parallelogram;
    @property(Parallelogram)
    rect2: Parallelogram;
    @property(Parallelogram)
    rect3: Parallelogram;
    @property(Parallelogram)
    rect4: Parallelogram;
    @property(Parallelogram)
    rect5: Parallelogram;

    @property(cc.Node)
    pointP: cc.Node;

    @property(cc.Slider)
    slider: cc.Slider;

    @property(cc.Node)
    rotationNode: cc.Node;

    @property(cc.Node)
    addNode: cc.Node;


    init () {
        this.updatePpoint(this.getNodeWorldPosition(this.pointP))

        // cc.Vec3.add(_tempVec3, this.triangle.B.position, this.triangle.C.position)
        // _tempVec3.multiplyScalar(0.1);
        // this.updatePpoint(_tempVec3);
    }

    updatePpoint (position) {
        let pPosition = this.getNodeWorldPosition(this.pointP)
        position.y = pPosition.y;
        position.x = cc.misc.clampf(position.x, this.rect4.A.convertToWorldSpaceAR(cc.Vec3.ZERO).x, this.rect4.B.convertToWorldSpaceAR(cc.Vec3.ZERO).x);
        this.pointP.position = this.rect1.node.convertToNodeSpaceAR(position);

        _tempVec3.x = this.rect1.C.position.x;
        _tempVec3.y = this.pointP.position.x;
        this.rect1.C.position = _tempVec3;

        _tempVec3.x = this.pointP.position.x;
        _tempVec3.y = this.rect1.C.position.y;
        this.rect1.D.position = _tempVec3;

        this.rect2.B.position = this.rect1.B.position;
        this.rect2.C.position = this.rect1.C.position;
        this.rect2.D.position = this.rect1.D.position;


        _tempVec3.x = this.rect1.B.position.x - 160;
        _tempVec3.y = this.rect5.A.position.y;
        this.rect5.A.position = _tempVec3;

        _tempVec3.x = this.rect5.D.position.x;
        _tempVec3.y = this.rect1.C.position.y;
        this.rect5.D.position = _tempVec3;

        _tempVec3.x = this.rect5.A.position.x;
        _tempVec3.y = this.rect5.D.position.y;
        this.rect5.C.position = _tempVec3;

        this.onSlider();
    }

    onTouchMove (event: cc.Event.EventTouch): void {
        if (event.target != this.pointP) {
            return;
        }
        this.updatePpoint(event.getLocation());

        this.sendUpdateDraw();
    }


    updateDraw (drawHelper: DrawHelper): void {
        let nodes = [this.rect2.C, this.rect3.C, this.rect3.D, this.rect5.D]
        let vertexs = [];
        nodes.forEach((node) => {
            vertexs.push(node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        });
        drawHelper.fillVertexs(vertexs, this.rect2.fillColor);
        drawHelper.drawVertexs(vertexs, false, false);
    }

    onSlider () {
        let moveNode = this.pointP.parent.parent;
        this.rect5.node.parent = moveNode;
        this.rect5.node.position = new cc.Vec3(460, 0);

        this.rotationNode.parent = this.rect5.node;

        // 需要更新重点坐标
        this.rotationNode.position = new cc.Vec3(this.rect5.A.position.x + 80, this.rect5.C.position.y / 2, 0);

        let pos = this.getNodeWorldPosition(this.rotationNode)

        this.rotationNode.parent = moveNode;
        this.rotationNode.position = moveNode.convertToNodeSpaceAR(new cc.Vec3(pos.x, pos.y));

        this.rect5.node.parent = this.rotationNode;
        this.rect5.node.position = new cc.Vec3(80, 80);

        this.rotationNode.rotation = this.slider.progress * 90;
        //  this.addNode.position = cc.v3(460 + this.slider.progress * (320 - (this.pointP.position.x - this.rect1.A.position.x)), this.slider.progress * 160 - 160 + this.slider.progress * this.rect1.D.position.y);
        this.sendUpdateDraw();
    }

}
