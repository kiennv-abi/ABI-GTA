import { Vec2, Vec3, log } from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { Time } from "../../../template/systems/time/time";

export const PlayerMovement = Script.createScript({
  name: "swipeMovement",
  attributes: {
    speed: { default: 1 },
  },

  touchedDown: false,
  startPos: new Vec3(),
  currPos: new Vec2(),
  _tmpPos: new Vec3(),


  onEnable() {
    // Avoid big move distance when swipe on disabled
    this.startPos = this.currPos;
  },

  update() {
    if (!this.touchedDown) {
      return;
    }
    let distance = this.currPos.clone().sub(this.startPos).length();
    if (distance < 0.1) { 
      return;
    }
    var direction = this.currPos.clone().sub(this.startPos).normalize();
    var xMovement = direction.x * this.speed * Time.dt;
    var zMovement = direction.y * this.speed * Time.dt;
    this.rotate(direction);
    this._tmpPos.copy(this.entity.getPosition());
    this._tmpPos.x += xMovement;
    this._tmpPos.z += zMovement;
    this.entity.setPosition(this._tmpPos);
  },

  rotate(direction) {
    let rot = this.entity.getRotation();
    let angle = Math.atan2(direction.x, direction.y);
    angle = angle * 180 / Math.PI;
    this.entity.setEulerAngles(rot.x, angle, rot.z);
  },

  onPointerDown(event) {
    this.touchedDown = true;

    if (event.touches && event.touches[0]) {
      this.setStart(event.touches[0]);
    }
    else {
      this.setStart(event);
    }
  },

  onPointerMove(event) {
    if (!this.touchedDown) {
      return;
    }

    if (event.touches && event.touches[0]) {
      this.setMove(event.touches[0]);
    }
    else {
      this.setMove(event);
    }
  },

  onPointerUp() {
    this.touchedDown = false;
    this.startPos = new Vec2();
    this.currPos = new Vec2();
  },

  setStart(position) {
    this.startPos = new Vec2(position.x, position.y);
    this.touchedDown = true;
  },

  setMove(position) {
    this.currPos = new Vec2(position.x, position.y);
  },

});
