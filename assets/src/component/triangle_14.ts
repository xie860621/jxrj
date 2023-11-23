
import TouchPanel from "./touch_panel";
import TriangleComponent from "./triangle_component";
import DrawHelper from "../draw_helper";

const { ccclass, property } = cc._decorator;

let _tempVec2 = new cc.Vec2;

@ccclass
export default class Triangle14 extends TriangleComponent {
    @property(cc.Node)
    pointD: cc.Node;
    @property(cc.Node)
    pointE: cc.Node;
    @property(cc.Node)
    pointF: cc.Node;
    @property(cc.Node)
    pointG: cc.Node;

    @property([cc.Color])
    colors: cc.Color[] = [];

    _adR: number = 0.5;
    _aeR: number = 0.5;
    _bfR: number = 0.5;

    _progress: number = 0;

    set progress (value) {
        this._progress = value;
        this.sendUpdateDraw()
    }

    init () {
        super.init();
        this.updatePoint(this.pointD);
        this.updatePoint(this.pointE);
        this.updatePoint(this.pointF);
        this.updatePoint(this.pointG);
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
        this.sendUpdateDraw()
    }


    updatePoint (target) {
        if (target == this.pointD) {
            cc.Vec2.subtract(_tempVec2, this.BPosition, this.APosition);
            cc.Vec2.scaleAndAdd(_tempVec2, this.APosition, _tempVec2, this._adR)
            this.pointD.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
        } else if (target == this.pointE) {
            cc.Vec2.subtract(_tempVec2, this.CPosition, this.APosition);
            cc.Vec2.scaleAndAdd(_tempVec2, this.APosition, _tempVec2, this._aeR)
            this.pointE.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
        } else if (target == this.pointF) {
            cc.Vec2.subtract(_tempVec2, this.CPosition, this.BPosition);
            cc.Vec2.scaleAndAdd(_tempVec2, this.BPosition, _tempVec2, this._bfR)
            this.pointF.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
        } else if (target == this.pointG) {
            cc.Vec2.add(_tempVec2, this.BPosition, this.CPosition)
            cc.Vec2.add(_tempVec2, _tempVec2, this.APosition);
            _tempVec2.multiplyScalar(1 / 3);
            this.pointG.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
        }
    }

