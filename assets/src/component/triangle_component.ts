import DrawHelper from "../draw_helper";
import { GlobalValue } from "../global";
import TouchPanel from "./touch_panel";

const { ccclass, property } = cc._decorator;

let _tempVec2 = new cc.Vec2;
let _tempVec2_1 = new cc.Vec2;
let _tempVec2_2 = new cc.Vec2;
let Green = new cc.Color;
cc.Color.fromHEX(Green, "9fff9e");
let BLUE = new cc.Color
cc.Color.fromHEX(BLUE, "23519a")

@ccclass
export default class TriangleComponent extends TouchPanel {
    @property(cc.Node)
    lenPanel: cc.Node;

    @property(Boolean)
    showAngle: boolean = true;
    @property(Boolean)
    showLength: boolean = true;

    @property(cc.Color)
    fillAngleColor = Green.clone();

    @property(cc.Color)
    strokeColor = BLUE.clone();

    @property(Boolean)
    isDotted = false;

    @property(Boolean)
    setAngleInfo: boolean = true;

    @property({ type: Number })
    angleA: number = 120;

    @property(Number)
    lenAB: number = 6;

    @property(Number)
    lenAC: number = 6;

    _mids: cc.Vec2[] = [new cc.Vec2, new cc.Vec2, new cc.Vec2];
    _midVec3s: cc.Vec3[] = [new cc.Vec3, new cc.Vec3, new cc.Vec3]

    _vertexs: any = [];
    _angles: number[] = [];
    _lens: number[] = []; // ab ac bc
    _dics: any = [];

    _isInit: boolean = false;


    /**
     * 序号，角度，方向，1为顺时针
     * @param index 
     * @param value 
     * @param dic 
     */
    setAngle (index, value, dic = 1) {
        this.updateAngle();

        let tarIndex = 1;
        let tarEdge = 1;
        if (dic > 0) {
            if (index == 0) { tarEdge = 1; tarIndex = 2 };
            if (index == 1) { tarEdge = 0; tarIndex = 0 };
            if (index == 2) { tarEdge = 2; tarIndex = 1 };
        } else {
            if (index == 0) { tarEdge = 0; tarIndex = 1 };
            if (index == 1) { tarEdge = 2; tarIndex = 2 };
            if (index == 2) { tarEdge = 1; tarIndex = 0 };
        }
        let ac = new cc.Vec2;
        cc.Vec2.subtract(ac, this.nodes[tarIndex].convertToWorldSpaceAR(cc.Vec2.ZERO), this.nodes[index].convertToWorldSpaceAR(cc.Vec2.ZERO))
        ac.rotate(cc.misc.degreesToRadians(value - this._angles[index]) * dic, ac);
        cc.Vec2.normalize(ac, ac);
        cc.Vec2.scaleAndAdd(_tempVec2, this.APosition, ac, this._lens[tarEdge] * GlobalValue.scale);
        this.nodes[tarIndex].setPosition(this.node.convertToNodeSpaceAR(_tempVec2));

        this.sendUpdateDraw()
    }

    setDic (index, dic1, dic2) {
        dic1.normalizeSelf()
        dic2.normalizeSelf()


        if (index == 0) {
            cc.Vec2.scaleAndAdd(_tempVec2_1, this.nodes[0].position, dic1, this._lens[0] * GlobalValue.scale);
            cc.Vec2.scaleAndAdd(_tempVec2_2, this.nodes[0].position, dic2, this._lens[1] * GlobalValue.scale);
        } else if (index == 1) {
            cc.Vec2.scaleAndAdd(_tempVec2_1, this.nodes[1].position, dic1, this._lens[0] * GlobalValue.scale);
            cc.Vec2.scaleAndAdd(_tempVec2_2, this.nodes[1].position, dic2, this._lens[2] * GlobalValue.scale);
        } else {
            cc.Vec2.scaleAndAdd(_tempVec2_1, this.nodes[2].position, dic1, this._lens[1] * GlobalValue.scale);
            cc.Vec2.scaleAndAdd(_tempVec2_2, this.nodes[2].position, dic2, this._lens[2] * GlobalValue.scale);
        }

        this._inAnimation = 0;
        let vecs = [_tempVec2_1, _tempVec2_2];
        for (let i = 0; i < 3; i++) {
            if (i == index) {
                continue;
            }
            this._inAnimation++;
            let p = vecs.shift();
            cc.tween(this.nodes[i]).to(2, { position: new cc.Vec3(p.x, p.y) }).call(() => {
                this._inAnimation--;
            }).start();
        }



        this.sendUpdateDraw()
    }

