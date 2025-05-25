import { _decorator, Contact2DType, PhysicsSystem2D, Collider2D, RigidBody2D, Component, EventTouch, input, Input, Vec2 } from 'cc';
import MainControl, { GameStates } from './MainControl';
const { ccclass, property } = _decorator;

@ccclass('BirdControl')
export default class BirdControl extends Component {
    speed: number = 0;
    mainControl: MainControl = null;

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.mainControl = this.node.parent.getComponent(MainControl);
    }

    start() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        const rigidbody = this.getComponent(RigidBody2D);
        if (rigidbody) {
            rigidbody.gravityScale = 0;
            rigidbody.linearVelocity = new Vec2(0, 0);
            rigidbody.angularVelocity = 0;
        }
    }

    update(deltaTime: number) {
        if (this.mainControl.gameStatus !== GameStates.PLAYING) return;

        this.speed -= 0.098;
        const pos = this.node.getPosition();
        pos.y += this.speed;
        this.node.setPosition(pos);

        var angle = (this.speed * 0.3) * 30;
        if (angle <= -90) {
            angle = -90;
        }
        this.node.setRotationFromEuler(0, 0, angle);
    }

    onTouchStart(event: EventTouch) {
        this.speed = 3;
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (this.mainControl.gameStatus !== GameStates.PLAYING) return;

        if (otherCollider.node.name === 'PipeUp' || otherCollider.node.name === 'PipeDown' || otherCollider.node.name === 'Ground') {
            console.log('Game Over!');
            this.mainControl.gameOver();

            const rigidbody = this.getComponent(RigidBody2D);
            if (rigidbody) {
                rigidbody.gravityScale = 1;
            }
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.node.name === 'Point') {
            this.mainControl.gameScore += 1;
            this.mainControl.lblScore.string = this.mainControl.gameScore.toString();
        }
    }
}
