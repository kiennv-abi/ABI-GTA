import TWEEN from "@tweenjs/tween.js";
import { Vec3 } from "playcanvas";
import { Util } from "../../../helpers/util";
import { Time } from "../time/time";
import { Tweener } from "./tweener";

export class Tween {
  static defaultConfig = Object.freeze({
    duration    : 1,
    easing      : TWEEN.Easing.Linear.None,
    loop        : false,
    yoyo        : false,
    delay       : 0,
    repeatDelay : 0,
    repeat      : 0,
    onStart     : () => { },
    onRepeat    : () => { },
    onStop      : () => { },
    onUpdate    : () => { },
    onComplete  : () => { },
  });

  /**
   * @param {pc.Application} app
   */
  static init(app) {
    app.on("update", this.update, this);
  }

  static update() {
    TWEEN.update(Time.currentMS);
  }

  static playShakeTween(entity, strength = new Vec3(), shakeDuration = 0.1) {
    let position = Util.randomVector(strength.clone().scale(-1), strength);
    entity.shakeTween?.stop();
    entity.shakeTween = Tween.createLocalTranslateTween(entity, position, {
      duration   : shakeDuration,
      repeat     : 1,
      yoyo       : true,
      onComplete : () => {
        this.playShakeTween(entity, strength, shakeDuration);
      },
    }).start();
  }

  static createLocalTranslateTween(entity, dest = {}, config = Tween.defaultConfig) {
    let pos = entity.getLocalPosition().clone();
    let tempPos = new Vec3();
    let destKeys = Object.keys(dest);
    let tween = this.createTween(pos, dest, config);
    let onUpdate = tween._onUpdateCallback;
    tween.onUpdate(() => {
      tempPos.copy(entity.getLocalPosition());
      destKeys.forEach((key) => tempPos[key] = pos[key]);
      entity.setLocalPosition(tempPos);
      onUpdate();
    });
    return tween;
  }

  static createGlobalTranslateTween(entity, dest = {}, config = Tween.defaultConfig) {
    let pos = entity.getPosition().clone();
    let tempPos = new Vec3();
    let destKeys = Object.keys(dest);
    let tween = this.createTween(pos, dest, config);
    let onUpdate = tween._onUpdateCallback;
    tween.onUpdate(() => {
      tempPos.copy(entity.getPosition());
      destKeys.forEach((key) => tempPos[key] = pos[key]);
      entity.setPosition(tempPos);
      onUpdate();
    });
    return tween;
  }

  static createRotateTween(entity, dest = {}, config = Tween.defaultConfig) {
    let rotation = entity.getLocalEulerAngles().clone();
    let tempRotation = new Vec3();
    let destKeys = Object.keys(dest);
    let tween = this.createTween(rotation, dest, config);
    let onUpdate = tween._onUpdateCallback;
    tween.onUpdate(() => {
      tempRotation.copy(entity.getLocalEulerAngles());
      destKeys.forEach((key) => tempRotation[key] = rotation[key]);
      entity.setLocalEulerAngles(tempRotation);
      onUpdate();
    });
    return tween;
  }

  static createScaleTween(entity, dest = {}, config = Tween.defaultConfig) {
    let scale = entity.getLocalScale().clone();
    let tempScale = new Vec3();
    let destKeys = Object.keys(dest);
    let tween = this.createTween(scale, dest, config);
    let onUpdate = tween._onUpdateCallback;
    tween.onUpdate(() => {
      tempScale.copy(entity.getLocalScale());
      destKeys.forEach((key) => tempScale[key] = scale[key]);
      entity.setLocalScale(tempScale);
      onUpdate();
    });
    return tween;
  }

  static createMaterialTween(material, dest = {}, config = Tween.defaultConfig) {
    let tween = this.createTween(material, dest, config);
    let onUpdate = tween._onUpdateCallback;
    tween.onUpdate(() => {
      material.update();
      onUpdate();
    });
    return tween;
  }

  static createCountTween(config = Tween.defaultConfig) {
    let target = { percent: 0 };
    let tween = this.createTween(target, { percent: 1 }, config);
    return tween;
  }

  static createTween(target, dest = {}, config = Tween.defaultConfig) {
    let tweenConfig = this._setupConfig(config);
    let tween = new Tweener(target);
    tween.to(dest, tweenConfig.duration * 1000);
    this._setupTween(tween, tweenConfig);
    return tween;
  }

  static _setupConfig(config) {
    return Util.copyObject(config, Util.copyObject(Tween.defaultConfig));
  }

  static _setupTween(tween, config) {
    tween.easing(config.easing);
    tween.delay(config.delay * 1000);
    tween.repeatDelay(config.repeatDelay * 1000);
    if (config.loop) {
      tween.repeat(Infinity);
    }
    else {
      tween.repeat(config.repeat);
    }
    tween.yoyo(config.yoyo);
    tween.onStart(config.onStart);
    tween.onRepeat(config.onRepeat);
    tween.onStop(config.onStop);
    tween.onUpdate(config.onUpdate);
    tween.onComplete(config.onComplete);
  }

  static get Easing() {
    return TWEEN.Easing;
  }
}
