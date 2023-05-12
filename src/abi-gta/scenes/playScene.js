import { BLEND_NORMAL, Color, Entity, LIGHTTYPE_DIRECTIONAL, Vec3 } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { Map } from "../objects/map/map";
import { DataManager } from "../data/dataManager";
import { Car, CarType, WheelConfig } from "../objects/car/car";
import { Follow } from "../scripts/components/follow";

export class PlayScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PLAY);
  }

  create() {
    super.create();
    this._initialize();
  }

  update(dt) {
    super.update(dt);
  }

  _initialize() {
    this._initCamera();
    this._initLight();
    this._initMap();
    this._initCameraFollow();
  }

  _initMap() {
    DataManager.mapData = DataManager.map1;
    this.map = new Map();
    this.addChild(this.map);
    this._initCar();
    this._initGround();
  }

  _initCar() {
    let carType = DataManager.carSelected;
    let modelAsset = null;
    let config = null;
    if (carType === CarType.MuscleCar) {
      modelAsset = "model_car_muscle";
      config = WheelConfig.Muscle;
    } else {
      modelAsset = "model_car_police";
      config = WheelConfig.Police;
    }
    this.car = new Car(modelAsset);
    this.car.configWheel(config);
    this.car.changeSkin(DataManager.carColor);
    this.car.setLocalPosition(50, 5, 50);
    this.addChild(this.car);
  }

  _initCameraFollow(){
    this.mainCamera.addScript(Follow, {
      target: this.car,
      speed: 3,
      defaultY: 10,
      offset: new Vec3(0, 0, -10)
    });
  }

  _initGround() {
    this.ground = new Entity();
    this.addChild(this.ground);
    this.ground.addComponent("model", {
      type: "box"
    });
    this.ground.addComponent("rigidbody", {
      type: "static",
    });
    let sizeCol = (this.map.col + 1) * this.map.gridUnit;
    let sizeRow = (this.map.row + 1) * this.map.gridUnit;
    this.ground.setLocalScale(sizeRow, 1, sizeCol);
    this.ground.setLocalPosition(this.map.row * this.map.gridUnit / 2, 0, this.map.col * this.map.gridUnit / 2);
    this.ground.addComponent("collision", {
      type: "box",
      halfExtents: new Vec3(sizeRow / 2, 0.1, sizeCol / 2),
    });
    let mat = this.ground.model.meshInstances[0].material.clone();
    mat.blendType = BLEND_NORMAL;
    mat.opacity = 0;
    this.ground.model.meshInstances[0].material = mat;
  }

  _initCamera() {
    this.mainCamera = new Entity();
    this.addChild(this.mainCamera);
    this.mainCamera.addComponent("camera", {
      clearColor: new Color(0, 0, 0),
      farClip: 1000,
      fov: 45,
      nearClip: 0.1,
    });
    this.mainCamera.setLocalPosition(0, 10, 10);
    this.mainCamera.setLocalEulerAngles(-40, 0, 0);
  }

  _initLight() {
    this.directionalLight = new Entity("light-directional");
    this.addChild(this.directionalLight);

    this.directionalLight.addComponent("light", {
      type: LIGHTTYPE_DIRECTIONAL,
      color: new Color(0, 0, 0),
      castShadows: false,
      shadowDistance: 30,
      shadowResolution: 1024,
      shadowBias: 0.2,
      normalOffsetBias: 0.05,
      intensity: 0.85,
    });
    this.directionalLight.setLocalPosition(2, 30, -2);
    this.directionalLight.setLocalEulerAngles(45, 135, 0);
  }
}