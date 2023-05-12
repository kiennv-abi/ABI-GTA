import { ActionPhysicsReset } from "../assets/libs/action-physics-reset";
import { RenderPhysics } from "../assets/libs/render-physics";
import { TrackingCamera } from "../assets/libs/tracking-camera";
import { vehicleScript } from "../assets/libs/vehicle";
import { loadObitCameraPlugin } from  "../src/orbit-camera";
import { AssetLoader } from "./assetLoader/assetLoader";
import { SceneManager } from "./template/scene/sceneManager";
import { SelectScene } from "./abi-gta/scenes/selecScene";
import { GameConstant } from "./gameConstant";
import { InputManager } from "./template/systems/input/inputManager";
import { GameState, GameStateManager } from "./template/gameStateManager";
import { Time } from "./template/systems/time/time";
import { Tween } from "./template/systems/tween/tween";
import { Application, ElementInput, Keyboard, Mouse, TouchDevice, FILLMODE_FILL_WINDOW, RESOLUTION_AUTO, WasmModule } from "playcanvas";
import "./template/extensions/index";
import { Configurator } from "./abi-gta/configtor/configtor";
import { MapEditorScene } from "./abi-gta/scenes/mapEditorScene";
import { DataManager } from "./abi-gta/data/dataManager";
import { SelectCarScreenEvent } from "./abi-gta/ui/screens/selectCarScreen";
import { MapEditorScreenEvent } from "./abi-gta/ui/screens/mapEditorScreen";
import { PlayScene } from "./abi-gta/scenes/playScene";
export class Game {
  
  static init() {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    this.app = new Application(canvas, {
      elementInput: new ElementInput(canvas),
      keyboard: new Keyboard(window),
      mouse: new Mouse(canvas),
      touch: new TouchDevice(canvas),
    });
    this.app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
    this.app.setCanvasResolution(RESOLUTION_AUTO);
    this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
    window.addEventListener("resize", () => this.app.resizeCanvas);

    WasmModule.setConfig("Ammo", {
      glueUrl: "../assets/libs/ammo.wasm.js",
      wasmUrl: "../assets/libs/ammo.wasm.wasm",
      fallbackUrl: "../assets/libs/ammo.js",
    });
    loadObitCameraPlugin();
    vehicleScript();
    RenderPhysics();
    TrackingCamera();
    ActionPhysicsReset();
    WasmModule.getInstance("Ammo", () => {
      AssetLoader.loadAssets(this.app, () => {
        this.load();
        this.create();
      });
    });
  }

  static load() {
    InputManager.init(this.app);
    GameStateManager.init(GameState.Intro);
    Time.init(this.app);
    Tween.init(this.app);
    Configurator.config(this.app);
    DataManager.init();
    this.app.start();
    this.app.on("update", this.update, this);
  }

  static create() {
    this.gameCreated = true;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
    this.app.resizeCanvas(this.width, this.height);
    SceneManager.init([
      new SelectScene(),
      new MapEditorScene(),
      new PlayScene(),
    ]);
    SceneManager.loadScene(SceneManager.getScene(GameConstant.SCENE_SELECT));
    this.selectCarScene = SceneManager.getScene(GameConstant.SCENE_SELECT);
    this.mapEditorScene = SceneManager.getScene(GameConstant.SCENE_MAP_EDITOR);
    this.selectCarScene.on(SelectCarScreenEvent.ButtonPlayClicked, () => { 
      SceneManager.loadScene(SceneManager.getScene(GameConstant.SCENE_MAP_EDITOR));
    });
    this.mapEditorScene.on(MapEditorScreenEvent.ButtonNextClicked, () => {
      SceneManager.loadScene(SceneManager.getScene(GameConstant.SCENE_PLAY));
    });
  
  }

  static update(dt) {
    SceneManager.update(Time.dt);
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

  static isPortrait() {
    return this.width < this.height;
  }

  static isLandscape() { 
    return this.width > this.height;
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

