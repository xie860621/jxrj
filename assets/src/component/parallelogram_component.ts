// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import DrawHelper from "../draw_helper";
import { GlobalValue } from "../global";
import TouchPanel from "./touch_panel";


const { ccclass, property } = cc._decorator;


let _tempVec3: cc.Vec3 = new cc.Vec3;
let _tempVec2: cc.Vec2 = new cc.Vec2;
@ccclass
export default class Parallelogram extends TouchPanel {
    // ABCD 逆时针

    @property(cc.Color)
    fillColor: cc.Color = cc.Color.RED;

    ABLen: number = 10;
    _basePosition: cc.Vec3[] = [];
    onLoad () {
        this.ABLen = cc.Vec2.distance(this.nodes[0].position, this.nodes[1].position) / GlobalValue.scale;

        this.nodes.forEach((node) => {
            this._basePosition.push(node.position);
        })
    }

    onTouchMove (event: cc.Event.EventTouch): void {
        super.onTouchMove(event);
        let index = this.nodes.indexOf(event.target);
        this.updateOtherPoint(index, event.target.position);
    }

    updateOtherPoint (index, position: { x, y }, isAnimation = false) {
        let otherIndex = 0;
        let dic = 1;
        if (index == 0) {
            otherIndex = 1;
        } else if (index == 1) {
            otherIndex = 0;
            dic = -1;
        } else if (index == 2) {
            otherIndex = 3;
            dic = -1;
        } else if (index == 3) {
            otherIndex = 2;
        }

        _tempVec3.x = position.x + this.ABLen * dic * GlobalValue.scale;
        _tempVec3.y = position.y;

        if (isAnimation) {
            this.animationTo(this.nodes[otherIndex], _tempVec3);
        } else {
            this.nodes[otherIndex].setPosition(_tempVec3)
        }
    }

    updateDraw (drawHelper: DrawHelper): void {
        let vertexs: cc.Vec2[] = []
        this.nodes.forEach((node) => {
            vertexs.push(node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        });
        drawHelper.fillVertexs(vertexs, this.fillColor);
        drawHelper.drawVertexs(vertexs);
    }

    animationTo (node, targetPosition) {
        this._inAnimation++;
        let time = cc.Vec2.distance(node.position, targetPosition) / 200;
        cc.tween(node).to(time, { position: targetPosition.clone() }).call(() => {
            this._inAnimation--;
        }).start();
    }

    setParallelogram (isAnimation = false) {
        this.nodes.forEach((node, index) => {
            if (isAnimation) {
                this.animationTo(node, this._basePosition[index]);
            } else {
                node.setPosition(this._basePosition[index])
            }
        });
    }

    setDiamond (isAnimation = false) {
        let ABLen = cc.Vec2.distance(this.nodes[0].position, this.nodes[1].position);

        cc.Vec3.subtract(_tempVec3, this.nodes[2].position, this.nodes[1].position);
        _tempVec2.x = _tempVec3.x;
        _tempVec2.y = _tempVec3.y;
        _tempVec2.normalizeSelf();
        _tempVec3.x = _tempVec2.x;
        _tempVec3.y = _tempVec2.y;

        cc.Vec3.scaleAndAdd(_tempVec3, this.nodes[1].position, _tempVec3, ABLen);

        if (isAnimation) {
            this.animationTo(this.nodes[2], _tempVec3);
        } else {
            this.nodes[2].setPosition(_tempVec3)
        }

        this.updateOtherPoint(2, _tempVec3, isAnimation);
    }

    setRect (isAnimation = false) {
        let ABLen = cc.Vec2.distance(this.nodes[0].position, this.nodes[1].position);

        _tempVec3.x = this.nodes[1].position.x;
        _tempVec3.y = this.nodes[1].position.y + ABLen;
        _tempVec3.z = 0;

        if (isAnimation) {
            this.animationTo(this.nodes[2], _tempVec3);
        } else {
            this.nodes[2].setPosition(_tempVec3)
        }

        _tempVec3.x = this.nodes[0].position.x;
        _tempVec3.y = this.nodes[0].position.y + ABLen;
        _tempVec3.z = 0;

        if (isAnimation) {
            this.animationTo(this.nodes[3], _tempVec3);
        } else {
            this.nodes[3].setPosition(_tempVec3)
        }
    }

    protected update (dt: number): void {
        if (this._inAnimation > 0) {
            this.sendUpdateDraw();
        }
    }
}
