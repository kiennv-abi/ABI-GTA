import tween from "@tweenjs/tween.js";
import { Color, Entity, Vec4 } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { Tween } from "../../template/systems/tween/tween";
import { Car } from "../objects/car/car";
import { InforCar } from "../objects/car/inforCar";
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
    this._init();
  }

  _init (){
    this._initCamera();
    this._initLight();
    this._initPlane();
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
    this.camera.setLocalPosition(9, 5, 7);
    this.camera.setLocalEulerAngles(-20, 48, -0.9);
    
  }

  _initLight() {
    this.light = new Entity("Light");
    this.light.addComponent("light", {
      type: "directional"
    })
    this.addChild(this.light);

  }

  _initPlane() {
    this.plane = new Entity("Plane");
    this.plane.addComponent("model", {
      type: "plane",
    })
    this.addChild(this.plane);
    this.plane.setLocalScale(8, 7, 7);
    this.plane.rotate(0 , 46, 0);
  }

  _initCar() {
    this.whiteColor = new Color(1, 1, 1)
    this.redColor = new Color(GameConstant.RED_COLOR);
    this.blueColor = new Color(GameConstant.BLUE_COLOR);
    this.yellowColor = new Color(GameConstant.YELLOW_COLOR);
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
      else if(type === "yellow") {
        this.policeCar.materialCar.diffuse = this.yellowColor;
        this.muscleCar.materialCar.diffuse = this.yellowColor;
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
        this.selectCarScreen.changeInfor(50, 10)
        
      }
      else if(type === "CarMuscle") {
        this.policeCar.enabled = false;
        this.muscleCar.enabled = true;
        this.selectCarScreen.changeInfor(30, 20)
        
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