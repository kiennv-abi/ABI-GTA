import tween from "@tweenjs/tween.js";
import { Color, Entity, Vec4 } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { Tween } from "../../template/systems/tween/tween";
import { Car } from "../objects/car/car";
import { Wheel } from "../objects/car/wheel";
import { SelectCarScreen, SelectCarScreenEvent } from "../ui/screens/selectCarScreen";

export class SelectScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_SELECT);
    this.speedRotate = 0;
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
    this._initCamera();
    this._initLight();
    this._initCapsule()
    this._initCar();
    this._changeColorCar();
    this._changeCar();
  }

  _initCamera() {
    this.camera = new Entity("Camera");
    this.camera.addComponent("camera", {
      nearClip: 0.1,
      farClip: 1000,
      fov: 80,

    })
    this.addChild(this.camera);
     this.camera.setLocalPosition(6, 3, 6);
    this.camera.setLocalEulerAngles(-17, 40, -0.9);
    // this.camera.addComponent("script");
    // this.camera.setLocalPosition(60, 170, 100);
    // this.camera.setLocalEulerAngles(-80, 0, 0);
    // this.camera.script.create("orbitCamera", {
    //   attributes: {
    //     inertiaFactor: 0.3
    //   }
    // });
    // this.camera.script.create("orbitCameraInputMouse");
    // this.camera.script.create("orbitCameraInputTouch");

  }

  _initLight() {
    this.light = new Entity("Light");
    this.light.addComponent("light", {
      type: "directional",
      color: new pc.Color(1, 1, 1),
      castShadows: true,
      shadowDistance: 300,
      shadowResolution: 2048,
      shadowBias: 1,
      normalOffsetBias: 1,
      intensity: 1,
    })
    this.light.setLocalPosition(0, 30, 0);
    this.light.setLocalEulerAngles(0, 0, 0);
    this.addChild(this.light);

  }

  _initCapsule() {
    this.capsule = new Entity("capsule");
    this.capsule.addComponent("model", {
      type: "capsule",
    })
    this.addChild(this.capsule);
    this.capsule.setLocalScale(7, 1, 7);
    this.capsule.setLocalPosition(-0.5, -0.82, -0.72)
    this.capsule.rotate(0, 30, 0)
  }

  _initCar() {
    this.whiteColor = new Color(1, 1, 1)
    this.redColor = new Color(GameConstant.RED_COLOR);
    this.blueColor = new Color(GameConstant.BLUE_COLOR);
    this.orangeColor = new Color(GameConstant.ORANGE_COLOR);
    this.policeCar = new Car("model_car_police",this.whiteColor, 50);
    this.addChild(this.policeCar);
    this.policeCar.enabled = true;
    this.policeCar.rotate(176, 45, 176);
    this.policeCar.setLocalPosition(1, 0, 0.7);

    this.muscleCar = new Car("model_car_muscle", this.whiteColor);
    this.addChild(this.muscleCar);
    this.muscleCar.enabled = false;
    this.muscleCar.rotate(176, 45, 176);
    this.muscleCar.setLocalPosition(1, 0, 0.7);
  }

  _changeColorCar() {
    this.selectCarScreen.on(SelectCarScreenEvent.ButtonColorClicked, (type) => {
      if(type === "blue") {
        this.policeCar.materialCar.diffuse = this.blueColor;
        this.muscleCar.materialCar.diffuse = this.blueColor
        this.policeCar.materialCar.update();
        this.muscleCar.materialCar.update();
      }
      else if(type === "red") {
        this.policeCar.materialCar.diffuse = this.redColor;
        this.muscleCar.materialCar.diffuse = this.redColor;
        this.policeCar.materialCar.update();
        this.muscleCar.materialCar.update();
      }
      else if(type === "orange") {
        this.policeCar.materialCar.diffuse = this.orangeColor;
        this.muscleCar.materialCar.diffuse = this.orangeColor;
        this.policeCar.materialCar.update();
        this.muscleCar.materialCar.update();
      }
      else if(type ==="white"){
        this.policeCar.materialCar.diffuse = this.whiteColor;
        this.muscleCar.materialCar.diffuse = this.whiteColor;
        this.policeCar.materialCar.update();
        this.muscleCar.materialCar.update();
      }
    })
  }

  _changeCar(){
    this.selectCarScreen.on(SelectCarScreenEvent.ButtonCarClicked, (type) => {
      if(type === "CarPolice") {
        this.policeCar.enabled = true;
        this.muscleCar.enabled = false;
        this.selectCarScreen.changeProgressBar(120, 80);  
      }
      else if(type === "CarMuscle") {
        this.policeCar.enabled = false;
        this.muscleCar.enabled = true;
        this.selectCarScreen.changeProgressBar(140, 100);
        
      }
    })
  }
  
  rotateCar(dt) {
    this.speedRotate += 0.4;
    this.policeCar.setEulerAngles(0, this.speedRotate, 0);
    this.muscleCar.setEulerAngles(0, this.speedRotate, 0);
  }
  
  update(dt) {
    super.update(dt);
    this.rotateCar(dt);
  }
  _initialize() {
   
  }
}