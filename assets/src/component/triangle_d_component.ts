
import TouchPanel from "../component/touch_panel";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";

const { ccclass, property } = cc._decorator;

let _tempVec2 = new cc.Vec2;

@ccclass
export default class TriangleD extends TriangleComponent {
    @property(Number)
    angle: number = 30;

    @property(cc.Node)
    pointD: cc.Node;
    @property(cc.Node)
    pointF: cc.Node;
    @property(cc.Node)
    pointE: cc.Node;

    AD: cc.Vec2 = new cc.Vec2
    AE: cc.Vec2 = new cc.Vec2;

    init () {
        super.init();
        cc.Vec2.add(_tempVec2, this.BPosition, this.CPosition);
        _tempVec2.multiplyScalar(0.5);
        this.pointD.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
        this.updateOther();
        this.sendUpdateDraw()
    }

    protected onEnable (): void {
        super.onEnable();
        this.pointD.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveD, this);
    }

    onDisable () {
        super.onDisable();
        this.pointD.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveD, this);
    }

    onTouchMoveD (event: cc.Event.EventTouch): void {
        //  this.node.parent.convertToNodeSpaceAR(event.touch.getLocation(), _tempVec2)

        this.getCrossPoint(_tempVec2, this.APosition, event.touch.getLocation(), this.BPosition, this.CPosition)

        _tempVec2.x = cc.misc.clampf(_tempVec2.x, this.BPosition.x, this.CPosition.x);
        _tempVec2.y = cc.misc.clampf(_tempVec2.y, this.BPosition.y, this.CPosition.y);

        this.pointD.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));

        this.updateOther();
        this.sendUpdateDraw()
    }

    updateOther () {
        cc.Vec2.subtract(this.AD, this.APosition, this.getNodeWorldPosition(this.pointD))
        this.AD.rotate(this.angle, this.AE)

        let DA = this.AD.negate();
        let DE = new cc.Vec2;
        DA.rotate(180 - this.angle * 2, DE);
        cc.Vec2.add(_tempVec2, this.pointD.convertToWorldSpaceAR(cc.Vec2.ZERO), DE);

        this.pointE.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));

        this.getCrossPoint(_tempVec2, this.APosition, this.getNodeWorldPosition(this.pointE), this.BPosition, this.CPosition);
        this.pointF.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
    }

    updateDraw (drawHelper: DrawHelper) {
        super.updateDraw(drawHelper);

        let nodes = [this.A, this.pointD, this.pointE];

        let vertexs: cc.Vec2[] = []
        nodes.forEach((node) => {
            vertexs.push(node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        });

        drawHelper.drawVertexs(vertexs);
    }




    getInfo () {
        let info = super.getInfo();
        info.angle = this.angle;
        info.d = { x: this.pointD.position.x, y: this.pointD.position.y };
        return info;
    }

    setInfo (info) {
        super.setInfo(info);
        this.angle = info.angle;
        this.pointD.setPosition(info.d.x, info.d.y)
    }
    // update (dt) {}
}
