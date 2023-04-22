import * as pc from "playcanvas";
import assetData from "../../assets/jsons/assetData.json";

export class AssetLoader {
  static loadAssets(app, callback) {
    this.app = app;
    this.textures = [];
    this._loadedTexture = 0;
    this._textureAtlases = [];
    this.assets = [];
    this.assetScripts = {
      script1: new pc.Asset("script1", "script", {
      url: "../../assets/libs/tracking-camera.js",
    }),
      script2: new pc.Asset("script2", "script", {
      url: "../../assets/libs/render-physics.js",
    }),
      script3: new pc.Asset("script3", "script", {
      url: "../../assets/libs/action-physics-reset.js",
    }),
      script4: new pc.Asset("script4", "script", {
      url: "../../assets/libs/vehicle.js",
    }),
    }
    assetData.forEach((data) => {
      if (data.type === "sprite") {
        this.createTexture(data.url, data.key);
      }
      else {
        let asset = new pc.Asset(data.key, data.type, {
          url: data.url,
        });
        this.assets.push(asset);
      }
    });
    const assetListLoader = new pc.AssetListLoader(
      this.assets,
      this.app.assets
    );

    assetListLoader.load(() => {
      this._loadTextures(() => {
        this._loadTextureAtlases();
        this._loadSpriteAssets();
        callback();
      });
    });
  }

  static getAssetByKey(id) {
    return this.assets.find((asset) => asset.name === id);
  }

  static createTexture(src, key) {
    let tex = new pc.Texture(this.app.graphicsDevice);
    tex.src = src;
    tex.name = key;
    this.textures.push(tex);
    return tex;
  }

  static _loadSpriteAssets() {
    this._textureAtlases.forEach((tex) => {
      let sprite = new pc.Sprite(this.app.graphicsDevice);
      sprite.atlas = tex;
      sprite.frameKeys = Object.keys(tex.frames);
      sprite.pixelsPerUnit = 100;
      let asset = new pc.Asset(tex.texture.name, "sprite");
      asset.resource = sprite;
      asset.loaded = true;
      this.app.assets.add(asset);
      this.assets.push(asset);
    });
  }

  static _loadTextureAtlases() {
    this.textures.forEach((tex) => {
      let textureAtlas = new pc.TextureAtlas();
      textureAtlas.texture = tex;
      textureAtlas.frames = this.getAtlasFrame(tex);
      this._textureAtlases.push(textureAtlas);
    });
  }

  static registerAsset(object, key, type) {
    let asset = new pc.Asset(key, type, null);
    asset.resource = object;
    asset.loaded = true;
    this.app.assets.add(asset);
    this.assets.push(asset);
  }

  static getAtlasFrame(texture) {
    let frames = {};
    frames[texture.name] = {
      rect: new pc.Vec4(0, 0, texture.width, texture.height),
      pivot: new pc.Vec2(0.5, 0.5),
      border: new pc.Vec4(0, 0, 0, 0),
    };
    return frames;
  }

  static _loadTextures(onLoad) {
    this.onLoadTextures = onLoad;
    for (let index = 0; index < this.textures.length; index++) {
      this._loadTexture(this.textures[index]);
    }
  }

  static _loadTexture(texture) {
    texture.minFilter = pc.FILTER_LINEAR;
    texture.mapFilter = pc.FILTER_LINEAR;
    texture.addressU = pc.ADDRESS_REPEAT;
    texture.addressV = pc.ADDRESS_REPEAT;

    let img = document.createElement("img");
    img.onload = () => {
      texture.setSource(img);
      texture.mipmaps = true;
      this._onOneTextureLoaded();
    };
    img.src = texture.src;
  }

  static _onOneTextureLoaded() {
    this._loadedTexture++;
    if (this._loadedTexture >= this.textures.length) {
      this.onLoadTextures && this.onLoadTextures();
    }
  }

  static createCanvasFont(text, name, fontSize, fontWeight) {
    let canvasFontArial = new pc.CanvasFont(this.app, {
      color: new pc.Color(1, 1, 1),
      fontName: name,
      fontSize: fontSize,
      fontWeight: fontWeight,
    });
    canvasFontArial.createTextures(text);
    let fontAsset = new pc.Asset("CanvasFont", "font", {});
    fontAsset.resource = canvasFontArial;
    fontAsset.loaded = true;
    this.app.assets.add(fontAsset);
    return fontAsset;
  }

}