import { Color, Entity } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { DataManager } from "../data/dataManager";
import { Map } from "../objects/map/map";



export class PlayScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PLAY);
  }
  create() {
    super.create();
    this._initialize();
  }
  _initialize() {
    this._initCamera()
    this._initLight();
    this._initMap();
  }
  update(dt) {
    super.update(dt);
  }

  _initMap() {
    DataManager.mapData = DataManager.map1
    this.map = new Map();
    this.addChild(this.map)
  }

  _initCar() {

  }
  

  _initCamera() {
    this.camera = new Entity();
    this.camera.addComponent("camera", {
      clearColor: new Color(0, 0, 0),
      farClip: 1000,
      fov: 45,
      nearClip: 0.1,
    })
    this.addChild(this.camera);
    this.camera.setLocalPosition(60, 90, 170);
    this.camera.setLocalEulerAngles(-40, 0, 0);
  }

  _initLight() {
    this.directionalLight = new Entity("light-directional");
    this.addChild(this.directionalLight);

    this.directionalLight.addComponent("light", {
      type: "directional",
      color: new Color(0, 0, 0),
      castShadows: false,
      shadowDistance: 1000,
      shadowResolution: 1024,
      shadowBias: 0.2,
      normalOffsetBias: 0.05,
      intensity: 0.85,
    });
    this.directionalLight.setLocalPosition(2, 30, -2);
    this.directionalLight.setLocalEulerAngles(45, 135, 0);
  }

}
