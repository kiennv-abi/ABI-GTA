import { Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Util } from "../../../helpers/util";

export const CarType = Object.freeze({
  PoliceCar: "Police",
  MuscleCar: "Muscle",
});

export const CarColorCode = Object.freeze({
  Red: 1,
  Green: 2,
  Blue: 3,
});

export const CarSpecifics = Object.freeze({
  Muscle: {
    Name: "Muscle Car",
    Colors: {
      Color1: Util.createColor(94, 56, 33),
      Color2: Util.createColor(15, 88, 216),
      Color3: Util.createColor(110, 16, 98),
    },
    Acceleration: {
      maxValue: 230,
      currentValue: 190,
      value: "2.86 s"
    },
    TopSpeed: {
      maxValue: 200,
      currentValue: 180,
      value: "245 km/h"
    },
    Handling: {
      maxValue: 220,
      currentValue: 170,
      value: "2.500 Gs"
    },
    Nitro: {
      maxValue: 250,
      currentValue: 200,
      value: "55 km/h"
    }
  },
  Police: {
    Name: "Police Car",
    Colors: {
      Color1: Util.createColor(80, 95, 120),
      Color2: Util.createColor(87, 36, 118),
      Color3: Util.createColor(100, 174, 80),
    },
    Acceleration: {
      maxValue: 220,
      currentValue: 200,
      value: "5.10 s"
    },
    TopSpeed: {
      maxValue: 250,
      currentValue: 240,
      value: "344 km/h"
    },
    Handling: {
      maxValue: 210,
      currentValue: 190,
      value: "3.2405 Gs"
    },
    Nitro: {
      maxValue: 230,
      currentValue: 230,
      value: "70 km/h"
    }
  }
 
});

export class Car extends Entity{
  constructor(modelCar, modelWheel) {
    super();
    this.carModel = new Entity();
    this.carModel.addComponent("model", { asset: AssetLoader.getAssetByKey(modelCar) });
    this.addChild(this.carModel);
    this.colorCodeSelected = 1;
    this.wheelFl = new Entity();
    this.wheelFl.addComponent("model", { asset: AssetLoader.getAssetByKey(modelWheel) });
    this.addChild(this.wheelFl);
    this.wheelFr = this.wheelFl.clone();
    this.addChild(this.wheelFr);
    this.wheelBl = this.wheelFl.clone();
    this.addChild(this.wheelBl);
    this.wheelBr = this.wheelFl.clone();
    this.addChild(this.wheelBr);

    this.wheelFl.setLocalEulerAngles(0, 180, 0);
    this.wheelBl.setLocalEulerAngles(0, 180, 0);
  }

  configWheel(posFront, posBack, posLeft, posRight, posY) {
    this.wheelFl.setLocalPosition(posLeft, posY, posFront);
    this.wheelFr.setLocalPosition(posRight, posY, posFront);
    this.wheelBl.setLocalPosition(posLeft, posY, posBack);
    this.wheelBr.setLocalPosition(posRight, posY, posBack);
  }

  changeSkin(colorCode) {
    let mat = AssetLoader.getAssetByKey(`mat_car_${colorCode}`).resource;
    this.carModel.model.meshInstances[0].material = mat;
    this.carModel.model.meshInstances[2].material = mat;
    this.carModel.model.meshInstances[3].material = mat;
    this.colorCodeSelected = colorCode;
  }
}