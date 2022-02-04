<template>
  <svg v-bind:id="id" v-bind:viewBox="viewBox">
    <circle r="100" />
  </svg>
</template>

<script>
import {AppConfig} from "../AppConfig";

export default {
  name: "Drawing",

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
    viewBox() {
      return `${this.viewBoxParameters.x} ${this.viewBoxParameters.y} ${this.viewBoxParameters.width} ${this.viewBoxParameters.height}`;
    }
  }
}
</script>
