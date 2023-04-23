import { StandardMaterial, Vec2 } from "playcanvas";
import { Tween } from "../integrate/tween";

export class AnimatedMaterial extends StandardMaterial {
  /**
   * @param {{ tilesX: number, tilesY: number , duration: number, loop: boolean, tiling: pc.Vec2, texture: pc.Texture}} options
   */
  constructor(options) {
    super();
    this.duration = options.duration > 0 ? options.duration : 1;
    this.diffuseMap = options.texture;
    this.loop = options.loop;
    this._initFrames(options.tilesX, options.tilesY);
    this.frameIndex = 0;
  }

  _initFrames(tilesX = 1, tilesY = 1) {
    this.tiling = new Vec2(1 / tilesX, 1 / tilesY);
    this.frames = [];
    for (var y = tilesY - 1; y >= 0; y--) {
      for (var x = 0; x < tilesY; x++) {
        this.frames.push(new Vec2(x / tilesX, y / tilesY));
      }
    }
    this.setTiling(this.tiling);
  }

  play(onCompleted, startFrame = 0) {
    this.stop();

    this.frameIndex = startFrame;
    let playedTime = this.duration * (this.frameIndex / this.frames.length);
    let target = { playedTime };
    let duration = Math.max(0, this.duration - playedTime);
    this._tweenAnim = Tween.createTween(target, { playedTime: this.duration }, {
      duration,
      onUpdate: () => {
        var currentFrame = Math.floor(target.playedTime / this.duration * (this.frames.length));
        if (currentFrame !== this.frameIndex && currentFrame < this.frames.length) {
          this.frameIndex = currentFrame;
        }
      },
      onComplete: () => {
        onCompleted && onCompleted();
        if (this.loop) {
          this.play(onCompleted);
        }
      },
    }).start();
  }

  stop() {
    if (this._tweenAnim) {
      this._tweenAnim.stop();
      this._tweenAnim = null;
    }
  }

  get frameIndex() {
    return this._frameIndex;
  }

  set frameIndex(index) {
    this._frameIndex = index;
    let frame = this.frames[this._frameIndex];
    frame && this.setFrame(frame);
    this.update();
  }

  setTiling(tiling) {
    this.diffuseMapTiling.copy(tiling);
    this.opacityMapTiling.copy(tiling);
    this.emissiveMapTiling.copy(tiling);
  }

  setFrame(frame) {
    this.diffuseMapOffset.copy(frame);
    this.opacityMapOffset.copy(frame);
    this.emissiveMapOffset.copy(frame);
  }
}
