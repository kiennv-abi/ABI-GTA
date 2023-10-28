import { app, Color, Entity, StandardMaterial } from "playcanvas";

export class Car extends Entity{
  constructor(type, color) {
    super();
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

    let tex_mat = app.assets.find("tex_car_police_01").resource;
    let materialCar = new StandardMaterial();
    materialCar.diffuseMap = tex_mat;
    materialCar.emissiveMap = tex_mat;
    materialCar.diffuseTint = true;
    materialCar.diffuse = color;
    materialCar.emissive = new Color(0, 0, 0);
    materialCar.emissiveIntensity = 0.1;

    this.car.model.meshInstances.forEach((mesh) => {
      mesh.material = materialCar;
    });
  }
}