    setMinAngle (index, value) {
        this.updateAngle();

        let midAngle = (value - this._angles[index]) / 2 + this._angles[index];

        this.setAngle(index, midAngle, -1);
        this.setAngle(index, value);
    }

    setLength (o1, o2, len, doAnimation = false) {
        if (o1 < 0 || o1 > 2 || o2 < 0 || o2 > 2) {
            return;
        }
        this.updateAngle();
        let p1 = this.nodes[o1];
        let p2 = this.nodes[o2];
        let p12 = new cc.Vec2;
        cc.Vec2.subtract(p12, p2.convertToWorldSpaceAR(cc.Vec2.ZERO), p1.convertToWorldSpaceAR(cc.Vec2.ZERO));
        p12.normalizeSelf();

        cc.Vec2.scaleAndAdd(_tempVec2, p1.convertToWorldSpaceAR(cc.Vec2.ZERO), p12, len * GlobalValue.scale);
        let newPosition = this.node.convertToNodeSpaceAR(_tempVec2)
        if (doAnimation) {
            this._inAnimation++;
            cc.tween(p2).to(1, { position: new cc.Vec3(newPosition.x, newPosition.y) }).call(() => {
                this._inAnimation--;
            }).start()
        } else {
            p2.setPosition(newPosition);
            this.sendUpdateDraw();
        }
    }

    get A () {
        return this.nodes[0];
    }
    get B () {
        return this.nodes[1];
    }
    get C () {
        return this.nodes[2];
    }

    get APosition () {
        return this.nodes[0].convertToWorldSpaceAR(cc.Vec2.ZERO);
    }
    get BPosition () {
        return this.nodes[1].convertToWorldSpaceAR(cc.Vec2.ZERO);
    }
    get CPosition () {
        return this.nodes[2].convertToWorldSpaceAR(cc.Vec2.ZERO);
    }

    start () {
        this.init();
    }

    init () {
        if (this._isInit) {
            return;
        }

        if (this.setAngleInfo) {
            this.setLength(0, 1, this.lenAB);
            this.setLength(0, 2, this.lenAC);
            this.setMinAngle(0, this.angleA);
        }

        this._isInit = true;
    }

    updateDraw (drawHelper: DrawHelper): void {
        this.updateAngle();

        this._mids.forEach((mid, index) => {
            mid.normalizeSelf();
            this.nodes[index].getChildByName("label").setPosition(mid.x * -30, mid.y * -30);
        });
        if (this.showAngle) {
            // negate 会改变自身，所以这里需要驻意下
            drawHelper.drawAngle(this._vertexs[0], this._dics[0].negate(), this._dics[1], 1.5, 1, this.fillAngleColor);
            drawHelper.drawAngle(this._vertexs[1], this._dics[0].negate(), this._dics[2].negate(), 1.5, 2, this.fillAngleColor);
            drawHelper.drawAngle(this._vertexs[2], this._dics[1].negate(), this._dics[2].negate(), 1.5, 3, this.fillAngleColor);

            this._mids.forEach((mid, index) => {
                let angleNode = this.nodes[index].getChildByName("angle");
                angleNode.setPosition(mid.x * 80, mid.y * 80);
                angleNode.getComponent(cc.Label).string = Number(this._angles[index]).toFixed(2);
            });
        }

        if (this.showLength) {
            this._midVec3s.forEach((mid, index) => {
                let nVec2 = new cc.Vec2(-this._dics[index].y, this._dics[index].x);
                nVec2.normalizeSelf();
                this.lenPanel.children[index].setPosition(mid.x / 2 + nVec2.x * GlobalValue.scale, mid.y / 2 + nVec2.y * GlobalValue.scale);
                this.lenPanel.children[index].getComponent(cc.Label).string = Number(this._lens[index]).toFixed(2);
            });
        }

        drawHelper.drawVertexs(this._vertexs, this.isDotted, true, this.strokeColor);
    }

