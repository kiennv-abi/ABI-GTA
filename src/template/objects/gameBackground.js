import { Entity, SPRITETYPE_SIMPLE, Vec3 } from "playcanvas";
import { Game } from "../../game";
export class GameBackground extends Entity {
  constructor(asset) {
    super("background");
    asset.resource.pixelsPerUnit = 100;
    this.addComponent("sprite", {
      spriteAsset : asset,
      type        : SPRITETYPE_SIMPLE,
    });
    Game.app.on("resize", this.resize, this);
    this.resize();
  }

  destroy() {
    super.destroy();
    Game.app.off("resize", this.resize, this);
  }

  resize() {
    let scale = 1;
    let pos = new Vec3();

    if (Game.isPortrait) {
      scale = 8.7;
      pos.set(0, -14, -100);
    }
    else {
      scale = 27;
      pos.set(0, -130, -100);
    }
    this.setLocalScale(scale, scale, scale);
    this.setLocalPosition(pos);
  }
}
