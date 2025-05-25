import { _decorator, Component, Node, Sprite, Camera, Prefab, instantiate, Button, Label, RigidBody2D, Vec2, director } from 'cc';
const { ccclass, property } = _decorator;

export enum GameStates {
    READY = 0,
    PLAYING,
    GAME_OVER,
}

@ccclass('MainControl')
export default class MainControl extends Component {
    @property(Sprite)
    spBg: Sprite[] = [null, null];

    @property(Sprite)
    spBase: Sprite[] = [null, null];

    @property(Label)
    lblScore: Label = null;

    @property(Prefab)
    pipePrefab: Prefab = null;

    pipe: Node[] = [null, null, null];

    gameScore: number = 0;

    spGameStart: Sprite = null;
    spGameOver: Sprite = null;
    btnStart: Button = null;
    btnRetry: Button = null;

    gameStatus: GameStates = GameStates.READY;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.spGameStart = this.node.getChildByName('GameStart').getComponent(Sprite);
        this.spGameStart.enabled = true;
        this.btnStart = this.node.getChildByName('StartButton').getComponent(Button);
        this.btnStart.node.active = true;
        this.btnStart.node.on(Button.EventType.CLICK, this.onStartButtonClick, this);

        this.spGameOver = this.node.getChildByName('GameOver').getComponent(Sprite);
        this.spGameOver.node.active = true;
        this.spGameOver.enabled = false;
        this.btnRetry = this.node.getChildByName('RetryButton').getComponent(Button);
        this.btnRetry.node.active = false;
        this.btnRetry.node.on(Button.EventType.CLICK, this.onStartButtonClick, this);

        this.lblScore.node.active = true;
        this.lblScore.enabled = false;
    }

    start() {
        // set camera ortho height 256
        const camera = this.node.getComponentInChildren(Camera);
        if (camera) {
            camera.orthoHeight = 256;
        }

        for (let i = 0; i < this.pipe.length; i++) {
            this.pipe[i] = instantiate(this.pipePrefab);
            this.node.getChildByName('Pipe').addChild(this.pipe[i]);
            // set pipe position
            this.pipe[i].setPosition(300 + 200 * i, 0, 0);
            var minY = -120;
            var maxY = 120;
            // set pipe Y position randomly
            this.pipe[i].setPosition(this.pipe[i].position.x, minY + Math.random() * (maxY - minY), 0);
        }
    }

    update(deltaTime: number) {
        if (this.gameStatus !== GameStates.PLAYING) return;

        // move the background node
        for (let i = 0; i < this.spBg.length; i++) {
            const currentPos = this.spBg[i].node.position;
            const newX = currentPos.x - 0.5;
            this.spBg[i].node.setPosition(newX, currentPos.y, currentPos.z);
            if (newX <= -276) {
                this.spBg[i].node.setPosition(276, currentPos.y, currentPos.z);
            }
        }

        // move the base node
        for (let i = 0; i < this.spBase.length; i++) {
            const currentPos = this.spBase[i].node.position;
            const newX = currentPos.x - 2.0;
            this.spBase[i].node.setPosition(newX, currentPos.y, currentPos.z);
            if (newX <= -312) {
                this.spBase[i].node.setPosition(312, currentPos.y, currentPos.z);
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
                var minY = -90;
                var maxY = 120;
                this.pipe[i].setPosition(this.pipe[i].position.x, minY + Math.random() * (maxY - minY), 0);
            }
        }
    }

    onStartButtonClick() {
        this.spGameStart.enabled = false;
        this.spGameOver.enabled = false;

        this.btnStart.node.active = false;
        this.btnRetry.node.active = false;

        this.gameStatus = GameStates.PLAYING;

        this.gameScore = 0;
        this.lblScore.enabled = true;
        this.lblScore.string = this.gameScore.toString();

        // Reset pipes position
        for (let i = 0; i < this.pipe.length; i++) {
            // set pipe position
            this.pipe[i].setPosition(300 + 200 * i, 0, 0);
            var minY = -90;
            var maxY = 120;
            // set pipe Y position randomly
            this.pipe[i].setPosition(this.pipe[i].position.x, minY + Math.random() * (maxY - minY), 0);
        }

        // Reset angle and position of bird
        const birdNode = this.node.getChildByName('Bird');
        birdNode.setPosition(0, 0, 0);
        birdNode.setRotationFromEuler(0, 0, 0);
        const rigidbody = birdNode.getComponent(RigidBody2D);
        if (rigidbody) {
            rigidbody.gravityScale = 0;
            rigidbody.linearVelocity = new Vec2(0, 0);
            rigidbody.angularVelocity = 0;
        }
    }

    gameOver() {
        this.gameStatus = GameStates.GAME_OVER;
        this.spGameOver.enabled = true;
        this.btnRetry.node.active = true;
    }
}
