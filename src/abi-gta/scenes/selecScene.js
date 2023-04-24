import { Color, Entity, LIGHTTYPE_DIRECTIONAL } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { CarViewer } from "../objects/car/carViewer";
import { SelectCarScreen, SelectCarScreenEvent } from "../ui/screens/selectCarScreen";

export class SelectScene extends Scene{
  constructor() {
    super(GameConstant.SCENE_SELECT);
  }

  create() { 
    super.create();
    this._initialize();
    this.ui.addScreens(
      new SelectCarScreen()
    );
    this.ui.setScreenActive(GameConstant.SCREEN_SELECT_CAR);
    this.selectCarScreen = this.ui.getScreen(GameConstant.SCREEN_SELECT_CAR);
    this.selectCarScreen.on(SelectCarScreenEvent.ButtonClicked, (type) => {
      this.carViewer.changeCar(type);
    });
  }

  _initialize() {
    this._initLight();
    this._initCamera();
    this._initCarViewer();
  }

  _initCarViewer() {
    this.carViewer = new CarViewer();
    this.addChild(this.carViewer);
  }

  _initLight() {
    this.directionalLight = new Entity("light-directional");
    this.addChild(this.directionalLight);

    this.directionalLight.addComponent("light", {
      type: LIGHTTYPE_DIRECTIONAL,
      color: new Color(1, 1, 1),
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

  _initCamera() {
    this.mainCamera = new Entity();
    this.addChild(this.mainCamera);
    this.mainCamera.addComponent("camera", {
      clearColor: new pc.Color(0, 0, 0),
      farClip: 1000,
      fov: 45,
      nearClip: 0.1,
    });
    this.mainCamera.setLocalPosition(11.56, 10, 0);
    this.mainCamera.setLocalEulerAngles(-44.2, 90, 0);
  }
}