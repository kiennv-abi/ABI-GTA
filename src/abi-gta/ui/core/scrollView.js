import {
  Color,
  ELEMENTTYPE_GROUP,
  ELEMENTTYPE_IMAGE, Entity,
  SCROLLBAR_VISIBILITY_SHOW_WHEN_REQUIRED,
  SCROLL_MODE_BOUNCE,
  Vec2,
  Vec4,
} from "playcanvas";
import { ScrollBar } from "./scrollBar";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { OnEnable } from "../../scripts/components/onEnable";

export class ScrollView extends Entity {
  constructor(content, data = {}) {
    super("scroll-view");
    data.type = ELEMENTTYPE_GROUP;
    data.anchor = data.anchor || new Vec4(0, 0, 1, 1);
    data.margin = data.margin || new Vec4();
    this.addComponent("element", data);

    this._initBackground();
    this._initScrollBar();
    this._initViewport();

    content.element.useInput = true;
    this.viewport.addChild(content);

    this.addComponent("scrollview", {
      scrollMode                  : SCROLL_MODE_BOUNCE,
      bounceAmount                : 0.1,
      friction                    : 0.05,
      useMouseWheel               : true,
      mouseWheelSensitivity       : new Vec2(1, 1),
      viewportEntity              : this.viewport,
      contentEntity               : content,
      horizontal                    : true,
      horizontalScrollbarEntity     : this.scrollBar,
      horizontalScrollbarVisibility : SCROLLBAR_VISIBILITY_SHOW_WHEN_REQUIRED,
    });

    this.addScript(OnEnable, {
      callback: () => this.scrollBar.scrollbar._updateHandlePositionAndSize(),
    });
  }

  _initBackground() {
    this.bg = ObjectFactory.createUIBackground();
    this.bg.element.opacity = 0.5;
    this.addChild(this.bg);
  }

  _initViewport() {
    this.viewport = new Entity("viewport");
    this.viewport.addComponent("element", {
      anchor  : new Vec4(0, 0, 1, 1),
      color   : new Color(0.2, 0.2, 0.2),
      margin  : new Vec4(),
      mask    : true,
      opacity : 1,
      pivot   : new Vec2(0, 1),
      rect    : new Vec4(0, 0, 1, 1),
      type    : ELEMENTTYPE_IMAGE,
    });

    this.addChild(this.viewport);
  }

  _initScrollBar() {
    this.scrollBar = new ScrollBar({
      anchor: new Vec4(0, 0, 1, 0),
    });
    this.addChild(this.scrollBar);
  }
}
