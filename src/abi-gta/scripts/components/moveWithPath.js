import { Vec3 } from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { Time } from "../../../template/systems/time/time";
import { CubeStackManager } from "../../objects/cube/cubeStackManager";

export const MoveWithPath = Script.createScript({
  name: "moveWithPath",

  attributes: {
    speed          : { default: 1 },
    delayTime      : { default: 0 },
    scaleDelayTime : { default: 0.01 },
  },

  interpolation : null,
  stopped       : false,
  targetNode    : null,

  initialize() {
    this.interpolation = new Vec3();
    this.targetNode = {
      position : new Vec3(),
      time     : 0,
    };
  },

  update() {
    if (!this.stopped) {
      this.checkNeedUpdate();
      this.interpolation.lerp(this.entity.getPosition(), this.targetNode.position, this.speed * Time.dt);
      this.entity.setPosition(this.interpolation);
      this.rotate();
    }
  },

  rotate() {
    let rot = this.entity.getRotation();
    let angle = Math.atan2(this.targetNode.position.x - this.entity.getPosition().x, this.targetNode.position.z - this.entity.getPosition().z);
    angle = angle * 180 / Math.PI;
    this.entity.setEulerAngles(rot.x, angle, rot.z);
  },

  checkNeedUpdate() {
    if (Time.current - this.delayTime > this.targetNode.time) {
      this.findNextTarget();
    }
  },

  findNextTarget() {
    let index = -1;
    let posQueue = CubeStackManager.positionQueue;
    for (let i = 0; i < posQueue.length; i++) {
      if (posQueue[i] === this.targetNode) {
        index = i;
        break;
      }
    }

    if (index < posQueue.length - 1) {
      index += 1;
    }

    if (index !== -1) {
      this.targetNode = posQueue[index];
    }
  },

  reset(delayTime) {
    this.delayTime = delayTime;
    let posQueue = CubeStackManager.positionQueue;
    for (let i = 0; i < posQueue.length; i++) {
      if (posQueue[i].time + this.delayTime > Time.current) {
        this.targetNode = posQueue[i];
        break;
      }
    }
  },

});
