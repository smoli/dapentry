<template>
  <section class="drawable-properties-container">
    <div v-if="selectionCount === 1">
      <div class="drawable-properties-style">
        <h2>Style
          <span>of {{objectName }}</span>
        </h2>
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

        <div>

          <h2>Properties
          <span>of {{objectName }}</span>
          </h2>
          <div v-for="prop of publishedProperties">
            <span draggable="true"
                  @dragstart="onDragPropStart(prop.id, $event)"
                  class="drawable-properties-prop-name">{{ prop.name }}</span> = {{ prop.value.toFixed(2) }}
          </div>

          <div v-for="poi of publishedPoints">
            <span draggable="true"
                  class="drawable-properties-prop-name"
                  @dragstart="onDragPointStart(poi, $event)">{{ poi.name }}</span> = {{ poi.value.x.toFixed(2) }},
            {{ poi.value.y.toFixed(2) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">

import {GrObject, POI, POIPurpose} from "../../geometry/GrObject";
import {DnDDataType, DnDInfo, serializeDNDInfo} from "../dnd/DnDInfo";
import {Point2D} from "../../geometry/Point2D";

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

    objectName() {
      if (this.$store.state.drawing.selection.length === 0) {
        return [];
      }
      const obj: GrObject = this.$store.state.drawing.selection[0];
      return obj.uniqueName;
    },

    publishedProperties() {
      if (this.$store.state.drawing.selection.length === 0) {
        return [];
      }
      const obj: GrObject = this.$store.state.drawing.selection[0];
      return obj.publishedProperties;
    },

    publishedPoints() {
      if (this.$store.state.drawing.selection.length === 0) {
        return [];
      }
      const obj: GrObject = this.$store.state.drawing.selection[0];
      const poi = obj.pointsOfInterest(POIPurpose.MANIPULATION);

      return Object.keys(poi)
          .map(name => {
            return { name: POI[name], value: poi[name] }
          })

    }

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
    },

    onDragPropStart(propId: string, event:DragEvent) {
      const info: DnDInfo = {
        value1: this.objectName + "@" + propId,
        type: DnDDataType.Register
      }

      event.dataTransfer.setData(DnDDataType.Register, serializeDNDInfo(info));
    },

    onDragPointStart(poi: { name: string, value: Point2D }, event) {
      const info: DnDInfo = {
        value1: this.objectName + "@" + poi.name,
        type: DnDDataType.PointRegister
      }

      event.dataTransfer.setData(DnDDataType.PointRegister, serializeDNDInfo(info));
    }
  }

}
</script>

<style scoped>

</style>