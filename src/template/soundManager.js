import { Howl, Howler } from "howler";
import { Debug } from "./debug";
import { GameConstant } from "../gameConstant";

export class SoundManager {
  static load(sound, soundData, onLoaded) {
    this.soundAvailable = !!sound;
    this._onLoaded = onLoaded;
    if (this.enabled) {
      this.audio = new Howl({
        src         : sound,
        sprite      : soundData,
        onload      : this._onLoad.bind(this),
        onloaderror : (id, err) => Debug.log("SoundManager", "Load error", id, err),
        onplayerror : (id, err) => Debug.log("SoundManager", "Play error", id, err),
      });
    }
    else {
      this._onLoad();
    }
  }

  static _onLoad() {
    Debug.log("SoundManager", "Loaded");
    this.loaded = true;
    this._onLoaded && this._onLoaded();
  }


  static play(id, volume = 1, loop = false) {
    if (!this.enabled) {
      return 0;
    }

    let audioId = this.audio.play(id);
    this.audio.volume(volume, audioId);
    this.audio.loop(loop, audioId);
    return audioId;
  }

  static resume(id, volume = 1, loop = false) {
    if (!this.enabled || !id) {
      return;
    }

    Debug.log("SoundManager", "Resume", id);

    let audioId = this.audio.play(id);
    this.audio.volume(volume, audioId);
    this.audio.loop(loop, audioId);
    this._resumeAudioContext();
  }

  static _resumeAudioContext() {
    if (Howler.ctx.state !== "running") { // fix iOS 13 not resume AudioContext after interrupt
      Howler.ctx.resume();
    }
  }

  static pause(id) {
    this.enabled && this.audio.pause(id);
  }

  static stop(id) {
    this.enabled && this.audio.stop(id);
  }

  static mute(mute, id) {
    return this.enabled && this.audio.mute(mute, id);
  }

  static muteAll(mute) {
    Howler.mute(mute);
  }

  static getDuration(id) {
    if (this.enabled) {
      return this.audio.duration(id);
    }
    else {
      return 0;
    }
  }

  static on(event, callback, id) {
    this.enabled && this.audio.on(event, callback, id);
  }

  static off(event, callback, id) {
    this.enabled && this.audio.off(event, callback, id);
  }

  static get enabled() {
    return GameConstant.SOUND_ENABLED && !!this.soundAvailable;
  }
}