    updateAngle () {
        if (!this.nodes || this.nodes.length == 0) {
            this.nodes = this.node.children.concat([]);
        }

        this._vertexs.length = 0;
        this.nodes.forEach((node) => {
            if (node.name.indexOf("touchPoint") != -1) {
                this._vertexs.push(node.convertToWorldSpaceAR(cc.Vec2.ZERO));
            }
        });

        let vertexs = this._vertexs;
        let dic10 = vertexs[1].sub(vertexs[0]);
        let dic20 = vertexs[2].sub(vertexs[0]);
        let dic01 = vertexs[0].sub(vertexs[1]);
        let dic21 = vertexs[2].sub(vertexs[1]);
        let dic02 = vertexs[0].sub(vertexs[2]);
        let dic12 = vertexs[1].sub(vertexs[2]);

        cc.Vec2.add(this._mids[0], dic10, dic20);
        cc.Vec2.add(this._mids[1], dic01, dic21);
        cc.Vec2.add(this._mids[2], dic02, dic12);

        let angles = this._angles;
        this._angles.length = 0;
        angles.push(cc.misc.radiansToDegrees(cc.Vec2.angle(dic10, dic20)));
        angles.push(cc.misc.radiansToDegrees(cc.Vec2.angle(dic01, dic21)));
        angles.push(cc.misc.radiansToDegrees(cc.Vec2.angle(dic02, dic12)));

        cc.Vec3.add(this._midVec3s[0], this.nodes[0].position, this.nodes[1].position); // AB
        cc.Vec3.add(this._midVec3s[1], this.nodes[0].position, this.nodes[2].position); // AC
        cc.Vec3.add(this._midVec3s[2], this.nodes[1].position, this.nodes[2].position); // BC

        let lens = this._lens;
        lens.length = 0;
        lens.push(dic10.len() / GlobalValue.scale);
        lens.push(dic20.len() / GlobalValue.scale);
        lens.push(dic21.len() / GlobalValue.scale);
        let dics = this._dics;
        this._dics.length = 0;
        dics.push(dic01.normalizeSelf());
        dics.push(dic20.normalizeSelf());
        dics.push(dic12.normalizeSelf());
    }

    getInfo () {
        this.updateAngle();

        let info: any = super.getInfo();
        info.a = { x: this.nodes[0].position.x, y: this.nodes[0].position.y };
        info.b = { x: this.nodes[1].position.x, y: this.nodes[1].position.y };
        info.c = { x: this.nodes[2].position.x, y: this.nodes[2].position.y };
        info.showAngle = this.showAngle;
        info.showLength = this.showLength;

        return info;
    }

    setInfo (info) {
        super.setInfo(info);

        this.nodes[0].setPosition(info.a.x, info.a.y);
        this.nodes[1].setPosition(info.b.x, info.b.y);
        this.nodes[2].setPosition(info.c.x, info.c.y);

        this.showAngle = info.showAngle;
        this.showLength = info.showLength;
    }

    update (dt) {
        if (this._inAnimation > 0) {
            this.sendUpdateDraw();
        }
    }

    animationPoint (index, position) {
        this._inAnimation++;
        cc.tween(this.nodes[index]).to(2, { position: this.node.convertToNodeSpaceAR(position) }).call(() => {
            this._inAnimation--;
        }).start();
    }

}
