import { GameConstant } from "../../gameConstant";
import { Game } from "../../game";
import { Entity, SCALEMODE_BLEND, Vec2, Vec3 } from "playcanvas";
export class UIScreen extends Entity {
  /**
   * @class UIScreen
   * @param {string} key
   */
  constructor(key) {
    super();
    this.key = key;
    this.addComponent("screen", {
      screenSpace         : true,
      scaleMode           : SCALEMODE_BLEND,
      resolution          : new Vec2(GameConstant.GAME_WIDTH, GameConstant.GAME_HEIGHT),
      referenceResolution : new Vec2(GameConstant.GAME_WIDTH, GameConstant.GAME_HEIGHT),
    });
    this.enabled = false;
  }

  create() {
    this.created = true;
  }

  pause() {
  }

  resume() {
  }

  destroyChildren() {
    while (this.children.length > 0) {
      this.children[0].destroy();
    }
  }

  update() {
  }

  resize() {
  }

  getScreenSpacePosition(deviceScreenPos, dst = new Vec3()) {
    dst.x = deviceScreenPos.x * Game.app.graphicsDevice.maxPixelRatio;
    dst.y = Game.app.graphicsDevice.height - deviceScreenPos.y * Game.app.graphicsDevice.maxPixelRatio;
    dst.z = 0;
    dst.scale(1 / this.screen.scale);
    return dst;
  }
}
