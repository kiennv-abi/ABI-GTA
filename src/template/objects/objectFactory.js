import { GameBackground } from "./gameBackground";
import { Util } from "../../helpers/util";
import { Color, ELEMENTTYPE_GROUP, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Vec2, Vec4 } from "playcanvas";
import { AssetLoader } from "../../assetLoader/assetLoader";

export class ObjectFactory {
  static createGameBackground() {
    let asset = AssetManager.find("spr_game_background");
    asset.resource.pixelsPerUnit = 100;
    return new GameBackground(asset);
  }

  static createCamera(name, data) {
    let entity = new Entity(name);
    entity.addComponent("camera", data);
    return entity;
  }

  static createColorBackground(color = new Color(), opacity = 1) {
    let sprBackground = new Entity("spr_bg");
    sprBackground.addComponent("element", {
      type   : "image",
      anchor : new Vec4(0, 0, 1, 1),
      color,
      opacity,
    });
    return sprBackground;
  }

  static createModel(modelAsset, ...materials) {
    let asset = AssetManager.find(modelAsset);
    let entity = new Entity(asset.name);
    entity.addComponent("model", { asset: asset });
    materials.forEach((mat, index) => {
      entity.model.meshInstances[index].material = mat;
    });
    return entity;
  }

  static createBox(materialAsset) {
    let entity = new Entity();
    entity.addComponent("model", { type: "box" });
    if (materialAsset) {
      let material = AssetManager.find(materialAsset).resource;
      entity.model.meshInstances[0].material = material;
    }
    return entity;
  }

  static createSphere(materialAsset) {
    let entity = new Entity();
    entity.addComponent("model", { type: "sphere" });
    if (materialAsset) {
      let material = AssetManager.find(materialAsset).resource;
      entity.model.meshInstances[0].material = material;
    }
    return entity;
  }

  static createCone(material) {
    let entity = new Entity();
    entity.addComponent("model", { type: "cone" });
    if (material) {
      entity.model.meshInstances[0].material = material;
    }
    return entity;
  }

  static createPlane(materialAsset) {
    let entity = new Entity();
    entity.addComponent("model", { type: "plane" });
    if (materialAsset) {
      let asset = AssetManager.find(materialAsset);
      entity.model.meshInstances[0].material = asset.resource;
    }
    return entity;
  }

  static createSprite(spriteAsset) {
    let asset = AssetManager.find(spriteAsset);
    let entity = new Entity(asset.name);
    entity.addComponent("sprite", { spriteAsset: asset });
    return entity;
  }

  static createImageElement(spriteAsset, data = {}) {
    let asset = AssetLoader.getAssetByKey(spriteAsset);
    let x = data.x || 0;
    let y = data.y || 0;
    let z = data.z || 0;
    let scale = data.scale || 1;
    let opacity = data.opacity || 1;
    let anchor = data.anchor || new Vec4(0.5, 0.5, 0.5, 0.5);
    let pivot = data.pivot || new Vec2(0.5, 0.5);
    let frame = Util.getSpriteFrame(asset.resource, scale);
    let width = data.width || frame.width;
    let height = data.height || frame.height;
    let entity = new Entity("element");
    entity.addComponent("element", {
      type        : ELEMENTTYPE_IMAGE,
      spriteAsset : asset,
      anchor      : anchor,
      pivot       : pivot,
      opacity     : opacity,
      width,
      height,
    });
    entity.setLocalPosition(x, y, z);
    return entity;
  }

  static createGroupElement(data = {}) {
    let x = data.x || 0;
    let y = data.y || 0;
    let z = data.z || 0;
    let anchor = data.anchor || new Vec4(0.5, 0.5, 0.5, 0.5);
    let pivot = data.pivot || new Vec2(0.5, 0.5);
    let entity = new Entity("element");
    entity.addComponent("element", {
      type: ELEMENTTYPE_GROUP,
      anchor,
      pivot,
    });
    entity.setLocalPosition(x, y, z);
    return entity;
  }

  static createTextElement(data) {
    let text = data.text || "";
    let fontText = data.fontText || text;
    let fontSize = data.fontSize || 16;
    let fontFamily = data.fontFamily || "Arial";
    let fontWeight = data.fontWeight || "normal";
    let anchor = data.anchor || new Vec4(0.5, 0.5, 0.5, 0.5);
    let pivot = data.pivot || new Vec2(0.5, 0.5);
    let color = data.color || new Color(0, 0, 0);
    let x = data.x || 0;
    let y = data.y || 0;
    let asset = AssetManager.createCanvasFont(fontText, fontFamily, fontSize, fontWeight);
    let entity = new Entity("txt_tutorial");
    entity.addComponent("element", {
      type      : ELEMENTTYPE_TEXT,
      fontAsset : asset,
      text,
      anchor,
      pivot,
      fontSize,
      color,
      margin    : new Vec4(0, 0, 0, 0),
    });
    entity.setLocalPosition(x, y, 0);
    return entity;
  }
}
