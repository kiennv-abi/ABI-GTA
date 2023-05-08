import { Script } from "../../../template/systems/script/script";
import { SpawningEvent } from "./spawningEvent";

export const Spawner = Script.createScript({
  name: "spawner",

  attributes: {
    class    : {},
    args     : { default: [] },
    poolSize: { default: 0 },
    callback: { default: null },
  },

  initialize() {
    this.pool = [];
  },

  postInitialize() {
    this._createPool();
    this.callback && this.callback();
  },

  spawn(parent = null, index = -1) {
    let entity = this.pool.pop();
    if (!entity) {
      entity = this.createEntity();
    }

    entity.enabled = true;
    entity.once(SpawningEvent.Despawn, () => this.despawn(entity));

    if (parent) {
      if (index >= 0) {
        parent.insertChild(entity, index);
      }
      else {
        parent.addChild(entity);
      }
    }

    entity.fire(SpawningEvent.Spawn);
    return entity;
  },

  despawn(entity) {
    entity.enabled = false;
    entity.parent.removeChild(entity);
    this.pool.push(entity);
  },

  spawnAt(targetEntity, parent = null, index = -1) {
    let pos = targetEntity.getPosition();
    let entity = this.spawn(parent || targetEntity, index);
    entity.setPosition(pos);
    return entity;
  },

  spawnTo(pos, parent = null, index = -1) {
    let entity = this.spawn(parent || this.entity, index);
    entity.setPosition(pos);
    return entity;
  },

  _createPool: function() {
    for (var i = 0; i < this.poolSize; i++) {
      this.pool.push(this.createEntity());
    }
  },

  createEntity() {
    return new this.class(...this.args);
  },
});
