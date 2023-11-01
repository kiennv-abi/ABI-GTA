import { Color, Entity, Vec4 } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { Car } from "../objects/car/car";
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

    this._init();
  }

  _init (){
    this._initCamera();
    this._initLight();
    this._initPlane();
    this._initCar();
    this.changeColorCar();
    this.changeCar();
  }

  _initCamera() {
    this.camera = new Entity("Camera");
    this.camera.addComponent("camera", {
      nearClip: 0.1,
      farClip: 1000,

    })
    this.addChild(this.camera);
    this.camera.setLocalPosition(12, 7, 11);
    this.camera.setLocalEulerAngles(-33, 45, -4);
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
    this.plane.setLocalScale(7, 1, 7);
  }

  _initCar() {
    this.whiteColor = new Color(1, 1, 1)
    this.redColor = new Color(GameConstant.RED_COLOR);
    this.blueColor = new Color(GameConstant.BLUE_COLOR);
    this.yellowColor = new Color(GameConstant.YELLOW_COLOR);
    this.policeCar = new Car("model_car_police",this.whiteColor);
    this.addChild(this.policeCar);
    this.policeCar.enabled = false;

    this.muscleCar = new Car("model_car_muscle", this.whiteColor);
    this.addChild(this.muscleCar);
    this.muscleCar.enabled = true;
  }

  changeColorCar() {
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
      else if(type === "yellow") {
        this.policeCar.materialCar.diffuse = this.yellowColor;
        this.muscleCar.materialCar.diffuse = this.yellowColor;
        this.policeCar.materialCar.update();
        this.muscleCar.materialCar.update();
      }
    })
  }

  changeCar(){
    this.selectCarScreen.on(SelectCarScreenEvent.ButtonCarClicked, (type) => {
      if(type === "CarPolice") {
        this.policeCar.enabled = true;
        this.muscleCar.enabled = false;
      }
      if(type === "CarMuscle") {
        this.policeCar.enabled = false;
        this.muscleCar.enabled = true;
      }
    })
  }

  rotateCar(dt) {
    // this.speedRotate += 0.5;
    this.muscleCar.rotateLocal(0, 10 * dt, 0)
    // this.policeCar.setEulerAngles(this.policeCar.getLocalEulerAngles().x, this.speedRotate, this.policeCar.getEulerAngles().z)
  }
  

  update(dt) {
    super.update(dt);
    this.rotateCar(dt);
  }
  _initialize() {
   
  }
}