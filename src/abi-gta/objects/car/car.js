import { app, Color, ELEMENTTYPE_TEXT, Entity, StandardMaterial, Vec2, Vec4 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";

export const WheelConfig = Object.freeze({
  Police: {
    Front: -1.262,
    Back: 1.609,
    Left: 0.659,
    Right: -0.659,
    Y: 0.35,
  },
  Muscle: {
    Front: -1.373,
    Back: 1.906,
    Left: 0.8,
    Right: -0.8,
    Y: 0.35,
  }
});


export class Car extends Entity{
  constructor(type, color ) {
    super();
    this.color = color;
    this.wheels = [];
    let assetCar = app.assets.find(type);
    this.carModel = new Entity("Car");
    this.carModel.addComponent("model", {
      type: "asset",
      asset : assetCar,
    });
    this.addChild(this.carModel);
  

    let tex_mat = app.assets.find("tex_car_police_01").resource;
    let tex_mat2 = app.assets.find("tex_emissive_01").resource;
    this.materialCar = new StandardMaterial();
    this.materialCar.diffuseMap = tex_mat;
    this.materialCar.emissiveMap = tex_mat2;
    this.materialCar.diffuseTint = true;
    this.materialCar.diffuse = color;
    this.materialCar.emissive = new Color(1, 1, 1);
    this.materialCar.emissiveIntensity = 0.1;

    this.carModel.model.meshInstances.forEach((mesh) => {
      mesh.material = this.materialCar;
    });

    this.wfl = this.createWheel(true, 180);
    this.wfr = this.createWheel(true, 0);
    this.wbl =this.createWheel(false, 180);
    this.wbr= this.createWheel(false, 0);

    this.addComponent("rigidbody", {
      mass: 3000,
      type: "dynamic",
    });

    this.addComponent("collision", {
      type: "compound",
    });

    this.addComponent("script");
    this.script.create("vehicle", {
      attributes: {
        wheels: this.wheels,
      },
    });

    this.vehicleControl = this.script.create("vehicleControls");

    // Create the car chassis, offset upwards in Y from the compound body
    this.carModel.addComponent("collision", {
      type: "box",
      halfExtents: [1, 0.3, 3],
    });

    // Create the car chassis, offset upwards in Y from the compound body
    const cab = new pc.Entity("Cab");
    cab.addComponent("collision", {
      type: "box",
      halfExtents: [0.5, 0.1, 1],
    });

    cab.setLocalPosition(0, 0.1, -0.25);
    this.carModel.addChild(cab);

    this.script.create("actionPhysicsReset", {
      attributes: {
        event: "reset",
      },
    });
  }


  createWheel(isFront, angle) { 
    let asset;
    if (angle > 0) {
      asset = AssetLoader.getAssetByKey("model_wheelr");
    } else {
      asset = AssetLoader.getAssetByKey("model_wheell");
    }
    let wheel = new Entity();
    wheel.addComponent("model", { asset: asset });
    wheel.addComponent("script");
    wheel.script.create("vehicleWheel", {
      attributes: {
        debugRender: false,
        isFront: isFront,
      },
    });
    this.wheels.push(wheel);
    this.carModel.addChild(wheel);
    return wheel;
  }

  configWheel(config) {
    this.wbl.setLocalPosition(config.Left, config.Y, config.Front);
    this.wbr.setLocalPosition(config.Right, config.Y, config.Front);
    this.wfl.setLocalPosition(config.Left, config.Y, config.Back);
    this.wfr.setLocalPosition(config.Right, config.Y, config.Back);
  } 
}