    onTouchMove (event: cc.Event.EventTouch) {
        if (event.target == this.A) {
            super.onTouchMove(event);
            this.updatePoint(this.pointD);
            this.updatePoint(this.pointE);
        } else if (event.target == this.B) {
            super.onTouchMove(event);
            this.updatePoint(this.pointD);
            this.updatePoint(this.pointF);
        } else if (event.target == this.C) {
            super.onTouchMove(event);
            this.updatePoint(this.pointE);
            this.updatePoint(this.pointF);
        } else if (event.target == this.pointD) {
            let delta = event.touch.getDelta();
            //   event.target.position = this.node.convertToNodeSpaceAR(event.touch.getLocation())
            cc.Vec2.add(_tempVec2, this.APosition, delta)
            this.A.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
            cc.Vec2.add(_tempVec2, this.BPosition, delta)
            this.B.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
            this.updatePoint(this.pointD);
            this.updatePoint(this.pointE);
            this.updatePoint(this.pointF);

            // 限制D在AB上
            //   this.getCrossPoint(_tempVec2, event.touch.getLocation(), this.getNodeWorldPosition(this.pointG), this.APosition, this.BPosition)
            //   _tempVec2.x = cc.misc.clampf(_tempVec2.x, this.APosition.x, this.BPosition.x);
            //   _tempVec2.y = cc.misc.clampf(_tempVec2.y, this.APosition.y, this.BPosition.y);
            //   this.pointD.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
        } else if (event.target == this.pointE) {
            let delta = event.touch.getDelta();
            //   event.target.position = this.node.convertToNodeSpaceAR(event.touch.getLocation())
            cc.Vec2.add(_tempVec2, this.APosition, delta)
            this.A.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
            cc.Vec2.add(_tempVec2, this.CPosition, delta)
            this.C.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
            this.updatePoint(this.pointD);
            this.updatePoint(this.pointE);
            this.updatePoint(this.pointF);

            //   this.getCrossPoint(_tempVec2, event.touch.getLocation(), this.getNodeWorldPosition(this.pointG), this.APosition, this.CPosition)
            //   _tempVec2.x = cc.misc.clampf(_tempVec2.x, this.APosition.x, this.CPosition.x);
            //    _tempVec2.y = cc.misc.clampf(_tempVec2.y, this.APosition.y, this.CPosition.y);
            //    this.pointE.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
        } else if (event.target == this.pointF) {
            let delta = event.touch.getDelta();
            cc.Vec2.add(_tempVec2, this.BPosition, delta)
            this.B.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
            cc.Vec2.add(_tempVec2, this.CPosition, delta)
            this.C.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
            this.updatePoint(this.pointD);
            this.updatePoint(this.pointE);
            this.updatePoint(this.pointF);

            //    this.getCrossPoint(_tempVec2, event.touch.getLocation(), this.getNodeWorldPosition(this.pointG), this.BPosition, this.CPosition)
            //    _tempVec2.x = cc.misc.clampf(_tempVec2.x, this.BPosition.x, this.CPosition.x);
            //     _tempVec2.y = cc.misc.clampf(_tempVec2.y, this.BPosition.y, this.CPosition.y);
            //    this.pointF.setPosition(this.node.convertToNodeSpaceAR(_tempVec2));
        } else if (event.target == this.pointG) {
            // pointG 必须在三角形内
        }
        else {
            super.onTouchMove(event);
        }
        this.updatePoint(this.pointG);
        this.sendUpdateDraw()
    }

    updateDraw (drawHelper: DrawHelper) {


        let lists = [];
        lists.push([this.A, this.pointD, this.pointG, this.pointE]);
        lists.push([this.pointD, this.pointG, this.pointF, this.B]);
        lists.push([this.pointE, this.pointG, this.pointF, this.C]);

        let EWorld = this.getNodeWorldPosition(this.pointE);
        let BC = new cc.Vec2()
        cc.Vec2.subtract(BC, this.CPosition, this.BPosition)

        // let colors = [cc.Color.GREEN, cc.Color.BLUE, cc.Color.YELLOW]
        lists.forEach((nodes, index) => {
            let vertexs: cc.Vec2[] = []
            nodes.forEach((node, ii) => {
                let position = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
                if (index == 1 && this._progress > 0) {
                    cc.Vec2.scaleAndAdd(position, position, BC, this._progress)
                } else if (index == 0 && this._progress > 0 && ii != 3) {
                    cc.Vec2.subtract(_tempVec2, position, EWorld);
                    _tempVec2.rotate(cc.misc.degreesToRadians(-180 * this._progress), _tempVec2)
                    cc.Vec2.add(position, _tempVec2, EWorld);
                }
                vertexs.push(position);
            });
            drawHelper.drawVertexs(vertexs, false, true, null, this.colors[index]);
        });

        super.updateDraw(drawHelper);
    }

    getCrossPoint (out, pointA, pointB, pointC, pointD) {
        let AB = new cc.Vec2;
        let CD = new cc.Vec2;

        cc.Vec2.subtract(AB, pointB, pointA);
        cc.Vec2.subtract(CD, pointD, pointC);

        let CA = new cc.Vec2()
        cc.Vec2.subtract(CA, pointA, pointC);


        let t = this.cross(CD, CA) / this.cross(AB, CD);

        cc.Vec2.scaleAndAdd(out, pointA, AB, t);
        return out;
    }

    cross (a: cc.Vec2, b: cc.Vec2) {
        return a.x * b.y - a.y * b.x;
    }


    // update (dt) {}
}
