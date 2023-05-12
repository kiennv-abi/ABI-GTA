import { Entity, Vec3 } from "playcanvas";
import { Car, CarColorCode, CarType } from "./car";
import { AssetLoader } from "../../../assetLoader/assetLoader";

export class CarViewer extends Entity{
  constructor() {
    super("car_viewer");
    this._initCar();
  }

  _initCar() {
    this.policeCar = new Car("model_car_police");
    this.addChild(this.policeCar);
    this.policeCar.configWheel(-1.262, 1.609, 0.659, -0.659, 0.3);
    this.muscleCar = new Car("model_car_muscle");
    this.addChild(this.muscleCar);
    this.muscleCar.configWheel(-1.373, 1.906, 0.8, -0.8, 0.3);
  }

  changeColor(type, colorCode) {
    if (type === CarType.PoliceCar) {
      this.policeCar.changeSkin(colorCode);
    } else {
      this.muscleCar.changeSkin(colorCode);
     }
  }

  changeCar(type) {
    let colorCode = 1;
    if (type === CarType.PoliceCar) {
      this.policeCar.enabled = true;
      this.muscleCar.enabled = false;
      colorCode = this.policeCar.colorCode;
    } else {
      this.policeCar.enabled = false;
      this.muscleCar.enabled = true;
      colorCode = this.muscleCar.colorCode;
    }
    this.changeColor(type, colorCode);
    return colorCode;
  }
}