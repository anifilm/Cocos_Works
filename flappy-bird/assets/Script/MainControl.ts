import { _decorator, Component, Node, Sprite, Camera, Prefab, instantiate, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainControl')
export default class MainControl extends Component {
    @property(Sprite)
    spBg: Sprite[] = [null, null];

    @property(Prefab)
    pipePrefab: Prefab = null;

    pipe: Node[] = [null, null, null];

    // LIFE-CYCLE CALLBACKS:

    //onLoad () {}

    start() {
        // set camera ortho height 256
        const camera = this.node.getComponentInChildren(Camera);
        if (camera) {
            camera.orthoHeight = 256;
        }

        for (let i = 0; i < this.pipe.length; i++) {
            this.pipe[i] = instantiate(this.pipePrefab);
            this.node.addChild(this.pipe[i]);
            // set pipe position
            this.pipe[i].setPosition(200 + 200 * i, 0, 0);
            var minY = -120;
            var maxY = 120;
            // set pipe Y position randomly
            this.pipe[i].setPosition(this.pipe[i].position.x, minY + Math.random() * (maxY - minY), 0);
        }
    }

    update(deltaTime: number) {
        // move the background node
        for (let i = 0; i < this.spBg.length; i++) {
            const currentPos = this.spBg[i].node.position;
            const newX = currentPos.x - 1.0;
            this.spBg[i].node.setPosition(newX, currentPos.y, currentPos.z);
            if (newX <= -276) {
                this.spBg[i].node.setPosition(276, currentPos.y, currentPos.z);
            }
        }

        // move the pipe node
        for (let i = 0; i < this.pipe.length; i++) {
            const currentPos = this.pipe[i].position;
            const newX = currentPos.x - 2.0;
            this.pipe[i].setPosition(newX, currentPos.y, currentPos.z);
            if (newX <= -170) {
                this.pipe[i].setPosition(430, currentPos.y, currentPos.z);
                // set pipe Y position randomly
                var minY = -120;
                var maxY = 120;
                this.pipe[i].setPosition(this.pipe[i].position.x, minY + Math.random() * (maxY - minY), 0);
            }
        }
    }
}
