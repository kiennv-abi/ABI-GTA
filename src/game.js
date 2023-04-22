import * as pc from "playcanvas";
import { ActionPhysicsReset } from "../assets/libs/action-physics-reset";
import { RenderPhysics } from "../assets/libs/render-physics";
import { TrackingCamera } from "../assets/libs/tracking-camera";
import { vehicleScript } from "../assets/libs/vehicle";
import {loadObitCameraPlugin} from  "../src/orbit-camera";
import { AssetLoader } from "./assetLoader/assetLoader";

export class Game {
  
  static init() {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    this.app = new pc.Application(canvas, {
      elementInput: new pc.ElementInput(canvas),
      keyboard: new pc.Keyboard(window),
      mouse: new pc.Mouse(canvas),
      touch: new pc.TouchDevice(canvas),
    });
    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
    this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
    window.addEventListener("resize", () => this.app.resizeCanvas);

    pc.WasmModule.setConfig("Ammo", {
      glueUrl: "../assets/libs/ammo.wasm.js",
      wasmUrl: "../assets/libs/ammo.wasm.wasm",
      fallbackUrl: "../assets/libs/ammo.js",
    });
    loadObitCameraPlugin();
    vehicleScript();
    RenderPhysics();
    TrackingCamera();
    ActionPhysicsReset();
    pc.WasmModule.getInstance("Ammo", () => {
      AssetLoader.loadAssets(this.app, () => {
        this.app.start();
        this.app.on("update", this.update, this);
      });
    });
  }

  static update(dt) {
    
  }

  static resize(screenSize) {
    if (this.gameCreated) {
      this.width = screenSize.width;
      this.height = screenSize.height;
      this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
      this.app.resizeCanvas(this.width, this.height);
      SceneManager.resize();
      this.app.fire("resize");
    }
  }
}

window.addEventListener("contextmenu", (e) => e.preventDefault());
// eslint-disable-next-line no-undef

window.onload = function () {
  Game.init();
}

window.addEventListener("resize", (event) => {
  Game.resize({ width: window.innerWidth, height: window.innerHeight})
});

