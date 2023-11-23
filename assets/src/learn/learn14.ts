
import Triangle14 from "../component/triangle_14";
import TriangleComponent from "../component/triangle_component";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

let _tempVec2 = new cc.Vec2;

@ccclass
export default class Learn14 extends LearnBase {
    @property(Triangle14)
    triangle: Triangle14;

    @property(cc.Slider)
    slider: cc.Slider;

    _autoPlay: boolean = false;

    onSlice (slider: cc.Slider) {
        this.triangle.progress = slider.progress;
    }


    onAutoPlay () {
        this.slider.progress = 0;
        this.triangle.progress = this.slider.progress

        this._autoPlay = true;
    }

    onReset () {
        this.slider.progress = 0;
        this._autoPlay = false;
        this.triangle.progress = this.slider.progress
    }

    protected update (dt: number): void {
        if (this._autoPlay) {
            if (this.slider.progress < 1) {
                this.slider.progress = this.slider.progress + dt / 2;
                if (this.slider.progress > 1) {
                    this.slider.progress = 1;
                }
                this.triangle.progress = this.slider.progress;
            } else {
                this._autoPlay = false;
            }
        }
    }


}
