import { Script } from "../../../template/systems/script/script";

export const OnEnable = Script.createScript({
  name: "onEnableCallback",

  attributes: {
    callback: { default: null },
  },

  onEnable() {
    this.callback?.();
  },
});
