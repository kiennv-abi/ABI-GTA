import { Entity } from "playcanvas";

Entity.prototype.enable = function() {
  this.enabled = true;
};

Entity.prototype.disable = function() {
  this.enabled = false;
};
