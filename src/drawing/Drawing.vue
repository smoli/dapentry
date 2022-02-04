<template>
  <span>{{ currentToolName }}</span>
  <svg v-bind:id="id" v-bind:viewBox="viewBox"
       @mousemove="onMouseMove"
       @mousedown.left="onMouseDownLeft"
       @mouseup.left="onMouseUpLeft"
       @click.right="onMouseClickRight"
       @click.left="onMouseClickLeft"

       width="400px"
       style="border: 1px solid lightgreen"
  >
  </svg>
</template>

<script>
import {AppConfig} from "../AppConfig";
import {DrawingController} from "./DrawingController";
import {ToolNames} from "../tools/ToolNames";

let drawingController = null;

export default {
  name: "Drawing",
  inject: ["controller", "renderer"],

  mounted() {
    drawingController = new DrawingController(this.$store, this.controller, this.renderer);
  },

  data() {
    return {
      id: AppConfig.SVG.rendererId,
      viewBoxParameters: {
        bezelSize: AppConfig.SVG.canvasBezelSize,
        x: 0,
        y: 0,
        width: 400,
        height: 400
      }
    }
  },
  computed: {
    currentTool() {
        return this.$store.state.tool.current;
    },
    currentToolName() {
        return ToolNames[this.$store.state.tool.current];
    },
    viewBox() {
      return `${this.viewBoxParameters.x} ${this.viewBoxParameters.y} ${this.viewBoxParameters.width} ${this.viewBoxParameters.height}`;
    }
  },

  watch: {
    currentTool(newTool) {
      drawingController.switchTool(newTool);
    }
  },

  methods: {
    onMouseMove(event) {
      drawingController.onMouseMove(event);
    },

    onMouseDownLeft(event) {
      drawingController.onMouseDown(event);
    },

    onMouseUpLeft(event) {
      drawingController.onMouseUp(event);
    },

    onMouseClickRight(event) {
      drawingController.onRightClick(event);
    },

    onMouseClickLeft(event) {
      drawingController.onClick(event);
    }
  }
}
</script>
