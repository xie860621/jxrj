// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    @property(cc.Node)
    learnPanel: cc.Node = null;

    @property(cc.Label)
    label: cc.Label;

    @property(cc.EditBox)
    editBox: cc.EditBox;


    @property([cc.Prefab])
    learnPrefabs: cc.Prefab[] = [];

    _currentIndex: number = -1;
    _currentNode: cc.Node = null;


    protected start (): void {
        this.onChange();
    }

    onChange () {
        this._currentIndex = (this._currentIndex + 1) % this.learnPrefabs.length;

        if (this._currentNode) {
            this._currentNode.removeFromParent();
        }

        let prefab = this.learnPrefabs[this._currentIndex];

        let node = cc.instantiate(prefab);
        node.parent = this.learnPanel;

        this._currentNode = node;

        this.label.string = "当前：" + this._currentNode.name;
    }

    onGoto () {
        let num = Number(this.editBox.string);

        let str = "learn" + num;

        for (let i = 0; i < this.learnPrefabs.length; i++) {
            let prefab = this.learnPrefabs[i];
            if (prefab.name == str) {
                this._currentIndex = i - 1;
                this.onChange();
                return;
            }
        }

        // no find
    }
}
