import Parallelogram from "../component/parallelogram_component";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Learn6 extends cc.Component {
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
