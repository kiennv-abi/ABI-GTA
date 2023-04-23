import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/util";
import { Spawner } from "../../../template-3d/scripts/spawners/spawner";
import { Time } from "../time/time";
import { Pointer, PointerEvent } from "./pointer";

export class MultiTouchManager {
  /**
   * @class MultiTouchManager
   * @param {HTMLCanvasElement} canvas
   */
  static init(canvas) {
    this.enabled = false;
    this.canvas = canvas;
    this.emitter = new pc.Entity();
    this.pointerSpawner = this.emitter.addScript(Spawner, {
      class    : Pointer,
      poolSize : 3,
    });
    this.pointers = [];
    this._tmpPos = { x: 0, y: 0 };
    this.isPointerDown = false;
    this._registerDOMEvents();
  }

  static _registerDOMEvents() {
    document.addEventListener("pointerdown", (e) => this._pointerDownEventHandler(e));
    document.addEventListener("pointermove", (e) => this._pointerMoveEventHandler(e));
    document.addEventListener("pointerup", (e) => this._pointerUpEventHandler(e));
  }

  /**
   * @param {PointerEvent} evt
   */
  static _pointerDownEventHandler(evt) {
    if (this.enabled === false) {
      return;
    }
    let position = { x: evt.clientX, y: evt.clientY };
    let pointer = this.pointerSpawner.spawn(this.emitter);
    pointer.setPosition(position.x, position.y, true);
    pointer.id = evt.pointerId;
    pointer.downTime = Time.current;
    pointer.startPosition = { x: position.x, y: position.y };
    this.pointers[evt.pointerId] = pointer;
    this.emitter.fire(PointerEvent.PointerDown, pointer);
  }

  /**
   * @param {PointerEvent} evt
   */
  static _pointerMoveEventHandler(evt) {
    if (this.enabled === false) {
      return;
    }

    if (!this.pointers[evt.pointerId]) {
      return;
    }
    let position = { x: evt.clientX, y: evt.clientY };
    if (Util.distanceBetween2D(position, this.pointers[evt.pointerId].position) > GameConstant.TOUCH_MOVE_THRESHOLD) {
      this.pointers[evt.pointerId].setPosition(position.x, position.y);
      let rad = this.pointers[evt.pointerId].getDirection();
      if (rad !== null) {
        let angle = Util.toDegree(rad);
        this.emitter.fire(PointerEvent.PointerMove, this.pointers[evt.pointerId], Util.angelToDirection(angle));
      }

    }

  }

  /**
   * @param {PointerEvent} evt
   */
  static _pointerUpEventHandler(evt) {
    if (this.enabled === false) {
      return;
    }

    if (!this.pointers[evt.pointerId]) {
      return;
    }
    let position = { x: evt.clientX, y: evt.clientY };
    this.pointers[evt.pointerId].downTime = 0;
    this.pointers[evt.pointerId].setPosition(position.x, position.y, true);
    this.emitter.fire(PointerEvent.PointerUp, this.pointers[evt.pointerId]);
    this.pointerSpawner.despawn(this.pointers[evt.pointerId]);
    this.pointers[evt.pointerId] = undefined;
  }

  /**
   * @param {string} event
   * @param {(pointerX?: number, pointerY?: number, startMouseX?: number)} callback
   */
  static registerEvent(event, callback) {
    this.emitter.on(event, callback);
  }

  /**
   * @param {string} event
   * @param {(pointerX?: number, pointerY?: number, startMouseX?: number)} callback
   */
  static removeEvent(event, callback) {
    this.emitter.off(event, callback);
  }

  static reset() {
    this.pointers.forEach((pointer) => {
      if (!pointer) {
        return;
      }
      this.pointerSpawner.despawn(pointer);
    });
    this.pointers = [];
  }
}
