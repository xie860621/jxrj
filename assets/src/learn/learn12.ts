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

    @property(cc.Slider)
    slider1: cc.Slider;

    @property(cc.Slider)
    slider2: cc.Slider;

    _pool: cc.NodePool = new cc.NodePool;

    startNumber: number = 1;
    endNumber: number = 152;

    MAX: number = 299;

    // update (dt) {}
    init () {
        this.updateSliderEdit(this.startNumber, this.endNumber);
        this.doFunc()
    }

    onSlider1 () {
        let start = 1 + this.slider1.progress * this.MAX;
        this.updateSliderEdit(Math.floor(start), this.endNumber);
    }

    onSlider2 () {
        let end = this.slider2.progress * this.MAX;
        this.updateSliderEdit(this.startNumber, Math.floor(end));
    }

    updateSliderEdit (start, end) {
        start = cc.misc.clampf(start, 1, this.MAX);
        end = cc.misc.clampf(end, start, this.MAX);

        this.startNumber = start;
        this.endNumber = end;
        this.startLabel.string = start;
        this.endLabel.string = end;
        this.doFunc();
    }

    doFunc () {
        let list = this.layout.node.children.concat();
        list.forEach((node) => {
            this._pool.put(node);
        });

        let n = 30;
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
        let index = 0;
        for (let i = 0; i < n; i++) {
            let str = "";
            for (let j = 0; j < n - i - 1; j++)
                str += "";
            p = 1;
            for (let j = n - i - 1; p < i + 2; j = j + 2) {
                index++;
                if (index > this.endNumber) {
                    str += "             ";
                    p = p + 1;
                    continue;
                }
                if (index >= this.startNumber) {
                    if (arr[i][j] < 10000) {
                        str += " ";
                        if (arr[i][j] < 1000) {
                            str += " ";
                            if (arr[i][j] < 100) {
                                str += " ";
                                if (arr[i][j] < 10) {
                                    str += " ";
                                }
                            }
                        }
                    }
                    str += arr[i][j];
                }
                else {
                    str += "     "
                }
                str += "    ";//    
                p = p + 1;
            }
            //    console.log(str);
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
