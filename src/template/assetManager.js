import { Game } from "../game";
import assetData from "../../dist/assets/assetData.json";
import { SoundManager } from "./soundManager";
import * as base64toArrayBuffer from "base64-arraybuffer";
import { ADDRESS_REPEAT, Asset, CanvasFont, Color, FILTER_LINEAR, Font, Sprite, Texture, TextureAtlas, Vec2, Vec4 } from "playcanvas";
// import shader from "../../assets/jsons/shader.json";
export class AssetManager {
  /**
   * @param {Application} app
   */
  static init(app) {
    this.loaded = false;
    this.app = app;
    this.assets = app.assets;
    this._loadedTextures = 0;
    this._loadedAudio = 0;
    /** @type {Array<Texture>} */
    this._textures = [];
  }

  static load(onLoad) {
    this.onLoad = onLoad;
    this._addTextures();
    this._loadTextures(() => {
      this._loadTextureAtlases();
      this._loadSprites();
      this._checkLoad();
    });

    this._loadModels();
    this._loadAnims();
    this._loadFonts();
    // this._loadShader();
    // this._loadSpines();

    SoundManager.load(assetData.sound, assetData.soundData, this._checkLoad.bind(this));
  }

  static _checkLoad() {
    if (this._loadedTextures >= this._textures.length && SoundManager.loaded) {
      this.loaded = true;
      this.onLoad && this.onLoad();
    }
  }

  static _addTextures() {
    // TODO: get better solution for emty atlas
    if (assetData.atlas) {
      this.textureAtlas = this._createTexture(assetData.atlas);
    }

    if (assetData.atlas8) {
      this.textureAtlas8 = this._createTexture(assetData.atlas8);
    }

    if (assetData.atlas32) {
      this.textureAtlas32 = this._createTexture(assetData.atlas32);
    }

    Object.keys(assetData.textures).forEach((key) => {
      let texture = this._createTexture(assetData.textures[key]);
      this.registerAsset(texture, key, "texture");
    });

    // Font textures
    Object.keys(assetData.fonts).forEach((key) => {
      let textures = assetData.fonts[key].textures;
      textures.forEach((textureData) => {
        let texture = this._createTexture(textureData.data);
        this.registerAsset(texture, textureData.key, "texture");
      });
    });

    // Spine Texture
    Object.keys(assetData.spines).forEach((key) => {
      let textureData = assetData.spines[key].tex;
      let texture = this._createTexture(textureData);
      this.registerAsset(texture, `${key}.png`, "texture");
    });
  }

  static _createTexture(data) {
    let texture = new Texture(Game.app.graphicsDevice);
    texture.data = data;
    this._textures.push(texture);
    return texture;
  }

  static _loadTextures(onLoadTextures) {
    this.onLoadTextures = onLoadTextures;

    for (let i = 0; i < this._textures.length; i++) {
      this._loadTexture(this._textures[i], this._textures[i].data);
    }
  }

  /**
   * @param {Texture} texture
   * @param {string} data
   */
  static _loadTexture(texture, data) {
    texture.minFilter = FILTER_LINEAR;
    texture.magFilter = FILTER_LINEAR;
    texture.addressU = ADDRESS_REPEAT;
    texture.addressV = ADDRESS_REPEAT;

    let img = document.createElement("img");
    img.onload = () => {
      texture.setSource(img);
      texture.mipmaps = true;
      this._onOneTextureLoaded();
    };

    img.src = data;
  }

  static _onOneTextureLoaded() {
    this._loadedTextures++;
    if (this._loadedTextures >= this._textures.length) {
      this.onLoadTextures && this.onLoadTextures();
    }
  }

  static _loadTextureAtlases() {
    if (this.textureAtlas) {
      this.atlas = new TextureAtlas();
      this.atlas.texture = this.textureAtlas;
      this.atlas.frames = this.getAtlasFrames(this.textureAtlas, assetData.atlasData);
    }

    if (this.textureAtlas8) {
      this.atlas8 = new TextureAtlas();
      this.atlas8.texture = this.textureAtlas8;
      this.atlas8.frames = this.getAtlasFrames(this.textureAtlas8, assetData.atlas8Data);
    }

    if (this.textureAtlas32) {
      this.atlas32 = new TextureAtlas();
      this.atlas32.texture = this.textureAtlas32;
      this.atlas32.frames = this.getAtlasFrames(this.textureAtlas32, assetData.atlas32Data);
    }
  }

  static getAtlasFrames(texture, data) {
    let frames = {};
    Object.keys(data.frames).forEach((key) => {
      let frame = data.frames[key].frame;
      let anchor = data.frames[key].anchor;

      frames[key] = {
        rect   : new Vec4(frame.x, texture.height - frame.y - frame.h, frame.w, frame.h),
        pivot  : new Vec2(1 - anchor.x, 1 - anchor.y),
        border : new Vec4(0, 0, 0, 0),
      };
    });
    return frames;
  }

  static _loadSprites() {
    this.atlas && this._loadAtlasSprite(this.atlas);
    this.atlas8 && this._loadAtlasSprite(this.atlas8);
    this.atlas32 && this._loadAtlasSprite(this.atlas32);
  }

