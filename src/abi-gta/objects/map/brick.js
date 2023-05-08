import { Entity, Vec3 } from "playcanvas";
import { CastBox } from "../../scripts/raycast/castBox";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { GameConstant } from "../../../gameConstant";

export class Brick extends Entity{
  constructor() {
    super("brick");
    this.addComponent("model", { asset: AssetLoader.getAssetByKey("model_sidewalk") });

    this.castBox = this.addScript(CastBox, {
      scale: new Vec3(4, 1, 4),
      render: GameConstant.DEBUG_ON
    });
  }
}