import { AssetLoader } from "../../assetLoader/assetLoader";
import { Game } from "../../game";
import { Util } from "../../helpers/util";
import { AssetConfigurator } from "./assetConfigtor";

export class Configurator {
  static config() {
    this.scene = Game.app.scene;
    this._configScene();
    AssetConfigurator.config();
  }

  static _configScene() {
    this.scene.ambientLight = Util.createColor(255, 255, 255);
    this.scene.gammaCorrection = pc.GAMMA_SRGB;
    this.scene.envAtlas = AssetLoader.getAssetByKey("helipad-env-atlas").resource;
  }
}
