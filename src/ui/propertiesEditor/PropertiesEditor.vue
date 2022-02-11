<template>
  <section class="drawable-properties-container">
    <div v-if="selectionCount === 1">
      <div class="drawable-properties-style">
        <h2>Style</h2>
        <div>
          <input type="color" v-model="fillColor"
                 @change="onFillColorChange">
          <label>{{ $t("ui.styleEditor.fillColor") }} {{ fillColor }}</label>
        </div>

        <div>
          <input type="range" v-model="fillOpacity"
                 min="0" max="1" step="0.01"
                 @change="onOpacityChange">
          <label>{{ $t("ui.styleEditor.fillOpacity") }} {{ fillOpacity }}</label>
        </div>

        <div>
          <input v-model="strokeColor" type="color"
                 @change="onStrokeColorChange">
          <label>{{ $t("ui.styleEditor.stroke") }} {{ strokeColor }}</label>
        </div>

        <div>
          <input v-model="strokeWidth" type="range"
                 min="0" max="100"
                 @change="onStrokeWidthChange">
          <label>{{ $t("ui.styleEditor.strokeWidth") }} {{ strokeWidth }}</label>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">

import {GrObject} from "../../geometry/GrObject";

function makeComputedProxy(access, defaultValue) {
  return {
    get() {
      return this.live[access] !== null ? this.live[access] : this.selection && this.selection.length ? this.selection[0].style[access] : defaultValue;
    },
    set(value) {
      this.live[access] = value;
    }
  }
}

export default {
  name: "PropertiesEditor",
  inject: ["controller"],

  data() {
    return {
      live: {
        fillOpacity: null,
        fillColor: null,
        strokeColor: null,
        strokeWidth: null
      }
    }
  },

  methods: {
    onFillColorChange(event) {
      this.controller.setFillColorForSelection(event.target.value);
    },

    onOpacityChange(event) {
      this.controller.setFillOpacityForSelection(event.target.value);
    },

    onStrokeColorChange(event) {
      this.controller.setStrokeColorForSelection(event.target.value);
    },

    onStrokeWidthChange(event) {
      this.controller.setStrokeWidthForSelection(event.target.value);
    }
  },
  computed: {
    fillOpacity: makeComputedProxy("fillOpacity", 1),
    fillColor: makeComputedProxy("fillColor", "#000000"),
    strokeColor: makeComputedProxy("strokeColor", "#000000"),
    strokeWidth: makeComputedProxy("strokeWidth", 1),
    selection() {
      return this.$store.state.drawing.selection;
    },
    selectionCount() {
      return this.$store.state.drawing.selection ? this.$store.state.drawing.selection.length : 0;
    },
  },
  watch: {
    selection(newSel: Array<GrObject>) {
      if (newSel && newSel.length) {
        this.live.fillOpacity = newSel[0].style.fillOpacity;
        this.live.fillColor = newSel[0].style.fillColor;
        this.live.strokeColor = newSel[0].style.strokeColor;
        this.live.strokeWidth = newSel[0].style.strokeWidth;
      }
    }
  },

}
</script>

<style scoped>

</style>