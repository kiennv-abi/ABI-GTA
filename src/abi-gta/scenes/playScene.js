import { BLEND_NORMAL, Color, config, Entity, LIGHTTYPE_DIRECTIONAL, Vec3 } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { Map } from "../objects/map/map";
import { DataManager } from "../data/dataManager";
import { Car, CarType, WheelConfig } from "../objects/car/car";

export class PlayScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PLAY);
    this.carModel = "model_car_police";
    this.color = new Color(GameConstant.WHITE_COLOR); 
  }
  create() {
    super.create();
    this._initialize();
  }

  _initialize() {
    this._initCamera()
    this._initLight();
    this._initCar(this.carModel,this.color)
    this._initMap();
    // this._initCameraFollow();
  }

  update(dt) {
    super.update(dt);
  }

  _initMap() {
    DataManager.mapData = DataManager.map1;
    this.map = new Map();
    this.addChild(this.map);
    this._initGround();
  }

  _initCar(carModel, color) {
    this.blue = new Color(GameConstant.BLUE_COLOR);
    this.car = new Car(carModel, color);
    if (carModel === "model_car_muscle") {
      this.car.configWheel(WheelConfig.Muscle)
    } else {
      this.car.configWheel(WheelConfig.Police)
    }
    this.car.setLocalPosition(45, 5, 45);
    this.addChild(this.car);
  }

  _initCameraFollow(){
    this.mainCamera.addScript(Follow, {
      target: this.policeCar,
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
