import Parallelogram from "../component/parallelogram_component";
import LearnBase from "./learn_base";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Learn6 extends LearnBase {
    @property(Parallelogram)
    parallelogram: Parallelogram


    onParallelogram () {
        this.parallelogram.setParallelogram(true);
    }

    onRect () {
        this.parallelogram.setRect(true);
    }

    onDiamond () {
        this.parallelogram.setDiamond(true);
    }
    // update (dt) {}
}
