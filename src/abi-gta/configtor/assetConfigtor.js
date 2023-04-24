import { BLEND_ADDITIVE, BLEND_NORMAL, StandardMaterial, Texture, Vec3 } from "playcanvas";
import { AssetLoader } from "../../assetLoader/assetLoader";
import { Game } from "../../game";
import { Util } from "../../helpers/util";

export class AssetConfigurator {
  static config() {
    this._configPoliceCar();
    this._configMuscleCar();
    this._configWheel();
    this._createCanvasFont();
    // this._configSkyboxCubemap();
  }

  static _createCanvasFont() { 
     AssetLoader.createCanvasFont("Arial", 106, "bold");
  }

  static _configWheel() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_car_police").resource;
    let texEmissive = AssetLoader.getAssetByKey("tex_emissive_01").resource;
    mat.diffuseMap = tex;
    mat.emissiveMap = texEmissive;
    this.setModelMaterial("model_car_wheel", mat);
  }

  static _configPoliceCar() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_car_police").resource;
    let texEmissive = AssetLoader.getAssetByKey("tex_emissive_01").resource;
    mat.diffuseMap = tex;
    mat.emissiveMap = texEmissive;
    let matGlass = new StandardMaterial();
    matGlass.diffuse = Util.createColor(50, 82, 82);
    matGlass.blendType = BLEND_NORMAL;
    matGlass.opacity = 0.3;
    this.setModelMaterial("model_car_police", matGlass, 1);
    this.setModelMaterialWithIndexes("model_car_police", mat, [0, 2, 3]);
  }

  static _configMuscleCar() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_car_police").resource;
    let texEmissive = AssetLoader.getAssetByKey("tex_emissive_01").resource;
    mat.diffuseMap = tex;
    mat.emissiveMap = texEmissive;
    let matGlass = new StandardMaterial();
    matGlass.diffuse = Util.createColor(50, 82, 82);
    matGlass.blendType = BLEND_NORMAL;
    matGlass.opacity = 0;
    this.setModelMaterialWithIndexes("model_car_muscle", mat, [1, 2, 3]);
    this.setModelMaterial("model_car_muscle", matGlass, 0);
  }

  static _configSkyboxCubemap() {
    let textures = [
      AssetLoader.getAssetByKey("tex_skybox_right"),
      AssetLoader.getAssetByKey("tex_skybox_left"),
      AssetLoader.getAssetByKey("tex_skybox_up"),
      AssetLoader.getAssetByKey("tex_skybox_down"),
      AssetLoader.getAssetByKey("tex_skybox_front"),
      AssetLoader.getAssetByKey("tex_skybox_back"),
    ];
    let cmSkybox = new Texture(Game.app.graphicsDevice, {
      cubemap: true,
    });
    cmSkybox.setSource(textures.map((texture) => texture.resource.getSource()));
    AssetLoader.registerAsset(cmSkybox, "cm_skybox", "cubemap");
  }

  /**
   * @param {pc.Texture} texture
   */
  static setTextureFiltering(texture, filter = FILTER_NEAREST, address = ADDRESS_REPEAT) {
    texture.minFilter = filter;
    texture.magFilter = filter;
    texture.addressU = address;
    texture.addressV = address;
  }

  static setSpriteSlice(spriteAsset, border = new Vec4(), pixelsPerUnit = 1) {
    let asset = AssetLoader.getAssetByKey(spriteAsset);
    asset.resource.renderMode = SPRITE_RENDERMODE_SLICED;
    this.setSpriteBorder(asset, border.x, border.y, border.z, border.w);
    this.setSpritePixelsPerUnit(spriteAsset, pixelsPerUnit);
  }

  static setSpriteBorder(spriteAsset, left = 0, bottom = 0, right = 0, top = 0) {
    let sprite = AssetLoader.getAssetByKey(spriteAsset).resource;
    sprite.atlas.frames[sprite.frameKeys[0]].border.set(left, bottom, right, top);
  }

  static setSpritePixelsPerUnit(spriteAsset, pixelsPerUnit = 100) {
    let sprite = AssetLoader.getAssetByKey(spriteAsset).resource;
    sprite.pixelsPerUnit = pixelsPerUnit;
  }

  static setModelTexture(modelAsset, textureAsset, index = 0) {
    let material = this.getMaterial(modelAsset, index);
    let texture = AssetLoader.getAssetByKey(textureAsset);
    material.diffuseMap = texture.resource;
  }

  static setModelDiffuse(modelAsset, color, index = 0) {
    let material = this.getMaterial(modelAsset, index);
    material.diffuse.copy(color);
    material.diffuseTint = true;
  }

  static setModelMaterial(modelAsset, material, index = 0) {
    let model = AssetLoader.getAssetByKey(modelAsset).resource;
    model.meshInstances[index].material = material;
  }

  static setModelMaterialInRange(modelAsset, material, startIndex, endIndex) {
    for (var i = startIndex; i <= endIndex; i++) {
      this.setModelMaterial(modelAsset, material, i);
    }
  }

  static setModelMaterialWithIndexes(modelAsset, material, indexes = []) {
    indexes.forEach((index) => {
      this.setModelMaterial(modelAsset, material, index);
    });
  }

  static createColorMaterial(r = 255, g = 255, b = 255, a = 1) {
    let material = new StandardMaterial();
    if (typeof r === "object") {
      material.diffuse = r;
    }
    else {
      material.diffuse = Util.createColor(r, g, b, a);
    }
    return material;
  }

  /**
   * @param {string} modelName
   * @returns {pc.StandardMaterial}
   */
  static getMaterial(modelName, index = 0) {
    let model = AssetLoader.getAssetByKey(modelName);
    let material = model.resource.meshInstances[index].material;

    if (material.id === 1) { // default material
      material = new StandardMaterial();
      model.resource.meshInstances[index].material = material;
    }

    return material;
  }
}