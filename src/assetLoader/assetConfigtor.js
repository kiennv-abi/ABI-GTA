import { BLEND_NORMAL, StandardMaterial, Texture } from "playcanvas";
import { AssetLoader } from "./assetLoader";

export class AssetConfigurator {
  static config(app) {
    this._configObject("PolygonCity_Texture_01_A", "CityHall");
    this._configObject("PolygonCity_Texture_01_A", "Office_Round01");
    this._configObject("PolygonCity_Texture_01_A", "OfficeOld_Large_Base");
    this._configObject("PolygonCity_Texture_01_A", "OfficeSquare");
    this._configObject("PolygonCity_Texture_01_A", "Side_Walk_2");
    this._configObject("PolygonCity_Texture_01_A", "Side_Walk_1");
    this._configObject("PolygonCity_Texture_01_A", "SideWalK_Dip_Corner");
    this._configObject("PolygonCity_Texture_01_A", "Station_01");
    this._configObject("PolygonCity_Road_01", "Road01");
    this._configObject("PolygonCity_Road_01", "RoadCrossing");
    this._configObject("PolygonCity_Road_01", "RoadVertical");
    this._configObject("PolygonCity_Road_01", "Road_Crossing_01");
    this._configObject("texCarBlue", "model_car_large");
    this._configObject("texCarBlue", "largeCar");
    this._configObject("texCarBlue", "largeCarWheel");
    this._configObject("texCarRed", "smallCar");
    this._configCarMaterial();
    this._configSkyboxCubemap(app);
  }

  static _configObject(nameMaterial, keyModel) {
    let material = new StandardMaterial();
    material.diffuseMap = AssetLoader.getAssetByKey(nameMaterial).resource;
    material.update();

    let model = AssetLoader.getAssetByKey(keyModel).resource;
    model.meshInstances.forEach((mesh) => {
      mesh.material = material;
    });
  }

  static _configCarMaterial() {
    let redCarMaterial = new pc.StandardMaterial();
    let redTex = AssetLoader.getAssetByKey("texCarRed");
    redCarMaterial.diffuseMap = redTex;
    AssetLoader.registerAsset(redCarMaterial, "material_red_car", "material");
  }

  static materialGreen() {
    let material = new StandardMaterial();
    material.diffuseMap = AssetLoader.getAssetByKey(
      "PolygonCity_Road_01"
    ).resource;
    material.blendType = BLEND_NORMAL;
    material.diffuseTint = true;
    material.diffuse.set(7 / 255, 185 / 255, 0);
    material.opacity = 0.3;
    material.update();
    return material;
  }

  static materialRed() {
    let material = new StandardMaterial();
    material.diffuseMap = AssetLoader.getAssetByKey(
      "PolygonCity_Road_01"
    ).resource;
    material.diffuseTint = true;
    material.diffuse.set(182 / 255, 0, 0);
    material.opacity = 0.3;
    material.update();
    return material;
  }

  static _configSkyboxCubemap(app) {
    let textures = [
      AssetLoader.getAssetByKey("tex_skybox_right"),
      AssetLoader.getAssetByKey("tex_skybox_left"),
      AssetLoader.getAssetByKey("tex_skybox_up"),
      AssetLoader.getAssetByKey("tex_skybox_down"),
      AssetLoader.getAssetByKey("tex_skybox_front"),
      AssetLoader.getAssetByKey("tex_skybox_back"),
    ];
    let cmSkybox = new Texture(app.graphicsDevice, {
      cubemap: true,
    });
    cmSkybox.setSource(textures.map((texture) => texture.resource.getSource()));
    AssetLoader.registerAsset(cmSkybox, "cm_skybox", "cubemap");
  }
}