// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { GlobalValue } from "./global";

const { ccclass, property } = cc._decorator;

let _tempVec2 = new cc.Vec2;
let _tempVec2_2 = new cc.Vec2;
let _tempVec2_3 = new cc.Vec2
let _tempVec2_4 = new cc.Vec2
let LineWidth = 20;
let DottedWidth = 20;
let AngleGreenLine = new cc.Color;
cc.Color.fromHEX(AngleGreenLine, "3dff37");
let BLUE = new cc.Color
cc.Color.fromHEX(BLUE, "23519a")
let Green = new cc.Color;
cc.Color.fromHEX(Green, "9fff9e");
let FunBule = new cc.Color
cc.Color.fromHEX(FunBule, "b6d2ff");
let DotteColor = new cc.Color
cc.Color.fromHEX(DotteColor, "b0babe");

@ccclass
export default class DrawHelper extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    scale: number = GlobalValue.scale;

    _graphice: cc.Graphics;

    protected onLoad (): void {
        this._graphice = this.node.getComponent(cc.Graphics);
    }
    protected start (): void {
        // this.drawVertexs([new cc.Vec2(0, 0), new cc.Vec2(100, 100), new cc.Vec2(-100, 100)])
    }

    clear () {
        this._graphice.clear();
    }

    drawVertexs (vertexs: cc.Vec2[], isDotted: boolean = false, loop: boolean = true, strokeColor = null, fillColor = null) {
        if (vertexs.length < 2) {
            return;
        }

        this._graphice.lineWidth = 5;
        if (strokeColor) {
            this._graphice.strokeColor = strokeColor;
        } else {
            this._graphice.strokeColor = BLUE;
        }

        this._graphice.moveTo(vertexs[0].x, vertexs[0].y);
        for (let i = 0; i < vertexs.length - 1; i++) {
            if (isDotted) {
                this.senDottedLine(vertexs[i], vertexs[i + 1]);
            } else {
                this.drawLine(vertexs[i], vertexs[i + 1])
            }
        }

        if (loop) {
            if (isDotted) {
                this.senDottedLine(vertexs[vertexs.length - 1], vertexs[0]);
            } else {
                this.drawLine(vertexs[vertexs.length - 1], vertexs[0])
            }
        }

        if (fillColor != null) {
            this._graphice.fillColor = fillColor;
            this._graphice.fill();
        }

        this._graphice.stroke();
    }

    drawLine (start: { x, y }, end: { x, y }, isMove = false) {
        if (isMove) {
            this._graphice.moveTo(start.x, start.y);
        }
        this._graphice.lineTo(end.x, end.y);
    }

    // 需要优化
    senDottedLine (start: cc.Vec2, end: cc.Vec2) {
        cc.Vec2.subtract(_tempVec2, end, start);
        let len = _tempVec2.len();
        _tempVec2.normalizeSelf();

        cc.Vec2.copy(_tempVec2_2, _tempVec2);
        _tempVec2.multiplyScalar(LineWidth);
        _tempVec2_2.multiplyScalar(DottedWidth);
        let current = 0;
        let nowIsDotted = false;

        cc.Vec2.copy(_tempVec2_3, start);

        while (current < len) {
            let addLength = 0;
            if (nowIsDotted) {
                if (current + DottedWidth > len) {
                    //  addLength = len - DottedWidth;

                    // _tempVec2_2.normalize();
                    // _tempVec2_2.multiplyScalar(addLength);

                    // _tempVec2_3.x += _tempVec2_2.x;
                    // _tempVec2_3.y += _tempVec2_2.y;
                    break;

                } else {
                    addLength = DottedWidth;
                    _tempVec2_3.x += _tempVec2_2.x;
                    _tempVec2_3.y += _tempVec2_2.y;
                }
            } else {
                if (current + LineWidth > len) {
                    addLength = len - LineWidth;

                    _tempVec2.normalizeSelf();
                    _tempVec2.multiplyScalar(addLength);

                    _tempVec2_3.x += _tempVec2.x;
                    _tempVec2_3.y += _tempVec2.y;

                    break;
                } else {
                    addLength = LineWidth;
                    this._graphice.moveTo(_tempVec2_3.x, _tempVec2_3.y);
                    this._graphice.lineTo(_tempVec2_3.x + _tempVec2.x, _tempVec2_3.y + _tempVec2.y);

                    _tempVec2_3.x += _tempVec2.x;
                    _tempVec2_3.y += _tempVec2.y;
                }
            }
            nowIsDotted = !nowIsDotted;
            current = current + addLength;
        }
    }

    drawCicle (o: cc.Vec2, r: number) {
        this._graphice.circle(o.x, o.y, r);
    }

    // 一元二次方程
    drawFunction (funStr, minX, maxX, minY, maxY, space, position, isDotted = true) {
        let x = minX;
        let y = 0;
        let vertexs = [];
        let funMaxY = -999999;
        let maxPointX = 0;
        let maxPointY = 0;
        while (x <= maxX) {
            eval(funStr);  // x*2+1
            x += space;
            if (y < minY || y > maxY) {
                continue;
            }

            if (y > funMaxY) {
                funMaxY = y;
                maxPointX = x;
                maxPointY = y;
            }

            let point = new cc.Vec2(x * this.scale + position.x, y * this.scale + position.y);
            vertexs.push(point);
        }
        this.drawVertexs(vertexs, false, false, FunBule);
        this.drawVertexs([new cc.Vec2(maxPointX * this.scale + position.x, minY * this.scale + position.y), new cc.Vec2(maxPointX * this.scale + position.x, maxY * this.scale + position.y)], true, false, DotteColor);
        return { maxPointX, maxPointY }
    }

    drawAxle (position: cc.Vec2, minX, maxX, minY, maxY, drawNumber = true) {
        this._graphice.lineWidth = 4;
        this._graphice.strokeColor = FunBule;
        this.drawLine(new cc.Vec2(minX + position.x, position.y), new cc.Vec2(maxX + position.x, position.y), true);
        this.drawLine(new cc.Vec2(position.x, position.y + minY), new cc.Vec2(position.x, position.y + maxY), true);
        this._graphice.stroke();

        if (drawNumber) {
            this._graphice.lineWidth = 2;
            let h1 = 12 / this.scale;
            let h2 = 6 / this.scale;
            // 各种小刻度
            for (let index = 0; index < maxX; index += this.scale) {
                this.drawLine(new cc.Vec2(index + position.x, position.y), new cc.Vec2(index + position.x, position.y + this.scale * h1), true);
                this.drawLine(new cc.Vec2((index + this.scale * 0.5) + position.x, position.y), new cc.Vec2((index + this.scale * 0.5) + position.x, position.y + this.scale * h2), true);
            }
            for (let index = 0; index > minX; index -= this.scale) {
                this.drawLine(new cc.Vec2(index + position.x, position.y), new cc.Vec2(index + position.x, position.y + this.scale * h1), true);
                this.drawLine(new cc.Vec2((index + this.scale * 0.5) + position.x, position.y), new cc.Vec2((index + this.scale * 0.5) + position.x, position.y + this.scale * h2), true);
            }
            for (let index = 0; index < maxY; index += this.scale) {
                this.drawLine(new cc.Vec2(position.x, index + position.y), new cc.Vec2(position.x + this.scale * h1, index + position.y), true);
                this.drawLine(new cc.Vec2(position.x, (index + this.scale * 0.5) + position.y), new cc.Vec2(position.x + this.scale * h2, (index + this.scale * 0.5) + position.y), true);
            }
            for (let index = 0; index > minY; index -= this.scale) {
                this.drawLine(new cc.Vec2(position.x, index + position.y), new cc.Vec2(position.x + this.scale * h1, index + position.y), true);
                this.drawLine(new cc.Vec2(position.x, (index + this.scale * 0.5) + position.y), new cc.Vec2(position.x + this.scale * h2, (index + this.scale * 0.5) + position.y), true);
            }

            this._graphice.stroke();
        }
    }

    drawDottedCircle () {
        const ctx = this._graphice;
        if (!ctx) {
            return;
        }
        // 设置虚线的属性
        ctx.lineWidth = 5;
        ctx.strokeColor = cc.Color.RED;

        const spaceAngle = 10; //虚线间隔
        const deltaAngle = 10;

        const center = cc.v2(0, 0); //圆心
        const radius = 100;//圆半径

        // 绘制分割的虚线圆形
        for (let i = 0; i < 360; i += deltaAngle + spaceAngle) {
            const sRadian = cc.misc.degreesToRadians(i);
            const eRadian = cc.misc.degreesToRadians(i + deltaAngle);
            ctx.arc(center.x, center.y, radius, sRadian, eRadian, true);
            ctx.stroke();
        }
    }

    // todo
    drawRightAngle (center: cc.Vec2, dic: cc.Vec2, radius: number = 1) {
        const ctx = this._graphice;
        if (!ctx) {
            return;
        }
        ctx.lineWidth = 3;
        ctx.strokeColor = AngleGreenLine;

        cc.Vec2.multiplyScalar(_tempVec2, dic, radius * this.scale);

        let vertexs = [];
        dic.rotate(Math.PI / 2, _tempVec2_2);
        cc.Vec2.multiplyScalar(_tempVec2_2, _tempVec2_2, radius * this.scale);

        cc.Vec2.add(_tempVec2_3, _tempVec2, _tempVec2_2);

        _tempVec2_4.x = 0;
        _tempVec2_4.y = 0;

        vertexs.push(_tempVec2);
        vertexs.push(_tempVec2_3);
        vertexs.push(_tempVec2_2);
        vertexs.push(_tempVec2_4);

        vertexs.forEach((point) => {
            cc.Vec2.add(point, point, center);
        });

        this.fillVertexs(vertexs, Green);
        this.drawLine(vertexs[0], vertexs[1], true);
        this.drawLine(vertexs[1], vertexs[2], true);
        ctx.stroke();
    }

    fillVertexs (vertexs: cc.Vec2[], fillColor) {
        const ctx = this._graphice;
        if (!ctx) {
            return;
        }
        ctx.moveTo(vertexs[0].x, vertexs[0].y);
        for (let i = 0; i < vertexs.length - 1; i++) {
            this.drawLine(vertexs[i], vertexs[i + 1])
        }
        ctx.close();
        ctx.fillColor = fillColor;
        ctx.fill();
    }

    drawAngle (center: cc.Vec2, dic1: cc.Vec2, dic2: cc.Vec2, radius: number = 1, time = 1, fillColor = Green) {
        const ctx = this._graphice;
        if (!ctx) {
            return;
        }

        // 填充角度的话，需要设置为noraml
        // this._graphice.moveTo(center.x, center.y);
        // this._graphice.lineTo(point1.x, point1.y);
        // this._graphice.lineTo(point2.x, point2.y);

        let sRadian = cc.Vec2.RIGHT.signAngle(dic1);
        let eRadian = cc.Vec2.RIGHT.signAngle(dic2);

        if (sRadian < 0) {
            sRadian += Math.PI * 2;
        }

        if (eRadian < 0) {
            eRadian += Math.PI * 2;
        }

        let minR = Math.min(sRadian, eRadian);
        let maxR = Math.max(sRadian, eRadian);

        let counterclockwise = maxR - minR > Math.PI;

        // if (Math.abs((sRadian - eRadian) % Math.PI) > Math.PI) {
        //     let temp = sRadian;
        //     sRadian = eRadian;
        //     eRadian = temp;
        // }
        ctx.lineWidth = 4;
        ctx.strokeColor = AngleGreenLine;
        for (let i = 0; i < time; i++) {
            if (i == time - 1) {
                // dic1
                // dic2 
                let width = (radius - i * 0.2) * this.scale;
                ctx.arc(center.x, center.y, (radius - i * 0.2) * this.scale, minR, maxR, !counterclockwise);
                ctx.moveTo(center.x, center.y);
                ctx.lineTo(center.x + dic1.x * width, center.y + dic1.y * width);
                ctx.lineTo(center.x + dic2.x * width, center.y + dic2.y * width);
                ctx.fillColor = fillColor;
                ctx.fill();


            }
            ctx.arc(center.x, center.y, (radius - i * 0.2) * this.scale, minR, maxR, !counterclockwise);
            ctx.stroke();
        }

        //  ctx.stroke();
        // ctx.fillColor = cc.Color.RED;
        // ctx.fill();
        //  console.log(cc.misc.radiansToDegrees(Math.abs(sRadian - eRadian)));

        // 如果需要绘制，则需要2,2.2,2.5 为长度来划线，且
    }

    drawCircle (center: cc.Vec2, radius: number) {
        const ctx = this._graphice;
        if (!ctx) {
            return;
        }

        ctx.circle(center.x, center.y, radius)
        ctx.stroke();
    }
    // update (dt) {}
}
