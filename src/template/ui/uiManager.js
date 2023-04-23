import { Entity } from "playcanvas";
import { GameConstant } from "../../gameConstant";

export class UIManager extends Entity {
  constructor() {
    super("ui_manager");
    /** @type {Array<UIScreen>} */
    this.screens = [];
  }

  update(dt) {
    this.screens.forEach((screen) => screen.enabled && screen.update(dt));
  }

  pause() {
    this.screens.forEach((screen) => screen.enabled && screen.pause());
  }

  resume() {
    this.screens.forEach((screen) => screen.enabled && screen.resume());
  }

  /**
   * @param {...UIScreen} screens
   */
  addScreens(...screens) {
    screens.forEach((screen) => {
      this.addChild(screen);
      this.screens.push(screen);
    });
  }

  /**
   * @param {...string} keys
   */
  removeScreen(...keys) {
    keys.forEach((key) => {
      let screen = this.getScreen(key);
      if (screen) {
        this.screens.splice(screen, 1);
      }
    });
  }

  /**
   * @param {string} key
   */
  setScreenActive(key, isActive = true) {
    let screen = this.getScreen(key);
    if (screen) {
      isActive && screen.create();
      screen.enabled = isActive;
    }
    else if (GameConstant.DEBUG_ON) {
      console.warn(`Scene ${key} not found!`);
    }
  }

  disableAllScreens() {
    this.screens.forEach((screen) => screen.enabled = false);
  }

  getScreen(key) {
    return this.screens.find((screen) => screen.key === key);
  }

  resize() {
    this.screens.forEach((screen) => screen.enabled && screen.resize());
  }
}
