<template>
  <section class="drawable-drawing-container">
    <svg v-bind:id="id" v-bind:viewBox="viewBox"
        :style="{
          cursor: mouseCursor
        }"

    ></svg>
  </section>
</template>

<script lang="ts">
import {AppConfig} from "../../core/AppConfig";
import {DrawingController} from "./DrawingController";
import {SvgObjectRenderer} from "./SvgObjectRenderer";
import {ToolNames} from "../../tools/ToolNames";


let drawingID = 1;

function updateSizing(svg, vbWidth, vbHeight) {
  const container = svg.parentElement;
  svg.setAttribute("height", "0")
  svg.setAttribute("width", "0")

  const h = container.clientHeight;
  const w = container.clientWidth;
  const containerAr = w / h;
  const vbAr = vbWidth / vbHeight; // Always >= 1

  if (vbAr < containerAr) {
    // Limited by height
    svg.removeAttribute("width")
    svg.setAttribute("height", h + "px")
  } else {
    // Limited by width
    svg.removeAttribute("height")
    svg.setAttribute("width", w + "px")
  }
}


export default {
  name: "Drawing",
  inject: ["controller"],

  data() {

    const rendererId = "r" + drawingID++;

    return {
      id: rendererId,
      viewBoxParameters: {
        bezelSize: AppConfig.SVG.canvasBezelSize
      },
      drawingController: null
    }
  },

  mounted() {
    const renderer = new SvgObjectRenderer(this.controller.handleObjectSelection.bind(this.controller), this.controller.poiAvailable);
    renderer.init(this.id)
    this.drawingController = new DrawingController(this.controller, renderer);

    const dims = this.$store.state.drawing.dimensions
    const svg = document.getElementById(this.id);
    const parent = svg.parentElement;

    updateSizing(svg, dims.width, dims.height);

    if (ResizeObserver) {
      const obs = new ResizeObserver(() => {
        const dims = this.$store.state.drawing.dimensions
        updateSizing(svg, dims.width, dims.height);
      });

      obs.observe(parent);
    }

    this.drawingController.setView(dims.width, dims.height, this.viewBoxParameters.bezelSize);
  },

  computed: {
    currentTool() {
      return this.$store.state.tool.current;
    },

    mouseCursor() {
      return AppConfig.UI.cursorForTool[this.$store.state.tool.current];

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
    },

    dimensions() {
      return this.$store.state.drawing.dimensions;
    }

  },

  watch: {
    dimensions(dims) {
      updateSizing(document.getElementById(this.id), dims.width, dims.height);
      this.drawingController.setView(dims.width, dims.height, this.viewBoxParameters.bezelSize);
    },

    currentTool(newTool, oldTool) {
      const params = this.$store.state.tool.currentParams;
      if (params) {
        this.drawingController.switchTool(newTool, ...params);
      } else {
        this.drawingController.switchTool(newTool);
      }
    },

    objects(newObjectList) {
      this.drawingController.render(newObjectList);
      this.controller.state.setDrawingPreview(this.drawingController.getSVGPreview());
    },

    selection(newSelection, oldSelection) {
      this.drawingController.updateSelection(oldSelection, newSelection);
    },

    referenceObject(newObject) {
      this.drawingController.referenceObject = newObject;
    },

    keyPress(event) {
      if (!event) {
        console.warn("Unsolicited key handler invocation.")
        return;
      }

      if (event.key === "Shift"
          || event.key === "Alt"
          || event.key === "Control"
          || event.key === "Meta"
      ) {
        // We do not pass these key presses on. These can be used as modifiers on mouse events
        // If we pass these on, they are pumped to the tool unnecessarily
        return;
      }

      this.drawingController.passKeyPressToTool(event)
    }
  },

  methods: {}
}
</script>
