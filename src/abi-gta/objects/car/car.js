import { app, Color, ELEMENTTYPE_TEXT, Entity, StandardMaterial, Vec2, Vec4 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Wheel } from "./wheel";

export class Car extends Entity{
  constructor(type, color, speed, accenleration) {
    super();
    this.color = color;
    this._init(type, color);
    this._addWheeh(type);
    this.speed = speed;
    
  }
  _init(type, color) {
    let assetCar = app.assets.find(type);
    this.car = new Entity("Car");
    this.car.addComponent("model", {
      type: "asset",
      asset : assetCar,
    });
    this.addChild(this.car);
  

    let tex_mat = app.assets.find("tex_car_police_01").resource;
    this.materialCar = new StandardMaterial();
    this.materialCar.diffuseMap = tex_mat;
    this.materialCar.emissiveMap = tex_mat;
    this.materialCar.diffuseTint = true;
    this.materialCar.diffuse = color;
    this.materialCar.emissive = new Color(1, 1, 1);
    this.materialCar.emissiveIntensity = 0.1;

    this.car.model.meshInstances.forEach((mesh) => {
      mesh.material = this.materialCar;
    });
  }
  _addWheeh(type) {
    if(type === "model_car_police"){
      this.fontWheelr = new Wheel("model_wheelr");
      this.addChild(this.fontWheelr);
      this.fontWheelr.setLocalPosition(-0.627,0.39, 1.637);

      this.rearWheelr = new Wheel("model_wheelr");
      this.addChild(this.rearWheelr);
      this.rearWheelr.setLocalPosition(-0.636, 0.39, -1.264);

      this.fontWheell = new Wheel("model_wheell");
      this.addChild(this.fontWheell);
      this.fontWheell.setLocalPosition(0.634, 0.39, 1.634);

      this.rearWheell = new Wheel("model_wheell");
      this.addChild(this.rearWheell);
      this.rearWheell.setLocalPosition(0.634, 0.39, -1.264);  
    }
    else if (type === "model_car_muscle") {
      this.fontWheelr = new Wheel("model_wheelr");
      this.addChild(this.fontWheelr);
      this.fontWheelr.setLocalPosition(-0.83,0.35, 1.9);

      this.rearWheelr = new Wheel("model_wheelr");
      this.addChild(this.rearWheelr);
      this.rearWheelr.setLocalPosition(-0.83, 0.5, -1.3);

      this.fontWheell = new Wheel("model_wheell");
      this.addChild(this.fontWheell);
      this.fontWheell.setLocalPosition(0.83, 0.37, 1.9);

      this.rearWheell = new Wheel("model_wheell");
      this.addChild(this.rearWheell);
      this.rearWheell.setLocalPosition(0.83, 0.37, -1.3);  
    }
  }
}