import { Vec3 } from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { Time } from "../../../template/systems/time/time";

export const Rotate = Script.createScript({
  name: "rotate",
  attributes: {
    speed: { default: new Vec3() }
  },

  _tempRot: null,

  initialize() {
    this._tempRot = new Vec3();
  },

  update() {
    this.entity.rotateLocal(
      this.speed.x * Time.dt,
      this.speed.y * Time.dt,
      this.speed.z * Time.dt,
    );
  },
});