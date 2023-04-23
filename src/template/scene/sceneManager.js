import { Game } from "../../game";

export class SceneManager {
  /**
   * @param {Array<Scene>} scenes
   */
  static init(scenes) {
    this.scenes = scenes;
    /** @type {Array<Scene>} */
    this.addtiveScenes = [];
  }

  /**
   * @param {Scene} scene
   */
  static loadScene(scene) {
    let oldScene = this.currentScene;
    this.currentScene = scene;

    this.addtiveScenes.forEach((s) => s.destroy());
    Game.app.root.addChild(this.currentScene);
    this.currentScene.create();

    if (oldScene) {
      Game.app.root.removeChild(oldScene);
      oldScene.destroy();
    }
  }

  static loadSceneAddtive(scene) {
    this.addtiveScenes.push(scene);
    Game.app.root.addChild(scene);
  }

  static update(dt) {
    this.currentScene?.update(dt);
    this.addtiveScenes.forEach((scene) => scene.update(dt));
  }

  static resize() {
    this.currentScene?.resize();
    this.addtiveScenes.forEach((scene) => scene.resize());
  }

  static pause() {
    this.currentScene?.pause();
    this.addtiveScenes.forEach((scene) => scene.pause());
  }

  static resume() {
    this.currentScene?.resume();
    this.addtiveScenes.forEach((scene) => scene.resume());
  }

  static getScene(key) {
    return this.scenes.find((s) => s.key === key);
  }
}
