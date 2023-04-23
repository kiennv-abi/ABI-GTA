import { GameConstant } from "../../gameConstant";
import { Game } from "../../game";
import { AssetManager } from "../assetManager";
import { Util } from "../../helpers/util";
import { ELEMENTTYPE_IMAGE, Entity, SCALEMODE_BLEND, Vec2, Vec3, Vec4 } from "playcanvas";
import { ButtonSound } from "./buttonSound";

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

  initButtonSound() {
    // eslint-disable-next-line no-undef
    if (GameConstant.SHOW_BUTTON_SOUND || SHOW_BUTTON_SOUND) {
      this.btnSound = new ButtonSound({
        anchor: new Vec4(0, 1, 0, 1),
      });
      this.btnSound.setLocalPosition(50, -70, 0);
      this.addChild(this.btnSound);
    }
  }

  initGameTag() {
    if (!GameConstant.SHOW_GAME_TAG) {
      return;
    }

    let asset = AssetManager.find("spr_game_tag");
    let frame = Util.getSpriteFrame(asset.resource);
    this.imgGameTag = new Entity("img_gametag");
    this.imgGameTag.addComponent("element", {
      type        : ELEMENTTYPE_IMAGE,
      spriteAsset : asset,
      anchor      : new Vec4(0, 1, 0, 1),
      pivot       : new Vec2(0, 1),
      width       : frame.width,
      height      : frame.height,
    });
    this.imgGameTag.setLocalPosition(10, -10, 0);
    this.addChild(this.imgGameTag);
  }

  getScreenSpacePosition(deviceScreenPos, dst = new Vec3()) {
    dst.x = deviceScreenPos.x * Game.app.graphicsDevice.maxPixelRatio;
    dst.y = Game.app.graphicsDevice.height - deviceScreenPos.y * Game.app.graphicsDevice.maxPixelRatio;
    dst.z = 0;
    dst.scale(1 / this.screen.scale);
    return dst;
  }
}
