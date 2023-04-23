export class ScriptConfig {
  constructor() {
    this.name = "";
    this.attributes = {};

    /** @type {() => {}} */
    this.initialize = null;

    /** @type {() => {}} */
    this.postInitialize = null;

    /** @type {(dt: number) => {}} */
    this.update = null;

    /** @type {(dt: number) => {}} */
    this.postUpdate = null;

    /** @type {() =>} */
    this.onEnable = null;

    /** @type {() =>} */
    this.onDisable = null;

    /** @type {() =>} */
    this.onDestroy = null;

    this._initialized = false;
  }
}
