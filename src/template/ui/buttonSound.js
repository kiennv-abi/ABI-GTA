import { ELEMENTTYPE_GROUP, Entity } from "playcanvas";
import { Util } from "../../helpers/util";
import { AssetManager } from "../assetManager";
import { ObjectFactory } from "../objects/objectFactory";
import { SoundManager } from "../soundManager";

export class ButtonSound extends Entity {
  constructor(data) {
    super("btn_sound");
    data.type = ELEMENTTYPE_GROUP;
    this.addComponent("element", data);

    let sprOn = AssetManager.find("spr_btn_sound_on");
    this.btnOn = ObjectFactory.createImageElement(sprOn);
    this.addChild(this.btnOn);
    Util.registerOnTouch(this.btnOn.element, this._onTouchButton, this);

    let sprOff = AssetManager.find("spr_btn_sound_off");
    this.btnOff = ObjectFactory.createImageElement(sprOff);
    this.addChild(this.btnOff);
    Util.registerOnTouch(this.btnOff.element, this._onTouchButton, this);

    this._onMuteCallback = this._onMute.bind(this);
    SoundManager.on("mute", this._onMuteCallback);
    this._updateButton();
  }

  destroy() {
    super.destroy();
    SoundManager.off("mute", this._onMuteCallback);
  }

  _onTouchButton() {
    SoundManager.mute(!this.isMuted);
  }

  _onMute() {
    this._updateButton();
  }

  _updateButton() {
    this.btnOn.enabled = false;
    this.btnOff.enabled = false;

    if (this.isMuted) {
      this.btnOff.enabled = true;
    }
    else {
      this.btnOn.enabled = true;
    }
  }

  get isMuted() {
    return SoundManager.mute();
  }
}
