import { Color, Entity } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { Car } from "../objects/car/car";

export class SelectScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_SELECT);
  }

  create() {
    super.create();
    this._init();
  }

  _init (){
    this._initCamera();
    this._initLight();
    this._initPlane();
    this._initCar();
    this.changeCar();
  }

  _initCamera() {
    this.camera = new Entity("Camera");
    this.camera.addComponent("camera", {
      nearClip: 0.1,
      farClip: 1000,

    })
    this.addChild(this.camera);
    this.camera.setLocalPosition(8, 8, 7);
    this.camera.setLocalEulerAngles(-30, 45, 0);
  }

  _initLight() {
    this.light = new Entity("Light");
    this.light.addComponent("light", {
      type: "directional",

    })
    this.addChild(this.light);
  }

  _initPlane() {
    this.plane = new Entity("Plane");
    this.plane.addComponent("model", {
      type: "plane",
    })
    this.addChild(this.plane);
    this.plane.setLocalScale(10, 1, 10);
  }

  _initCar() {
    let whiteColor = new Color(GameConstant.WHITE_COLOR);
    let blueColor = new Color(GameConstant.BLUE_COLOR);
    let orangeColor = new Color(GameConstant.ORANGE_COLOR);
    this.policeCar = new Car("model_car_police", blueColor);
    this.addChild(this.policeCar);
    this.policeCar.enabled = true;

    this.muscleCar = new Car("model_car_muscle", blueColor);
    this.addChild(this.muscleCar);
    this.muscleCar.enabled = false;
  }

  changeCar() {
    document.addEventListener("keydown", (e) => {
      if(e.key === "1") {
        this.policeCar.enabled = true;
        this.muscleCar.enabled = false;
      }
      else if(e.key === "2") {
        this.policeCar.enabled = false;
        this.muscleCar.enabled = true;
      }
    })
  }

  update(dt) {
    super.update(dt);
  }

  _initialize() {
   
  }
}