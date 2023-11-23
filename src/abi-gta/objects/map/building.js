import { BLEND_NORMAL, Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { CastBox } from "../../scripts/raycast/castBox";
import { GameConstant } from "../../../gameConstant";

export class Building extends Entity{
  constructor(modelAsset, castBoxSize, dataFormat, shadowConfig) {
    super();
    this.dataFormat = dataFormat;
    this._initModel(modelAsset);
    this._initCastBox(castBoxSize);
    this._initShadow(shadowConfig);
  }

  _initModel(modelAsset) {
    this.addComponent("model", {
      asset: AssetLoader.getAssetByKey(modelAsset),
    });
    this.addComponent("collision",{
      type: "mesh",
      // asset: AssetLoader.getAssetByKey(modelAsset)
    });
    this.addComponent("rigidbody", {
      type: "static"
    })
  }

  _initCastBox(size) {
    this.castBox = this.addScript(CastBox, {
      render: GameConstant.DEBUG_ON,
      scale: size,
    });
  }

  _initShadow(shadowConfig) {
    this.shadow = new Entity();
    this.shadow.addComponent("model", {
      type: shadowConfig.type,
    });
    this.shadow.setLocalScale(shadowConfig.size);
    this.shadow.setLocalPosition(shadowConfig.pos);
    this.addChild(this.shadow);
    this.shadow.enabled = false;
  }

  updateShadow(isValid = true) { 
    this.activeShadow(true);
    if (isValid) {
      this.shadow.model.meshInstances[0].material = AssetLoader.getAssetByKey("mat_shadow_green").resource;
    } else { 
      this.shadow.model.meshInstances[0].material = AssetLoader.getAssetByKey("mat_shadow_red").resource;
    }
  }

  activeShadow(isActive) { 
    this.shadow.enabled = isActive;
  }

  updateOpacity(opacity) {
    this.model.meshInstances.forEach((meshInstance) => { 
      let mat = meshInstance.material.clone();
      mat.blendType = BLEND_NORMAL;
      mat.opacity = opacity;
      meshInstance.material = mat;
    });
  }
}