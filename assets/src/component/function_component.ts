// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import DrawHelper from "../draw_helper";
import TouchPanel from "./touch_panel";
import { GlobalValue } from "../global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FunctionComponent extends TouchPanel {
    @property(String)
    funStr: string = "";
    @property(String)
    nFunStr: string = "";
    @property
    minX: number = -6;
    @property
    maxX: number = 6;
    @property
    minY: number = -6;
    @property
    maxY: number = 6;
    @property
    space: number = 0.1;
    @property(Boolean)
    showDotted: boolean = true;

    _maxPointX: number = 0;
    _maxPointY: number = 0;

    _functionVertexs = [];
    _functionDotted = [];


    get maxPointX () {
        return this._maxPointX;
    }

    get maxPointY () {
        return this._maxPointY;
    }

    evalFunction () {
        let x = this.minX;
        let y = 0;
        let funMaxY = -999999;

        this._functionVertexs.length = 0;
        this._functionDotted.length = 0;

        let pos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO)

        while (x <= this.maxX) {
            eval(this.funStr);  // x*2+1
            x += this.space;
            if (y < this.minY || y > this.maxY) {
                continue;
            }
            if (y > funMaxY) {
                funMaxY = y;
                this._maxPointX = x;
                this._maxPointY = y;
            }
            this._functionVertexs.push({ x: x * GlobalValue.scale + pos.x, y: y * GlobalValue.scale + pos.y })
        }

        if (this.showDotted) {
            this._functionDotted.push({ x: this._maxPointX * GlobalValue.scale + pos.x, y: this.minY * GlobalValue.scale + pos.y }, { x: this._maxPointX * GlobalValue.scale + pos.x, y: this.maxY * GlobalValue.scale + pos.y })

        }
    }

    updateDraw (drawHelper: DrawHelper): void {
        this.evalFunction();
        drawHelper.drawVertexs(this._functionVertexs, false, false);
        drawHelper.drawVertexs(this._functionDotted, true, false);
    }

    doFunction (x: number) {
        let y = 0;
        try {
            eval(this.funStr)
            return y;
        } catch (error) {
            return 0;
        }
        // Math.sqrt(4 - y) + 1
    }

    doNFunction (y: number) {
        if (!this.nFunStr || this.nFunStr == "") {
            return;
        }
        let x = 0;
        try {
            eval(this.nFunStr)
            return x;
        } catch (error) {
            return 0;
        }
    }
}
