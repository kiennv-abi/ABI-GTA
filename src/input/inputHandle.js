import { EventEmitter } from "events";

export const InputHandleEvent = Object.freeze({
  MouseDown: "mousedown",
  MouseMove: "mousemove",
  KeyDown: "keydown",
  MouseOut: "mouseout",
  MouseUp: "mouseup",
});
export class InputHandle {
  static init() {
    this.emitter = new EventEmitter();
    this.register();
  }

  static register(){
    document.body.addEventListener("mousedown", (e) => {
      this.emitter.emit(InputHandleEvent.MouseDown, (e));
    });

    document.body.addEventListener("mousemove", (e) => {
      this.emitter.emit(InputHandleEvent.MouseMove, (e));
    });

    document.body.addEventListener("keydown", (e) => {
      this.emitter.emit(InputHandleEvent.KeyDown, (e));
    });

    document.body.addEventListener("mouseout", (e) => {
      this.emitter.emit(InputHandleEvent.MouseOut, e);
    });

     document.body.addEventListener("mouseup", (e) => {
       this.emitter.emit(InputHandleEvent.MouseUp, e);
     });
  }

  static getEmitter(){
    return this.emitter;
  }
}