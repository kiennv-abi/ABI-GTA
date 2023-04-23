import { createScript, Entity } from "playcanvas";
import { Util } from "../../../helpers/util";
import { ScriptConfig } from "./scriptConfig";

export class Script {
  /**
   * @returns {ScriptConfig}
   */
  static createScript(config = new ScriptConfig()) {
    let scriptConfig = Util.copyObject(config);
    return scriptConfig;
  }

  /**
   * @param {ScriptConfig} config
   */
  static _initScript(config) {
    let script = createScript(config.name);

    Object.keys(config).forEach((key) => {
      if (key === "attributes") {
        Object.keys(config.attributes).forEach((name) => {
          script.attributes.add(name, config.attributes[name]);
        });
      }
      else {
        script.prototype[key] = config[key];
      }
    });

    config._initialized = true;
  }
}

/**
 * @param {ScriptConfig} config
 * @param {*} attributes
 */
Entity.prototype.addScript = function(config, attributes = {}) {
  if (!config._initialized) {
    Script._initScript(config);
  }

  if (!this.script) {
    this.addComponent("script");
  }

  let script = this.script.create(config.name, {
    attributes,
  });

  if (script.onEnable) {
    script.on("enable", script.onEnable, script);
  }

  if (script.onDisable) {
    script.on("disable", script.onDisable, script);
  }

  if (script.onDestroy) {
    script.on("destroy", script.onDestroy, script);
  }

  if (!script.enable) {
    script.enable = () => script.enabled = true;
  }

  if (!script.disable) {
    script.disable = () => script.enabled = false;
  }

  return script;
};

/**
 * @param {ScriptConfig} config
 * @returns {pc.ScriptType}
 */
Entity.prototype.getScript = function(config) {
  if (!this.script) {
    return null;
  }

  return this.script[config.name];
};
