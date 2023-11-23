// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import DrawHelper from "../draw_helper";
import TouchPanel from "./touch_panel";

let _tempVec2 = new cc.Vec2;
const { ccclass, property } = cc._decorator;

@ccclass
export default class AxleComponent extends TouchPanel {
    @property(cc.Node)
    zero: cc.Node;

    @property(cc.Node)
    left: cc.Node;

    @property(cc.Node)
    right: cc.Node;

    @property(cc.Node)
    up: cc.Node;

    @property(cc.Node)
    down: cc.Node;

    @property(Boolean)
    showNumber: boolean = true;
    @property(Boolean)
    showLine: boolean = true;

    _numberXLabels: Map<number, cc.Node> = new Map;
    _numberYLabels: Map<number, cc.Node> = new Map;
    _lastSize: cc.Vec4 = new cc.Vec4;
    _labelNode: cc.Node;

    _drawTime: any;
    // LIFE-CYCLE CALLBACKS:

    onTouchMove (event: cc.Event.EventTouch) {
        let target = event.target;
        _tempVec2.set(target.position);
        if (target == this.left) {
            _tempVec2.x = this.node.convertToNodeSpaceAR(event.touch.getLocation()).x;
            if (_tempVec2.x > -1) {
                _tempVec2.x = -1;
            }
            target.position = _tempVec2;
        } else if (target == this.right) {
            _tempVec2.x = this.node.convertToNodeSpaceAR(event.touch.getLocation()).x;
            if (_tempVec2.x < 1) {
                _tempVec2.x = 1;
            }
            target.position = _tempVec2;
        } else if (target == this.up) {
            _tempVec2.y = this.node.convertToNodeSpaceAR(event.touch.getLocation()).y;
            if (_tempVec2.y < 1) {
                _tempVec2.y = 1;
            }
            target.position = _tempVec2;
        }
        else if (target == this.down) {
            _tempVec2.y = this.node.convertToNodeSpaceAR(event.touch.getLocation()).y;
            if (_tempVec2.y > -1) {
                _tempVec2.y = 1;
            }
            target.position = _tempVec2;
        } else if (target == this.zero && this.moveSelf) {
            _tempVec2.set(this.node.parent.convertToNodeSpaceAR(event.touch.getLocation()));
            this.node.position = new cc.Vec3(_tempVec2.x, _tempVec2.y, 0);
        }

        this.sendUpdateDraw()
    }

    // update (dt: number): void {
    //     this.updateDraw();
    // }
    updateDraw (drawHelper: DrawHelper) {
        drawHelper.drawXYAxle(this.node.convertToWorldSpaceAR(cc.Vec2.ZERO), this.left.position.x, this.right.position.x, this.down.position.y, this.up.position.y);

        if (this._drawTime) {
            clearTimeout(this._drawTime);
        }
        this._drawTime = setTimeout(() => {
            this.updateNumberLabel();
            this._drawTime = null;
        }, 34);
    }

    updateNumberLabel () {
        if (!this._labelNode) {
            this._labelNode = this.zero.children[0];
        }
        let scale = 20;
        let minX = Math.floor(this.left.position.x / scale);
        let maxX = Math.floor(this.right.position.x / scale);
        let minY = Math.floor(this.down.position.y / scale);
        let maxY = Math.floor(this.up.position.y / scale);

        if (minX != this._lastSize.x) {
            let check = this._lastSize.x;
            for (let i = check; i < minX; i++) {
                let labelNode = this._numberXLabels.get(i);
                if (labelNode) {
                    labelNode.removeFromParent();
                    this._numberXLabels.delete(i);
                }
            }

            for (let i = check - 1; i >= minX; i--) {
                if (i % 2 != 0) {
                    continue;
                }
                let labelNode = cc.instantiate(this._labelNode);
                labelNode.parent = this._labelNode.parent;
                labelNode.setPosition(i * scale, -12);
                this._numberXLabels.set(i, labelNode);

                labelNode.getComponent(cc.Label).string = "" + i;
            }
        }

        if (maxX != this._lastSize.y) {
            let check = this._lastSize.y;
            for (let i = check; i > maxX; i--) {
                let labelNode = this._numberXLabels.get(i);
                if (labelNode) {
                    labelNode.removeFromParent();
                    this._numberXLabels.delete(i);
                }
            }

            for (let i = check + 1; i <= maxX; i++) {
                if (i % 2 != 0) {
                    continue;
                }
                let labelNode = cc.instantiate(this._labelNode);
                labelNode.parent = this._labelNode.parent;
                labelNode.setPosition(i * scale, -12);
                this._numberXLabels.set(i, labelNode);

                labelNode.getComponent(cc.Label).string = "" + i;
            }
        }

        if (minY != this._lastSize.z) {
            let check = this._lastSize.z;
            for (let i = check; i < minY; i++) {
                let labelNode = this._numberYLabels.get(i);
                if (labelNode) {
                    labelNode.removeFromParent();
                    this._numberYLabels.delete(i);
                }
            }

            for (let i = check - 1; i >= minY; i--) {
                if (i % 2 != 0) {
                    continue;
                }
                let labelNode = cc.instantiate(this._labelNode);
                labelNode.parent = this._labelNode.parent;
                labelNode.setPosition(20, i * scale);
                this._numberYLabels.set(i, labelNode);

                labelNode.getComponent(cc.Label).string = "" + i;
            }
        }

        if (maxY != this._lastSize.w) {
            let check = this._lastSize.w;
            for (let i = check; i > maxY; i--) {
                let labelNode = this._numberYLabels.get(i);
                if (labelNode) {
                    labelNode.removeFromParent();
                    this._numberYLabels.delete(i);
                }
            }

            for (let i = check + 1; i <= maxY; i++) {
                if (i % 2 != 0) {
                    continue;
                }
                let labelNode = cc.instantiate(this._labelNode);
                labelNode.parent = this._labelNode.parent;
                labelNode.setPosition(20, i * scale);
                this._numberYLabels.set(i, labelNode);

                labelNode.getComponent(cc.Label).string = "" + i;
            }
        }

        this._lastSize.x = minX;
        this._lastSize.y = maxX;
        this._lastSize.z = minY;
        this._lastSize.w = maxY;
    }

    getInfo () {
        let info: any = super.getInfo();
        info.size = [this.left.position.x, this.right.position.x, this.down.position.y, this.up.position.y]
        info.showNumber = this.showNumber;
        info.showLine = this.showLine;

        return info;
    }

    setInfo (info) {
        super.setInfo(info);
        this.left.setPosition(info.size[0], 0);
        this.right.setPosition(info.size[1], 0);
        this.down.setPosition(0, info.size[2]);
        this.up.setPosition(0, info.size[3]);

        this.showLine = info.showLine;
        this.showNumber = info.showNumber;
    }

    // update (dt) {}
}
