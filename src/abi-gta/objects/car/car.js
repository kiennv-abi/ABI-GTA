import { Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Util } from "../../../helpers/util";

export const CarType = Object.freeze({
  PoliceCar: "Police",
  MuscleCar: "Muscle",
});

export const CarColorCode = Object.freeze({
  Color1: 1,
  Color2: 2,
  Color3: 3,
});

export const WheelConfig = Object.freeze({
  Police: {
    Front: -1.262,
    Back: 1.609,
    Left: 0.659,
    Right: -0.659,
    Y: 0.3,
  },
  Muscle: {
    Front: -1.373,
    Back: 1.906,
    Left: 0.8,
    Right: -0.8,
    Y: 0.3,
  }
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
  constructor(modelCar) {
    super();
    this.modelAsset = AssetLoader.getAssetByKey(modelCar);
    this.wheels = [];
    this.carModel = new Entity();
    this.carModel.addComponent("model", { asset: this.modelAsset });
    this.addChild(this.carModel);
    this.colorCode = 1;
  
    this.wfl = this.createWheel(true, 180);
    this.wfr = this.createWheel(true, 0);
    this.wbl =this.createWheel(false, 180);
    this.wbr= this.createWheel(false, 0);

    this.addComponent("rigidbody", {
      mass: 1000,
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

    this.script.create("vehicleControls");

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

  changeSkin(colorCode) {
    let mat = AssetLoader.getAssetByKey(`mat_car_${colorCode}`).resource;
    this.carModel.model.meshInstances[0].material = mat;
    this.carModel.model.meshInstances[2].material = mat;
    this.carModel.model.meshInstances[3].material = mat;
    this.colorCode = colorCode;
  }
}