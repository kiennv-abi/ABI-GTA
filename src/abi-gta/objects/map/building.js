import { Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { CastBox } from "../../scripts/raycast/castBox";
import { GameConstant } from "../../../gameConstant";

export class Building extends Entity{
  constructor(modelAsset, castBoxSize) {
    super();
    this._initModel(modelAsset);
    this._initCastBox(castBoxSize);
  }

  _initModel(modelAsset) {
    this.addComponent("model", {
      asset: AssetLoader.getAssetByKey(modelAsset),
    });
  }

  _initCastBox(size) {
    this.castBox = this.addScript(CastBox, {
      render: GameConstant.DEBUG_ON,
      scale: size,
    });
  }
}