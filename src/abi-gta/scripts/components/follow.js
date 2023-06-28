import { Vec3 } from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { Time } from "../../../template/systems/time/time";

export const Follow = Script.createScript({
  name: "follow",

  attributes: {
    target   : {},
    speed    : { default: 1 },
    offset   : { default: new Vec3() },
  },

  _targetPos : null,
  _tmpPos    : null,

  initialize() {
    this._tmpPos = new Vec3();
    this._targetPos = new Vec3();
  },

  update() {
    this._targetPos.add2(this.target.getPosition(), this.offset);
    this._targetPos.set(this._targetPos.x, 0, this._targetPos.z);
    // this._tmpPos.lerp(this.entity.getPosition(), this._targetPos, this.speed * Time.dt);
    this.entity.setPosition(this._targetPos);
  },
});
