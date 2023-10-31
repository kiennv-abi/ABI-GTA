import { app, Color, Entity, StandardMaterial } from "playcanvas";

export class Car extends Entity{
  constructor(type, color) {
    super();
    this.color = color;
    this._init(type, color);
    
  }
  _init(type, color) {
    let assetCar = app.assets.find(type)
    this.car = new Entity("Car");
    this.car.addComponent("model", {
      type: "asset",
      asset : assetCar,
    });
    this.addChild(this.car);
    this.car.setLocalPosition(2.5, 0, 2.2);
    this.car.setEulerAngles(0.5, -50, 0)

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
}