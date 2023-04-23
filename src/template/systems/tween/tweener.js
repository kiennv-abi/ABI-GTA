import TWEEN from "@tweenjs/tween.js";
import { Time } from "../time/time";

export class Tweener extends TWEEN.Tween {
  constructor(object, group) {
    super(object, group);
  }

  start() {
    return super.start(Time.currentMS);
  }
}
