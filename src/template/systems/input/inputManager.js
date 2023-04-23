import { Entity,
  EVENT_MOUSEDOWN,
  EVENT_MOUSEMOVE, EVENT_MOUSEUP,
  EVENT_TOUCHCANCEL,
  EVENT_TOUCHEND,
  EVENT_TOUCHMOVE,
  EVENT_TOUCHSTART } from "playcanvas";

export const InputManagerEvent = Object.freeze({
  PointerDown : "inputmanager:pointerdown",
  PointerMove : "inputmanager:pointermove",
  PointerUp   : "inputmanager:pointerup",
});

export class InputManager {
  static init(app) {
    this.app = app;
    this.emitter = new Entity();
    this._initMouse();
    this._initTouch();
  }

  static _initMouse() {
    let mouse = this.app.mouse;
    mouse.on(EVENT_MOUSEDOWN, (event) => this._handleInputEvent(event, this._onPointerDown.bind(this)));
    mouse.on(EVENT_MOUSEMOVE, (event) => this._handleInputEvent(event, this._onPointerMove.bind(this)));
    mouse.on(EVENT_MOUSEUP, (event) => this._handleInputEvent(event, this._onPointerUp.bind(this)));
  }

  static _initTouch() {
    let touch = this.app.touch;
    touch.on(EVENT_TOUCHSTART, (event) => this._handleInputEvent(event, this._onPointerDown.bind(this)));
    touch.on(EVENT_TOUCHMOVE, (event) => this._handleInputEvent(event, this._onPointerMove.bind(this)));
    touch.on(EVENT_TOUCHEND, (event) => this._handleInputEvent(event, this._onPointerUp.bind(this)));
    touch.on(EVENT_TOUCHCANCEL, (event) => this._handleInputEvent(event, this._onPointerUp.bind(this)));
  }

  static _handleInputEvent(event, callback) {
    event.event.preventDefault();
    callback(event);
  }

  static _onPointerDown(event) {
    this.emitter.fire(InputManagerEvent.PointerDown, event);
  }

  static _onPointerMove(event) {
    this.emitter.fire(InputManagerEvent.PointerMove, event);
  }

  static _onPointerUp(event) {
    this.emitter.fire(InputManagerEvent.PointerUp, event);
  }
}
