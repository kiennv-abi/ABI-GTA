import { Entity, Vec3 } from "playcanvas";
import { Car, CarType } from "./car";
import { Rotate } from "../../scripts/components/rotate";
import { AssetLoader } from "../../../assetLoader/assetLoader";

export class CarViewer extends Entity{
  constructor() {
    super("car_viewer");
    this._initCar();
  }

  _initCar() {
    this.modelCar = new Car("model_car_police", "model_car_wheel");
    this.addChild(this.modelCar);
    this.modelCar.configWheel(1.609, -1.262, 0.659, -0.659, 0.384);

    this.addScript(Rotate, {
      speed: new Vec3(0, 90, 0),
    });
    this.changeCar(CarType.MuscleCar);
  }
  

  changeCar(type) {
    if (type === CarType.PoliceCar) {
      this.modelCar.carModel.model.asset = AssetLoader.getAssetByKey("model_car_police");
      this.modelCar.configWheel(1.609, -1.262, 0.659, -0.659, 0.384);

    } else {
      this.modelCar.carModel.model.asset = AssetLoader.getAssetByKey("model_car_muscle");
      this.modelCar.configWheel(-1.906, 1.373, 0.8, -0.8, 0.384);
    }
  }
}