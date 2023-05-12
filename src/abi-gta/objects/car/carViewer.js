import { Entity, Vec3 } from "playcanvas";
import { Car, CarColorCode, CarType, WheelConfig } from "./car";
import { AssetLoader } from "../../../assetLoader/assetLoader";

export class CarViewer extends Entity{
  constructor() {
    super("car_viewer");
    this._initCar();
  }

  _initCar() {
    this.policeCar = new Car("model_car_police");
    this.addChild(this.policeCar);
    this.policeCar.setLocalPosition(0, 2, 0);
    this.policeCar.configWheel(WheelConfig.Police);
    this.muscleCar = new Car("model_car_muscle");
    this.addChild(this.muscleCar);
    this.muscleCar.setLocalPosition(0, 2, 0);
    this.muscleCar.configWheel(WheelConfig.Muscle);
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