  static _loadAtlasSprite(atlas) {
    Object.keys(atlas.frames).forEach((key) => {
      let sprite = new Sprite(Game.app.graphicsDevice);
      sprite.atlas = atlas;
      sprite.frameKeys = [key];
      sprite.pixelsPerUnit = 100;
      this.registerAsset(sprite, key, "sprite");
    });
  }

  static _loadModels() {
    Object.keys(assetData.models).forEach((key) => {
      let modelData = {
        type : assetData.models[key].type,
        data : assetData.models[key].type === ".glb"
          ? base64toArrayBuffer.decode(assetData.models[key].data)
          : assetData.models[key].data,
      };
      let model = this.app.loader.getHandler("model").open(modelData.type, modelData.data);
      let asset = new Asset(key, "model");
      asset.resource = model;
      asset.loaded = true;
      this.assets.add(asset);
    });
  }

  static _loadAnims() {
    Object.keys(assetData.anims).forEach((key) => {
      let animData = {
        type : assetData.anims[key].type,
        data : assetData.anims[key].type === ".glb"
          ? base64toArrayBuffer.decode(assetData.anims[key].data)
          : assetData.anims[key].data,
      };

      let anim = this.app.loader.getHandler("animation").open(animData.type, animData.data);
      if (animData.type === ".glb") {
        // TODO: load all glb animations
        this.registerAsset(anim[0], key, "animation");
      }
      else {
        this.registerAsset(anim, key, "animation");
      }
    });
  }

  static _loadFonts() {
    Object.keys(assetData.fonts).forEach((key) => {
      var data = this._upgradeFontDataSchema(assetData.fonts[key].data);
      var textures = this.assets.filter((asset) => asset.name.indexOf(key) !== -1).reverse().map((asset) => asset.resource);
      let font = new Font(textures, data);
      this.registerAsset(font, key, "font");
    });
  }

  // upgrade font data schema function from engine
  static _upgradeFontDataSchema(data) {
    // convert v1 and v2 to v3 font data schema
    if (data.version < 3) {
      if (data.version < 2) {
        data.info.maps = data.info.maps || [{
          width  : data.info.width,
          height : data.info.height,
        }];
      }
      data.chars = Object.keys(data.chars || {}).reduce((newChars, key) => {
        var existing = data.chars[key];
        // key by letter instead of char code
        var newKey = existing.letter === undefined ? this._fromCodePoint(key) : existing.letter;
        if (data.version < 2) {
          existing.map = existing.map || 0;
        }
        newChars[newKey] = existing;
        return newChars;
      }, {});
      data.version = 3;
    }
    return data;
  }

  /**
   * Polyfill for https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
   * function from the engine
   */
  static _fromCodePoint(...args) {
    var chars = [];
    var current;
    var codePoint;
    var units;
    for (var i = 0; i < args.length; ++i) {
      current = Number(args[i]);
      codePoint = current - 0x10000;
      units = current > 0xFFFF ? [(codePoint >> 10) + 0xD800, (codePoint % 0x400) + 0xDC00] : [current];
      chars.push(String.fromCharCode.apply(null, units));
    }
    return chars.join("");
  }

  static registerAsset(object, key, type) {
    let asset = new Asset(key, type, null);
    asset.resource = object;
    asset.loaded = true;
    this.assets.add(asset);
  }

  /**
   * @param {String | Asset} asset
   * @returns {Asset}
   */
  static find(asset) {
    if (typeof (asset) === "string") {
      return this.assets.find(asset);
    }
    return asset;
  }

  static createCanvasFont(text, name, fontSize, fontWeight) {
    let canvasFontArial = new CanvasFont(Game.app, {
      color      : new Color(1, 1, 1),
      fontName   : name,
      fontSize   : fontSize,
      fontWeight : fontWeight,
    });
    canvasFontArial.createTextures(text);

    let fontAsset = new Asset("CanvasFont", "font", {});
    fontAsset.resource = canvasFontArial;
    fontAsset.loaded = true;
    this.assets.add(fontAsset);
    return fontAsset;
  }

  static _loadShader() {
    let asset = new Asset("curveWorldVS", "shader");
    asset.resource = shader.curveWorldVS;
    asset.loaded = true;
    this.assets.add(asset);

    this.shaderLoaded = true;
    this._checkLoad();
  }

  static _loadSpines() {
    this.spines = {};
    this._allSpinesLoaded = false;
    let keys = Object.keys(assetData.spines);
    this.TOTAL_SPINES = keys.length;
    if (this.TOTAL_SPINES <= 0) {
      this._onSpineLoaded();
    }

    this._loadedSpines = 0;
    keys.forEach((key) => this._loadSpine(key, this._onOneSpineLoaded.bind(this)));
  }

  static _loadSpine(key, onLoad) {
    var json = assetData.spines[key].json;
    var atlas = assetData.spines[key].txt;
    this.registerAsset(json, `${key}Json`, "json");
    this.registerAsset(atlas, `${key}Atlas`, "text");
    onLoad && onLoad();
  }

  static _onOneSpineLoaded() {
    this._loadedSpines++;
    if (this._loadedSpines >= this.TOTAL_SPINES) {
      this._onSpineLoaded();
    }
  }

  static _onSpineLoaded() {
    this._allSpinesLoaded = true;
    this._checkLoad();
  }
}
