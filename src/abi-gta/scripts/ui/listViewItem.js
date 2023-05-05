import { Script } from "../../../template/systems/script/script";

export const ListViewItemEvent = Object.freeze({
  Select   : "listViewItem:select",
  Deselect : "listViewItem:deselect",
});

export const ListViewItem = Script.createScript({
  name: "listViewItem",

  attributes: {
    buttonComponent    : { default: null },
    selectedElements   : { default: [] },
    unselectedElements : { default: [] },
  },

  initialize() {
    this.buttonComponent.on("click", this.select, this);
  },

  select() {
    this.unselectedElements.forEach((element) => {
      element.enabled = false;
    });

    this.selectedElements.forEach((element) => {
      element.enabled = true;
    });

    this.buttonComponent.selected = true;
    this.fire(ListViewItemEvent.Select, this);
  },

  deselect() {
    this.selectedElements.forEach((element) => {
      element.enabled = false;
    });

    this.unselectedElements.forEach((element) => {
      element.enabled = true;
    });

    this.buttonComponent.selected = false;
    this.fire(ListViewItemEvent.Deselect, this);
  },
});
