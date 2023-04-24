import { Color, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Vec2, Vec4, log } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Util } from "../../../helpers/util";

export class Button extends Entity {
  constructor(data = {}) {
    super("button");

    data.type = ELEMENTTYPE_IMAGE;
    data.margin = data.margin || new Vec4();
    data.width = data.width || 100;
    data.height = data.height || 50;
    data.useInput = true;
    this.addComponent("element", data);

    this.addComponent("button", {
      imageEntity : this,
      hoverTint   : Util.createColor(255, 255, 255),
      pressedTint : Util.createColor(160, 160, 160),
    });

    this._initText();
  }

  _initText() {
    this.text = new Entity("text");
    this.addChild(this.text);

    let font = AssetLoader.getAssetByKey("CanvasFont");
    this.text.addComponent("element", {
      text      : "Button",
      fontAsset : font,
      fontSize  : 22,
      type      : ELEMENTTYPE_TEXT,
      color     : new Color(),
      pivot     : new Vec2(0.5, 0.5),
      alignment : new Vec2(0.5, 0.5),
      anchor    : new Vec4(0.5, 0.5, 0.5, 0.5),
      margin    : new Vec4(),
    });
  }
}
