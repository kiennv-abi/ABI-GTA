import { BUTTON_TRANSITION_MODE_TINT, Color, ELEMENTTYPE_GROUP, ELEMENTTYPE_IMAGE, Entity, ORIENTATION_HORIZONTAL, ORIENTATION_VERTICAL, Vec2, Vec4 } from "playcanvas";

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
      orientation  : ORIENTATION_HORIZONTAL,
      value        : 0,
      handleSize   : 0.5,
      handleEntity : this.handle,
    });
  }

  _initBg() {
    this.bg = new Entity("bg");
    this.bg.addComponent("element", {
      type        : ELEMENTTYPE_IMAGE,
      anchor      : new Vec4(0, 0.5, 1, 0.5),
      pivot       : new Vec2(0.5, 0.5),
      margin      : new Vec4(8, 0, 8, 0),
      color       : new Color(),
      opacity: 1,
      height: 10,
    });
    this.addChild(this.bg);
  }

  _initHandle() {
    this.handle = new Entity("handler");

    this.handle.addComponent("element", {
      type        : ELEMENTTYPE_IMAGE,
      anchor      : new Vec4(0, 0.5, 0, 0.5),
      pivot       : new Vec2(0, 0.5),
      margin      : new Vec4(8, 0, 8, 0),
      width       : 10,
      height      : 8,
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
