import tween from "@tweenjs/tween.js";
import { BLEND_NORMAL, Color, Entity, LIGHTTYPE_DIRECTIONAL, StandardMaterial, Vec3, Vec4 } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { Tween } from "../../template/systems/tween/tween";
import { Car, WheelConfig } from "../objects/car/car";
import { SelectCarScreen, SelectCarScreenEvent } from "../ui/screens/selectCarScreen";

export const SelectCarSceneEvent = Object.freeze({
  ChangeColor : "SelectCarScene:ChangeColor",
  ChangeCar : "SelectCarScene:ChangeCar"
})

export class SelectScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_SELECT);
    this.currTime = 0;
    this.whiteColor = new Color(GameConstant.WHITE_COLOR)
    this.blueColor = new Color(GameConstant.BLUE_COLOR);
    this.orangeColor = new Color(GameConstant.ORANGE_COLOR);
    this.redColor = new Color(GameConstant.RED_COLOR)
  }

  create() {
    super.create();
    this.ui.addScreens(
      new SelectCarScreen()
    );
    this.ui.setScreenActive(GameConstant.SCREEN_SELECT_CAR, true);
    this.selectCarScreen = this.ui.getScreen(GameConstant.SCREEN_SELECT_CAR);
    this.selectCarScreen.on(SelectCarScreenEvent.ButtonPlayClicked, () => {
      this.fire(SelectCarScreenEvent.ButtonPlayClicked);
    })
    this._init();
  }

  _init (){
    this._initLight();
    this._initCamera();
    this._initGround();
    this._initCar();
    this._changeColorCar();
    this._changeCar();
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

  _initCar() {
    this.policeCar = new Car("model_car_police",this.whiteColor);
    this.addChild(this.policeCar);
    this.policeCar.setLocalPosition(0, 2, 0);
    this.policeCar.configWheel(WheelConfig.Police);
    this.policeCar.enabled = false;

    this.muscleCar = new Car("model_car_muscle", this.whiteColor);
    this.addChild(this.muscleCar);
    this.muscleCar.setLocalPosition(0, 2, 0)
    this.muscleCar.configWheel(WheelConfig.Muscle);
    this.muscleCar.enabled = true;
  }

  _changeColorCar() {
    this.selectCarScreen.on(SelectCarScreenEvent.ButtonColorClicked, (type) => {
      if(type === "blue") {
        this.policeCar.materialCar.diffuse = this.blueColor;
        this.muscleCar.materialCar.diffuse = this.blueColor;
        this.policeCar.materialCar.update();
        this.muscleCar.materialCar.update();
        this.fire(SelectCarSceneEvent.ChangeColor, type);
      }
      else if(type === "red") {
        this.policeCar.materialCar.diffuse = this.redColor;
        this.muscleCar.materialCar.diffuse = this.redColor;
        this.policeCar.materialCar.update();
        this.muscleCar.materialCar.update();
        this.fire(SelectCarSceneEvent.ChangeColor, type);
      }
      else if(type === "orange") {
        this.policeCar.materialCar.diffuse = this.orangeColor;
        this.muscleCar.materialCar.diffuse = this.orangeColor;
        this.policeCar.materialCar.update();
        this.muscleCar.materialCar.update();
        this.fire(SelectCarSceneEvent.ChangeColor, type);
      }
      else if(type ==="white"){
        this.policeCar.materialCar.diffuse = this.whiteColor;
        this.muscleCar.materialCar.diffuse = this.whiteColor;
        this.policeCar.materialCar.update();
        this.muscleCar.materialCar.update();
        this.fire(SelectCarSceneEvent.ChangeColor, type);
      }
    })
  }

  _changeCar(){
    this.selectCarScreen.on(SelectCarScreenEvent.ButtonCarClicked, (type) => {
      if(type === "CarPolice") {
        this.policeCar.enabled = true;
        this.muscleCar.enabled = false;
        this.selectCarScreen.changeProgressBar(120, 80);  
        this.fire(SelectCarSceneEvent.ChangeCar, type)
      }
      else if(type === "CarMuscle") {
        this.policeCar.enabled = false;
        this.muscleCar.enabled = true;
        this.selectCarScreen.changeProgressBar(140, 100);
        this.fire(SelectCarSceneEvent.ChangeCar, type)
      }
    })
  }
  
  rotateCar(dt) {
    this.speedRotate += 0.3;
    this.policeCar.setEulerAngles(0, this.speedRotate, 0);
    this.muscleCar.setEulerAngles(0, this.speedRotate, 0);
  }
  
  update(dt) {
    super.update(dt);
    this.currTime += dt;
    this.mainCamera.setLocalPosition(
      10 * Math.sin(this.currTime * 0.1),
      3,
      10 * Math.cos(this.currTime * 0.1)
    );
    this.mainCamera.lookAt(this.getPosition());
  }
  _initialize() {
   
  }
}