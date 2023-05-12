import { BLEND_NORMAL, Color, Entity, LIGHTTYPE_DIRECTIONAL, StandardMaterial, Vec3 } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { CarViewer } from "../objects/car/carViewer";
import { SelectCarScreen, SelectCarScreenEvent } from "../ui/screens/selectCarScreen";
import { CarSpecifics, CarType } from "../objects/car/car";
import { DataManager } from "../data/dataManager";

export class SelectScene extends Scene{
  constructor() {
    super(GameConstant.SCENE_SELECT);
    this.currTime = 0;
  }

  create() { 
    super.create();
    this._initialize();
    this.ui.addScreens(
      new SelectCarScreen()
    );
    this.ui.setScreenActive(GameConstant.SCREEN_SELECT_CAR);
    this.selectCarScreen = this.ui.getScreen(GameConstant.SCREEN_SELECT_CAR);
    this.selectCarScreen.on(SelectCarScreenEvent.ButtonCarClicked, (type) => {
      let colorCode = this.carViewer.changeCar(type);
      this.selectCarScreen.updateSpecifics(CarSpecifics[type], colorCode);
    });
    this.selectCarScreen.on(SelectCarScreenEvent.ButtonColorClicked, (carType, colorCode) => {
      this.carViewer.changeColor(carType, colorCode);
    });
    this.selectCarScreen.on(SelectCarScreenEvent.ButtonPlayClicked, (car, color) => {
      DataManager.carSelected = car;
      DataManager.carColor = color;
      this.fire(SelectCarScreenEvent.ButtonPlayClicked);
    });
    this.selectCarScreen.fire(SelectCarScreenEvent.ButtonCarClicked, CarType.MuscleCar);
  }

  _initialize() {
    this._initLight();
    this._initCamera();
    this._initGround();
    this._initCarViewer();
  }

  _initCarViewer() {
    this.carViewer = new CarViewer();
    this.addChild(this.carViewer);
  }

  _initGround() {
    this.ground = new Entity();
    this.addChild(this.ground);
    this.ground.addComponent("model", { type: "plane" });
    this.ground.setLocalScale(8, 1, 8);
    // this.ground.setLocalPosition(0, 0, 0);
    let mat = new StandardMaterial();
    mat.blendType = BLEND_NORMAL;
    mat.diffuse = new Color(0.5, 0.5, 0.5);
    mat.opacity = 1;
    this.ground.model.meshInstances[0].material = mat;
    this.ground.addComponent("rigidbody", {
      type: "static",
    });
    this.ground.addComponent("collision", {
      type: "box",
      halfExtents: new Vec3(10, 0.1, 10),
    });
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

  update(dt) {
    super.update(dt);
    this.currTime += dt;
    this.mainCamera.setLocalPosition(
      10 * Math.sin(this.currTime * 0.1),
      3,
      10 * Math.cos(this.currTime * 0.1)
    );
    this.mainCamera.lookAt(this.carViewer.getPosition());
  }

  _initCamera() {
    this.mainCamera = new Entity();
    this.addChild(this.mainCamera);
    this.mainCamera.addComponent("camera", {
      clearColor: new pc.Color(0, 0, 0),
      farClip: 1000,
      fov: 45,
      nearClip: 0.1,
    });
    this.mainCamera.addComponent("script");
    this.mainCamera.script.create("orbitCamera", {
      attributes: {
        inertiaFactor: 0.3, // Override default of 0 (no inertia)
      },
    });
    
    this.mainCamera.script.create("orbitCameraInputMouse");
    this.mainCamera.script.create("orbitCameraInputTouch");
    this.mainCamera.setLocalPosition(11.56, 15, 0);
    this.mainCamera.setLocalEulerAngles(-44.2, 90, 0);
  }
}