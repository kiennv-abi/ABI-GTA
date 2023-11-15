import { Ray } from "playcanvas";
import { Script } from "../../../template/systems/script/script";

export const RaycastEvent = Object.freeze({
  CastMove: "raycast:castmove",
  CastDown: "raycast:castdown",
  CastUp: "raycast:castup",
});

export const Raycast = Script.createScript({
  name: "raycast",

  attributes: {
    camera: { default: null },
  },

  ray: null,

  initialize() {
    this.ray = new Ray();
  },

  onPointerDown(event) {
    if (event.changedTouches) {
      this.cast(event.changedTouches[0]);
    }
    else {
      this.cast(event);
    }
    this.fire(RaycastEvent.CastDown, this.ray);
  },

  onPointerMove(event) {
    if (event.changedTouches) {
      this.cast(event.changedTouches[0]);
    }
    else {
      this.cast(event);
    }
    this.fire(RaycastEvent.CastMove, this.ray);
  },

  onPointerUp(event) {
    if (event.changedTouches) {
      this.cast(event.changedTouches[0]);
    }
    else {
      this.cast(event);
    }
    this.fire(RaycastEvent.CastUp, this.ray);
  },

  cast(screenPosition) {
    this.camera.screenToWorld(screenPosition.x, screenPosition.y, this.camera.farClip, this.ray.direction);
    this.camera.screenToWorld(screenPosition.x, screenPosition.y, this.camera.nearClip, this.ray.origin);
    
    this.ray.direction.sub(this.ray.origin).normalize();
  },
});