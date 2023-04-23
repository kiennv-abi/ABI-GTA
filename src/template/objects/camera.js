import { PROJECTION_ORTHOGRAPHIC } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helpers/util";
import { ObjectFactory } from "./objectFactory";

export class Camera {
  static init() {
    this._initMainCamera();

    this.reset();
    this.initialized = true;
  }

  static _initMainCamera() {
    this.main = ObjectFactory.createCamera("camera_main", {
      clearColor  : Util.createColor(1, 1, 1),
      projection  : PROJECTION_ORTHOGRAPHIC,
      orthoHeight : 20,
      nearClip    : -100,
      farClip     : 5000,
    });
  }

  static reset() {
    this.offsetY = 0;
    this.main.setLocalPosition(GameConstant.CAMERA_X, GameConstant.CAMERA_Y, GameConstant.CAMERA_Z);
    this.main.setLocalEulerAngles(GameConstant.CAMERA_ROTATE_X, GameConstant.CAMERA_ROTATE_Y, GameConstant.CAMERA_ROTATE_Z);
    this._destroyChildren();
  }

  static _destroyChildren() {
    while (this.main.children.length > 0) {
      let child = this.main.children[0];
      this.main.removeChild(child);
      child.destroy && child.destroy();
    }
  }
}
