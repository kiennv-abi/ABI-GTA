
import { Entity, Vec3 } from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { ObjectFactory } from "../../../template/objects/objectFactory";

export const CastBoxEvent = Object.freeze({
  Casted: "castbox:casted",
});

export const CastBox = Script.createScript({
  name: "castbox",

  attributes: {
    scale  : { default: new Vec3(1, 1, 1) },
    render : { default: false },
  },

  initialize() {
    this.box = ObjectFactory.createBox();
    let boxContainer = new Entity();
    this.entity.addChild(boxContainer);

    this.box = ObjectFactory.createBox();
    boxContainer.addChild(this.box);

    this.box.setLocalPosition(0, 0.5, 0);
    if (!this.render) {
      this.box.enabled = false;
    }

    boxContainer.setLocalScale(this.scale);
  },

  checkIntersects(ray) {
    let intersected = this.enabled && this.getBouding().intersectsRay(ray);
    if (intersected) {
      this.fire(CastBoxEvent.Casted);
    }

    return intersected;
  },

  getBouding() {
    return this.box.model.meshInstances[0].aabb;
  },
});
