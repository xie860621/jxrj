import DrawHelper from "../draw_helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchPanel extends cc.Component {
    @property(cc.Node)
    nodes: cc.Node[] = [];

    @property(Boolean)
    enableTouch: boolean = true;

    @property(Boolean)
    moveSelf: boolean = true;

    _inAnimation: boolean = false;

    public get inAnimation () {
        return this._inAnimation;
    }

    protected onEnable (): void {
        if (!this.enableTouch) {
            return;
        }
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            //    node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            //   node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        if (this.moveSelf) {
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        }
    }

    protected onDisable (): void {
        if (!this.enableTouch) {
            return;
        }
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            //  node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            //  node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        if (this.moveSelf) {
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        }
    }

    sendUpdateDraw () {
        this.node.dispatchEvent(new cc.Event.EventCustom('UpdateDraw', true));
    }

    onTouchStart () {

    }

    onTouchMove (event: cc.Event.EventTouch) {
        if (this._inAnimation) {
            return;
        }
        if (event.target != this.node) {
            event.target.position = this.node.convertToNodeSpaceAR(event.touch.getLocation())
        } else if (event.target == this.node) {
            event.target.position = this.node.parent.convertToNodeSpaceAR(event.touch.getLocation())
        }
        this.sendUpdateDraw();
    }

    onTouchEnd () {

    }


    updateDraw (drawHelper: DrawHelper) {
        // let zeroPosition = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        // zeroPosition.x += this.node.width / 2;
        // zeroPosition.y += this.node.height / 2;

        // //   drawHelper.drawXYAxle(zeroPosition);

        // // let vertexs: cc.Vec2[] = []
        // // this.nodes.forEach((node) => {
        // //     vertexs.push(node.convertToWorldSpaceAR(cc.Vec2.ZERO));
        // // });

        // // drawHelper.drawAngle(vertexs[0], vertexs[1].sub(vertexs[0]), vertexs[2].sub(vertexs[0]));
        // // drawHelper.drawAngle(vertexs[1], vertexs[0].sub(vertexs[1]), vertexs[2].sub(vertexs[1]));
        // // drawHelper.drawAngle(vertexs[2], vertexs[0].sub(vertexs[2]), vertexs[1].sub(vertexs[2]));


        // // drawHelper.drawVertexs(vertexs);
        // drawHelper.drawFunction("y=x*x-10", -10, 10, 0.1, zeroPosition);
    }

    getNodeWorldPosition (node: cc.Node) {
        return node.convertToWorldSpaceAR(cc.Vec2.ZERO)
    }

    getInfo () {
        return {
            enableTouch: this.enableTouch,
            moveSelf: this.moveSelf,
            position: { x: this.node.position.x, y: this.node.position.y }
        }
    }

    setInfo (info) {
        this.enableTouch = info.enableTouch;
        this.moveSelf = info.moveSelf;
        this.node.setPosition(info.position.x, info.position.y);
    }
    // update (dt) {}
}
