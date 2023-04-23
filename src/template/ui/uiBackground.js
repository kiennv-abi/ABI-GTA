import { Util } from "../../helpers/util";
import { Game } from "../../game";
import { Entity, Vec2, Vec4 } from "playcanvas";

export class UIBackground extends Entity {
  constructor(config) {
    super("img_bg");
    let spriteAsset = config.spriteAsset;
    let scale = config.scale;
    let pAnchor = config.pAnchor;
    let pPivot = config.pPivot;
    let lAnchor = config.lAnchor;
    let lPivot = config.lPivot;

    this.addComponent("element", {
      type: "image",
      spriteAsset,
    });
    this.pAnchor = pAnchor ? pAnchor : new Vec4(0.5, 0.5, 0.5, 0.5);
    this.pPivot = pPivot ? pPivot : new Vec2(0.5, 0.5);
    this.lAnchor = lAnchor ? lAnchor : this.pAnchor.clone();
    this.lPivot = lPivot ? lPivot : this.pPivot.clone();
    this.frame = Util.getSpriteFrame(spriteAsset.resource, scale);
    this.resize();
  }

  resize() {
    let screenWidth = Game.width;
    let screenHeight = Game.height;
    let isPortrait = screenWidth < screenHeight;
    let width = this.frame.width;
    let height = this.frame.height;
    if (!isPortrait) {
      width = this.frame.height;
      height = this.frame.width;
    }

    let ratio1 = Math.max(width / screenWidth, height / screenHeight);
    screenWidth *= ratio1;
    screenHeight *= ratio1;

    let ratio2 = Math.max(screenWidth / this.frame.width, screenHeight / this.frame.height);
    this.element.width = this.frame.width * ratio2;
    this.element.height = this.frame.height * ratio2;

    if (isPortrait) {
      this.element.pivot = this.pPivot;
      this.element.anchor = this.pAnchor;
    }
    else {
      this.element.pivot = this.lPivot;
      this.element.anchor = this.lAnchor;
    }
  }
}
