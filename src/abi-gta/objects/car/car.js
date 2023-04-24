import { Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";

export const CarType = Object.freeze({
  PoliceCar: "police",
  MuscleCar: "muscle",
});

export class Car extends Entity{
  constructor(modelCar, modelWheel) {
    super();
    this.carModel = new Entity();
    this.carModel.addComponent("model", { asset: AssetLoader.getAssetByKey(modelCar) });
    this.addChild(this.carModel);

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
}