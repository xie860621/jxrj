// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import DrawHelper from "../draw_helper";
import LearnBase from "../learn/learn_base";
import EditLabelComponent from "./edit_label_component";
import TouchPanel from "./touch_panel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchAreaComponent extends cc.Component {
    @property(DrawHelper)
    drawHelper: DrawHelper;

    @property(cc.EditBox)
    editBox: cc.EditBox;
    @property(cc.Node)
    learnNode: cc.Node;

    //  _editLabels: EditLabelComponent[] = [];

    _updateDrawTimeOut = null;
    _lastTouchEndTime = 0;
    _currLabel: cc.Label = null;
    _currString: string = "";
    onLoad () {
        this.node.on("UpdateDraw", this.updateDraw, this);

        //   this._editLabels = this.getComponentsInChildren(EditLabelComponent);
    }

    protected start (): void {
        this.updateDraw();
    }

    enabledTouch (): void {
        let touchPanels = this.getComponentsInChildren(TouchPanel);
        touchPanels.forEach((comJs) => {
            if (comJs.enableTouch) {
                let editLabels = comJs.node.getComponentsInChildren(EditLabelComponent)
                editLabels.forEach((com) => {
                    let label = com.node.getChildByName("label")
                    label.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
                })
            }
        })
    }

    disableTouch (): void {
        let touchPanels = this.getComponentsInChildren(TouchPanel);
        touchPanels.forEach((comJs) => {
            if (comJs.enableTouch) {
                let editLabels = comJs.node.getComponentsInChildren(EditLabelComponent)
                editLabels.forEach((com) => {
                    let label = com.node.getChildByName("label")
                    label.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
                })
            }
        })
    }

    onTouchEnd (event: cc.Event.EventTouch) {
        if (Date.now() - this._lastTouchEndTime < 200) {
            let node: cc.Node = event.target;
            this._currLabel = node.getComponent(cc.Label);
            if (this._currLabel) {
                this._currString = "" + this._currLabel.string;
                this._currLabel.string = "";

                this.editBox.node.active = true;
                this.editBox.node.setPosition(this.node.convertToNodeSpaceAR(this._currLabel.node.convertToWorldSpaceAR(cc.Vec2.ZERO)));
                this.editBox.string = this._currString;
                this.editBox.fontSize = this._currLabel.fontSize;
                this.editBox.node.color = this._currLabel.node.color;


                let editLabel = node.parent.getComponent(EditLabelComponent);
                if (editLabel.strType == 1) {
                    this.editBox.inputMode = cc.EditBox.InputMode.NUMERIC;
                } else {
                    this.editBox.inputMode = cc.EditBox.InputMode.ANY;
                }

                this.editBox.setFocus();
            }

        }
        this._lastTouchEndTime = Date.now();
    }

    onEditEnd (): void {
        if (this._currLabel) {
            this._currLabel.string = this.editBox.string;
        }

        this.editBox.node.active = false;

        this.updateEdit();
    }


    updateEdit () {
        let touchPanels = this.getComponentsInChildren(LearnBase);
        touchPanels.forEach((panelJs) => {
            if (panelJs.enabled && panelJs.node.active) {
                panelJs.updateEdit();
            }
        });
    }

    updateDraw () {
        if (this._updateDrawTimeOut) {
            return;
        }
        this._updateDrawTimeOut = setTimeout(() => {
            this._updateDrawTimeOut = null;
            this.drawHelper.clear();
            let touchPanels = this.getComponentsInChildren(TouchPanel);
            touchPanels.forEach((panelJs) => {
                if (panelJs instanceof LearnBase) {
                    return;
                }
                if (panelJs.enabled && panelJs.node.active) {
                    panelJs.updateDraw(this.drawHelper);
                }
            });

            let learns = this.getComponentsInChildren(LearnBase);
            learns.forEach((panelJs) => {
                if (panelJs.enabled && panelJs.node.active) {
                    panelJs.updateDraw(this.drawHelper);
                }
            });
        });

    }

    // update (dt) {}
}
