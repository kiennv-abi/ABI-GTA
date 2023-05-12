import { BLEND_NORMAL, StandardMaterial, Texture, Vec3 } from "playcanvas";
import { AssetLoader } from "../../assetLoader/assetLoader";
import { Game } from "../../game";
import { Util } from "../../helpers/util";

export class AssetConfigurator {
  static config() {
    this._createCanvasFont();
    this._configMaterialCars();
    this._configMapObjects();
    this._configWheel();
    this._configSidewalk();
    this._configRoad();
    this._configBuildingShadowMaterial();
  }

  static _createCanvasFont() { 
     AssetLoader.createCanvasFont("Arial", 106, "bold");
  }
  
  static _configBuildingShadowMaterial() {
    let matGreen = new StandardMaterial();
    let matRed = new StandardMaterial();
    matGreen.diffuseTint = true;
    matGreen.diffuse = Util.createColor(18, 184, 57);
    matRed.diffuseTint = true;
    matRed.diffuse = Util.createColor(207, 39, 39);
    AssetLoader.registerAsset(matGreen, "mat_shadow_green", "material");
    AssetLoader.registerAsset(matRed, "mat_shadow_red", "material");
  }

  static _configMapObjects() {
    let texEmissive = AssetLoader.getAssetByKey("tex_emissive_01").resource;
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_car_police_01").resource;
    mat.diffuseMap = tex;
    // mat.emissiveMap = texEmissive;

    this.setModelMaterialInRange("model_building_1", mat, 0, 2);
    this.setModelMaterialInRange("model_building_3", mat, 0, 8);
    this.setModelMaterial("model_building_2", mat);
  }

  static _configSidewalk() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_car_police_01").resource;
    let texEmissive = AssetLoader.getAssetByKey("tex_emissive_01").resource;
    mat.diffuseMap = tex;
    mat.emissiveMap = texEmissive;
    this.setModelMaterial("model_sidewalk", mat);
  }

  static _configRoad() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_road").resource;
    mat.diffuseMap = tex;
    this.setModelMaterialInRange("model_road", mat, 0, 1);
    this.setModelMaterialInRange("model_crossing", mat, 0, 1);
  }

  static _configWheel() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_car_police_01").resource;
    let texEmissive = AssetLoader.getAssetByKey("tex_emissive_01").resource;
    mat.diffuseMap = tex;
    mat.emissiveMap = texEmissive;
    this.setModelMaterial("model_wheell", mat);
    this.setModelMaterial("model_wheelr", mat);
  }

  static _configMaterialCars() {
    let matGlass = new StandardMaterial();
    matGlass.diffuse = Util.createColor(50, 82, 82);
    matGlass.blendType = BLEND_NORMAL;
    matGlass.opacity = 0;
    this.setModelMaterial("model_car_muscle", matGlass, 1);
    this.setModelMaterial("model_car_police", matGlass, 1);

    let texEmissive = AssetLoader.getAssetByKey("tex_emissive_01").resource;
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_car_police_01").resource;
    mat.diffuseMap = tex;
    mat.emissiveMap = texEmissive;

    let mat02 = new StandardMaterial();
    let tex02 = AssetLoader.getAssetByKey("tex_car_police_02").resource;
    mat02.diffuseMap = tex02;
    mat02.emissiveMap = texEmissive;

    let mat03 = new StandardMaterial();
    let tex03 = AssetLoader.getAssetByKey("tex_car_police_03").resource;
    mat03.diffuseMap = tex03;
    mat03.emissiveMap = texEmissive;

    AssetLoader.registerAsset(mat, "mat_car_1", "material");
    AssetLoader.registerAsset(mat02, "mat_car_2", "material");
    AssetLoader.registerAsset(mat03, "mat_car_3", "material");
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