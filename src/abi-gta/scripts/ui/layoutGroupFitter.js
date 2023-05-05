import { ORIENTATION_HORIZONTAL, ORIENTATION_VERTICAL } from "playcanvas";
import { Script } from "../../../template/systems/script/script";

export const LayoutGroupFitter = Script.createScript({
  name: "layoutGroupFitter",

  attributes: {
    orientation: { default: ORIENTATION_VERTICAL },
  },

  initialize() {
    this.fit();
  },

  onEnable() {
    this.fit();
  },

  fit() {
    if (this.orientation === ORIENTATION_VERTICAL) {
      this.fitVertical();
    }
    else if (this.orientation === ORIENTATION_HORIZONTAL) {
      this.fitHorizontal();
    }
  },

  fitVertical() {
    let layoutGroup = this.entity.layoutgroup;

    // Get all the children that are a layout element and resize the content element
    // and work out the height needed

    // Get the padding for the top and bottom
    let height = layoutGroup.padding.y + layoutGroup.padding.w;
    let children = this.entity.children;
    for (var i = 0; i < children.length; ++i) {
      var child = children[i];
      if (!child._enabled) {
        continue;
      }

      // Add the height of child to the new height of the content element
      height += child.element.height;
    }

    // Add the spacing
    height += Math.max(0, children.length) * layoutGroup.spacing.y;
    this.entity.element.height = height;
  },

  fitHorizontal() {
    let layoutGroup = this.entity.layoutgroup;

    let width = layoutGroup.padding.x + layoutGroup.padding.z;
    let children = this.entity.children;
    for (var i = 0; i < children.length; ++i) {
      var child = children[i];
      if (!child._enabled) {
        continue;
      }

      width += child.element.width;
    }

    width += Math.max(0, children.length - 1) * layoutGroup.spacing.x;
    this.entity.element.width = width;
  },
});
