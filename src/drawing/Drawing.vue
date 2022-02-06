<template>
  <section id="drawable-drawing-container">
    <div id="drawable-drawing-wrapper">

      <svg v-bind:id="id" v-bind:viewBox="viewBox">
      </svg>
    </div>
    <ul>
      <li v-for="o of selection">{{ o.uniqueName }}</li>
    </ul>
  </section>
</template>

<script lang="ts">
import {AppConfig} from "../AppConfig";
import {DrawingController} from "./DrawingController";
import {SvgObjectRenderer} from "./SvgObjectRenderer";
import {ToolNames} from "../tools/ToolNames";

let drawingController:DrawingController = null;

export default {
  name: "Drawing",
  inject: ["controller"],

  data() {
    return {
      id: AppConfig.SVG.rendererId,
      viewBoxParameters: {
        bezelSize: AppConfig.SVG.canvasBezelSize
      }
    }
  },

  mounted() {
    const renderer = new SvgObjectRenderer(this.controller.handleObjectSelection.bind(this.controller));
    renderer.init(AppConfig.SVG.rendererId)
    drawingController = new DrawingController(this.controller, renderer);
  },

  computed: {
    currentTool() {
      return this.$store.state.tool.current;
    },
    currentToolName() {
      return ToolNames[this.$store.state.tool.current];
    },
    viewBox() {
      const dims = this.$store.state.drawing.dimensions
      const bezel = this.viewBoxParameters.bezelSize;
      return `${dims.x - bezel} ${dims.y - bezel} ${dims.width + 2 * bezel} ${dims.height + 2 * bezel}`;
    },
    objects() {
      return this.$store.state.drawing.objects;
    },
    selection() {
      return this.$store.state.drawing.selection;
    },

    referenceObject() {
      return this.$store.state.tool.referenceObject;
    },

    keyPress() {
      return this.$store.state.tool.keyPress;
    }

  },

  watch: {
    currentTool(newTool, oldTool) {
      if (newTool === oldTool) {
        console.log("WARNING: Same-tool-switch ", newTool)
      }
      drawingController.switchTool(newTool);
    },

    objects(newObjectList) {
      drawingController.render(newObjectList);
    },

    selection(newSelection, oldSelection) {
      drawingController.updateSelection(oldSelection, newSelection);
    },

    referenceObject(newObject) {
      drawingController.referenceObject = newObject;
    },

    keyPress(event) {
      drawingController.passKeyPressToTool(event)
    }
  },

  methods: {}
}
</script>
