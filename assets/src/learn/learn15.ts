
import Triangle14 from "../component/triangle_14";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
import { GlobalValue } from "../global";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec2 = new cc.Vec2;
let _tempVec2_1 = new cc.Vec2;
let _tempVec2_2 = new cc.Vec2;
let _tempVec3 = new cc.Vec3
@ccclass
export default class Learn15 extends LearnBase {
    @property(TriangleComponent)
    triangle: TriangleComponent;

    @property(TriangleComponent)
    triangleCheck: TriangleComponent;

    @property(TriangleComponent)
    triangleDotted: TriangleComponent;

    @property(cc.Node)
    setInfoNode: cc.Node;

    _isCheck: boolean = false;

    init () {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = this.node.name;// 这个是代码文件名
        clickEventHandler.handler = "onSetValue";

        let buttons = this.setInfoNode.getComponentsInChildren(cc.Button)
        buttons.forEach((button) => {
            button.clickEvents.push(clickEventHandler);
        })
    }

    protected onEnable (): void {
        this.node.on("UpdateDraw", this.updateDraw, this);
    }

    protected onDisable (): void {
        this.node.off("UpdateDraw", this.updateDraw, this);
    }

    onCheck () {
        if (!this._isCheck) {
            this._isCheck = true;

            cc.Vec3.subtract(_tempVec3, this.triangle.A.position, this.triangleCheck.A.position);
            cc.Vec3.add(_tempVec3, _tempVec3, this.triangle.node.position)

            cc.tween(this.triangleDotted.node).to(3, { position: _tempVec3 }).call(() => {
                this._isCheck = false;
            }).start();
        } else {
            this._isCheck = false;
            cc.Tween.stopAllByTarget(this.triangleDotted.node);
        }
    }

    onReset () {
        this._isCheck = false;
        cc.Tween.stopAllByTarget(this.triangleDotted.node);
        this.triangleDotted.node.setPosition(this.triangleCheck.node.position)
        this.triangleDotted.sendUpdateDraw();
    }

    updateDraw (event) {
        if (event.target == this.triangleCheck.node) {
            this.triangleDotted.A.setPosition(this.triangleCheck.A.position)
            this.triangleDotted.B.setPosition(this.triangleCheck.B.position)
            this.triangleDotted.C.setPosition(this.triangleCheck.C.position)
            this.triangleDotted.sendUpdateDraw();
        }
    }

    protected update (dt: number): void {
        if (this._isCheck) {
            this.triangleDotted.sendUpdateDraw();
        }
    }


    onSetValue (event) {
        if (this.triangleCheck.inAnimation) {
            return;
        }
        this.onReset();
        let label = (event.target as cc.Node).getComponentInChildren(cc.Label)
        console.log(label.string);
        let info = label.string;
        if (info == "DE=AB") {
            cc.Vec2.subtract(_tempVec2, this.triangle.APosition, this.triangle.BPosition)
            this.triangleCheck.setLength(0, 1, _tempVec2.len() / GlobalValue.scale, true);
        } else if (info == "∠D=∠A") {
            // 会矫正方向，，所以可能需要特殊处理一下
            //this.triangleCheck.setAngle(0, this.triangle._angles[0]);
            cc.Vec2.subtract(_tempVec2_1, this.triangle.BPosition, this.triangle.APosition)
            cc.Vec2.subtract(_tempVec2_2, this.triangle.CPosition, this.triangle.APosition)
            this.triangleCheck.setDic(0, _tempVec2_1, _tempVec2_2);
        } else if (info == "DF=AC") {
            cc.Vec2.subtract(_tempVec2, this.triangle.APosition, this.triangle.CPosition)
            this.triangleCheck.setLength(0, 2, _tempVec2.len() / GlobalValue.scale, true);
        } else if (info == "DE=AB") {
            cc.Vec2.subtract(_tempVec2, this.triangle.APosition, this.triangle.BPosition)
            this.triangleCheck.setLength(0, 1, _tempVec2.len() / GlobalValue.scale, true);
        } else if (info == "∠E=∠B") {
            // cc.Vec2.subtract(_tempVec2_1, this.triangleCheck.APosition, this.triangleCheck.BPosition)
            // cc.Vec2.subtract(_tempVec2_2, this.triangle.CPosition, this.triangle.BPosition)
            // this.triangleCheck.setDic(1, _tempVec2_1, _tempVec2_2);


            // hack
            // 由于题目特性，保持AB角度不变，对∠E进行即旋转EF，并将F点置于EF跟DF的切线上
            cc.Vec2.subtract(_tempVec2_1, this.triangleCheck.CPosition, this.triangleCheck.BPosition)
            _tempVec2_1.rotate(cc.misc.degreesToRadians(this.triangleCheck._angles[1] - this.triangle._angles[1]), _tempVec2_2);
            _tempVec2_2.normalizeSelf()
            cc.Vec2.scaleAndAdd(_tempVec2, this.triangleCheck.BPosition, _tempVec2_2, _tempVec2_1.len())
            this.triangleCheck.getCrossPoint(_tempVec2, this.triangleCheck.BPosition, _tempVec2, this.triangleCheck.APosition, this.triangleCheck.CPosition)
            this.triangleCheck.animationPoint(2, _tempVec2);
        } else if (info == "EF=BC") {
            // cc.Vec2.subtract(_tempVec2, this.triangle.BPosition, this.triangle.CPosition)
            // this.triangleCheck.setLength(1, 2, _tempVec2.len() / GlobalValue.scale, true);

            // hack
            // 通过 同时移动E 跟 F 点达到EF = BC
            cc.Vec2.subtract(_tempVec2_1, this.triangleCheck.BPosition, this.triangleCheck.APosition)
            _tempVec2_1.normalizeSelf();
            cc.Vec2.scaleAndAdd(_tempVec2, this.triangleCheck.APosition, _tempVec2_1, this.triangle._lens[0] * GlobalValue.scale)
            this.triangleCheck.animationPoint(1, _tempVec2);

            cc.Vec2.subtract(_tempVec2_1, this.triangleCheck.CPosition, this.triangleCheck.APosition)
            _tempVec2_1.normalizeSelf();
            cc.Vec2.scaleAndAdd(_tempVec2, this.triangleCheck.APosition, _tempVec2_1, this.triangle._lens[1] * GlobalValue.scale)
            this.triangleCheck.animationPoint(2, _tempVec2);
        }
    }

    onRandom () {
        if (this.triangleCheck.inAnimation) {
            return;
        }
        let a = new cc.Vec2
        let b = new cc.Vec2(-Math.random() * 200 - 100, -Math.random() * 200 - 100)
        let c = new cc.Vec2(Math.random() * 200 + 100, -Math.random() * 200 - 100);


        this.triangleCheck.animationPoint(0, this.triangleCheck.node.convertToWorldSpaceAR(a));
        this.triangleCheck.animationPoint(1, this.triangleCheck.node.convertToWorldSpaceAR(b));
        this.triangleCheck.animationPoint(2, this.triangleCheck.node.convertToWorldSpaceAR(c));
    }

}
