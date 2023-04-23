import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/util";

export const PointerEvent = Object.freeze({
  PointerDown : "pointerDown",
  PointerMove : "pointerMove",
  PointerUp   : "pointerUp",
});

export class Pointer extends pc.Entity {
  constructor() {
    super();
    this.position = { x: 0, y: 0 };
    this.lastPosition = { x: 0, y: 0 };
    this.id = 0;
    this.downTime = 0;
    this.startPosition = { x: 0, y: 0 };
  }

  setPosition(x, y, force = false) {
    let distance = Util.distanceBetween2D(this.position, { x, y });
    if (distance < GameConstant.TOUCH_MOVE_THRESHOLD && !force) {
      return;
    }
    this.lastPosition.x = this.position.x;
    this.lastPosition.y = this.position.y;
    this.position.x = x;
    this.position.y = y;
  }

  getDeltaPosition() {
    return {
      x : this.position.x - this.lastPosition.x,
      y : this.position.y - this.lastPosition.y,
    };
  }

  getDirection() {
    let delta = { x: this.position.x - this.startPosition.x, y: this.position.y - this.startPosition.y };
    let distance = Util.distanceBetween2D(delta, { x: 0, y: 0 });
    if (distance < GameConstant.TOUCH_MOVE_THRESHOLD * 10) {
      return null;
    }
    let angle = Math.atan2(delta.y, delta.x);
    return angle;
  }
}
