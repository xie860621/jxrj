import CircleComponent from "../component/circle_component";
import LineComponent from "../component/line_component";
import Parallelogram from "../component/parallelogram_component";
import TriangleComponent from "../component/triangle_component";
import DrawHelper from "../draw_helper";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec3 = new cc.Vec3
@ccclass
export default class Learn12 extends LearnBase {
    @property(cc.Label)
    label: cc.Label;
    @property(cc.Layout)
    layout: cc.Layout;

    @property(cc.Label)
    startLabel;

    @property(cc.Label)
    endLabel;

    _pool: cc.NodePool = new cc.NodePool;

    startLine: number = 1;
    endLine: number = 15;

    // update (dt) {}
    init () {
        this.doFunc()
    }

    updateEdit () {
        this.startLine = cc.misc.clampf(Number(this.startLabel.string), 0, 999);
        this.endLine = cc.misc.clampf(Number(this.endLabel.string), this.startLine, 999);
        this.doFunc();
    }

    doFunc () {
        let list = this.layout.node.children.concat();
        list.forEach((node) => {
            this._pool.put(node);
        });

        let n = this.endLine;
        let m = 2 * n - 1;
        const arr = new Array(n).fill('').map(item => new Array(m).fill(0))
        for (let i = 0; i < n; i++) {
            arr[i][n - i - 1] = 1;
            arr[i][n + i - 1] = 1;
        }
        for (let i = 2; i < n; i++) {
            for (let j = n - i + 1; j < n - 2 + i; j = j + 2)
                arr[i][j] = arr[i - 1][j - 1] + arr[i - 1][j + 1];
        }
        let p;
        for (let i = 0; i < n; i++) {
            let str = "";
            for (let j = 0; j < n - i - 1; j++)
                str += "";
            p = 1;
            for (let j = n - i - 1; p < i + 2; j = j + 2) {
                if (arr[i][j] < 1000) {
                    str += " ";
                    if (arr[i][j] < 100) {
                        str += " ";
                        if (arr[i][j] < 10) {
                            str += " ";
                        }
                    }
                }
                str += arr[i][j];
                str += "    ";//    
                p = p + 1;
            }
            //    console.log(str);
            if (i >= this.startLine - 1) {
                let node;
                if (this._pool.size() > 0) {
                    node = this._pool.get();
                } else {
                    node = cc.instantiate(this.label.node) as cc.Node;
                }
                node.parent = this.layout.node;
                node.getComponent(cc.Label).string = str;
            }
        }
    }
}
