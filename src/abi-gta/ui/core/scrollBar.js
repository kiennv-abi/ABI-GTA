import { BUTTON_TRANSITION_MODE_TINT, Color, ELEMENTTYPE_GROUP, ELEMENTTYPE_IMAGE, Entity, ORIENTATION_VERTICAL, Vec2, Vec4 } from "playcanvas";
import { AssetManager } from "../../../../template/assetManager";

export class ScrollBar extends Entity {
  constructor(data = {}) {
    super("scroll-bar");

    data.type = ELEMENTTYPE_GROUP;
    data.anchor = data.anchor || new Vec4(0, 0, 1, 1);
    data.margin = data.margin || new Vec4();
    this.addComponent("element", data);

    this._initBg();
    this._initHandle();

    this.addComponent("scrollbar", {
      orientation  : ORIENTATION_VERTICAL,
      value        : 0,
      handleSize   : 0.5,
      handleEntity : this.handle,
    });
  }

  _initBg() {
    let spriteAsset = AssetManager.find("spr_scrollbar_bg");
    this.bg = new Entity("bg");
    this.bg.addComponent("element", {
      type        : ELEMENTTYPE_IMAGE,
      spriteAsset : spriteAsset,
      anchor      : new Vec4(0.5, 0, 0.5, 1),
      pivot       : new Vec2(0.5, 0.5),
      margin      : new Vec4(0, 8, 0, 8),
      color       : new Color(),
      opacity     : 0.5,
      width       : 4,
    });
    this.addChild(this.bg);
  }

  _initHandle() {
    let spriteAsset = AssetManager.find("spr_scrollbar_handle");
    this.handle = new Entity("handler");

    this.handle.addComponent("element", {
      type        : ELEMENTTYPE_IMAGE,
      spriteAsset : spriteAsset,
      anchor      : new Vec4(0.5, 1, 0.5, 1),
      pivot       : new Vec2(0.5, 1),
      margin      : new Vec4(0, 8, 0, 8),
      width       : 8,
      height      : 300,
      useInput    : true,
    });
    this.addChild(this.handle);

    this.handle.addComponent("button", {
      active         : true,
      imageEntity    : this.handle,
      hitPadding     : new Vec4(0, 0, 0, 0),
      transitionMode : BUTTON_TRANSITION_MODE_TINT,
      hoverTint      : new Color(1, 1, 1),
      pressedTint    : new Color(1, 1, 1),
      inactiveTint   : new Color(1, 1, 1),
      fadeDuration   : 0,
    });
  }
}
