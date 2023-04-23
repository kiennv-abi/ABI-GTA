import { Game } from "../../game";
import { ADDRESS_REPEAT, CULLFACE_NONE, Entity, StandardMaterial, Vec3 } from "playcanvas";

export class ScrollingBackground extends Entity {
  constructor(texture) {
    super(texture);
    this.texture = texture;
    texture.addressU = ADDRESS_REPEAT;
    texture.addressV = ADDRESS_REPEAT;

    this.pixelsPerUnit = 100;

    this.material = new StandardMaterial();
    this.material.diffuseMap = texture;
    this.material.cull = CULLFACE_NONE;
    this.material.useLighting = false;
    this.material.useFog = false;

    this.initPlanes();

    this.velocity = new Vec3(-0.1, 0, 0);
    this._tmpVelocity = new Vec3();
    this._tmpPos = new Vec3();

    Game.app.on("update", this.update, this);
    Game.app.on("resize", this.resize, this);
    this.resize();
  }

  initPlanes() {
    let numPlanes = 3;
    this.planes = [];
    this.planeGroup = new Entity();
    this.addChild(this.planeGroup);

    this.planeWidth = 1;
    this.left = -(numPlanes - 1) * this.planeWidth / 2;
    let x = this.left;
    for (var i = 0; i < numPlanes; i++) {
      var plane = this.createPlane();
      plane.setLocalPosition(x, 0, 0);
      x += this.planeWidth;
      this.planeGroup.addChild(plane);
      this.planes.push(plane);
    }
  }

  createPlane() {
    let plane = new Entity();
    plane.addComponent("model", { type: "box" });
    plane.model.meshInstances[0].material = this.material;
    plane.setLocalEulerAngles(90, 0, 0);
    return plane;
  }

  update(dt) {
    this._tmpVelocity.copy(this.velocity).scale(dt);
    this.planes.forEach((plane) => {
      this._tmpPos.copy(plane.getLocalPosition());
      this._tmpPos.add(this._tmpVelocity);
      plane.setLocalPosition(this._tmpPos);
    });
    this._checkPositions();
  }

  _checkPositions() {
    let first = this.planes[0];
    let last = this.planes[this.planes.length - 1];
    this._tmpPos.copy(first.getLocalPosition());
    if (this._tmpPos.x < this.left) {
      this._tmpPos.copy(last.getLocalPosition());
      this._tmpPos.x += this.planeWidth;
      first.setLocalPosition(this._tmpPos);
      this.planes.shift();
      this.planes.push(first);
    }
  }

  destroy() {
    super.destroy();
    Game.app.off("update", this.update, this);
    Game.app.off("resize", this.resize, this);
  }

  resize() {
    let scale = 1;
    let pos = new Vec3();

    if (Game.isPortrait) {
      scale = 12;
      pos.set(0, 0, -100);
    }
    else {
      scale = 38;
      pos.set(0, 0, -100);
    }
    scale /= this.pixelsPerUnit;

    this.setLocalScale(scale * this.texture.width, scale * this.texture.height, 1);
    this.setLocalPosition(pos);
  }
}
