import { _decorator, Component, EventTouch, input, Input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BirdControl')
export default class BirdControl extends Component {
    // Speed of bird
    speed: number = 0;

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    start() {

    }

    update(deltaTime: number) {
        this.speed -= 0.098;
        const pos = this.node.getPosition();
        pos.y += this.speed;
        this.node.setPosition(pos);

        var angle = (this.speed / 2) * 20;
        if (angle <= -90) {
            angle = -90;
        }
        this.node.setRotationFromEuler(0, 0, angle);
    }

    onTouchStart(event: EventTouch) {
        this.speed = 3;
    }

    onCollisionEnter(other: Node, self: Node) {
        // Handle collision with pipes or ground
        console.log("Collision detected with", other.name);
        // You can add logic here to handle game over or score updates
    }
}
