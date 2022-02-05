<template>
  <section id="drawable-drawing-container">
    <div id="drawable-drawing-wrapper">

      <svg v-bind:id="id" v-bind:viewBox="viewBox"
           @mousemove="onMouseMove"
           @mousedown.left="onMouseDownLeft"
           @mouseup.left="onMouseUpLeft"
           @click.right="onMouseClickRight"
           @click.left="onMouseClickLeft"
      >
      </svg>
    </div>
    <ul>
      <li v-for="o of selection">{{ o.uniqueName }}</li>
    </ul>
  </section>
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
    drawingController = new DrawingController(this.controller, this.renderer);
    drawingController.setView(this.viewBoxParameters.width, this.viewBoxParameters.height, this.viewBoxParameters.bezelSize)
  },

  data() {
    return {
      id: AppConfig.SVG.rendererId,
      viewBoxParameters: {
        bezelSize: AppConfig.SVG.canvasBezelSize,
        x: 0,
        y: 0,
        width: 1600,
        height: 1000
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
      return `${this.viewBoxParameters.x - this.viewBoxParameters.bezelSize} ${this.viewBoxParameters.y - this.viewBoxParameters.bezelSize} ${this.viewBoxParameters.width + 2 * this.viewBoxParameters.bezelSize} ${this.viewBoxParameters.height + 2 * this.viewBoxParameters.bezelSize}`;
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
