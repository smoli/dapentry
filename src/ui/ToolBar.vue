<template>
  <div class="drawable-toolbar">
    <div>
      <button v-for="tool in tools"
              :class="{ 'drawable-tool-active': $store.state.tool.current === tool.name }"
              @click="onSwitchTool(tool.name)">
        <image v-if="tool.buttonContentSVG" v-html="tool.buttonContentSVG"/>
        <span v-else>{{tool.buttonContent }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {ToolNames} from "../tools/ToolNames";
import {ASSERT} from "../core/Assertions";

export default {
  name: "ToolBar",
  inject: ["controller"],

  data() {
    const tools = [
      { buttonContent: "C", name: ToolNames.Circle, buttonContentSVG: `<svg viewbox="-10 -10 120 120" width="auto" height="auto">
  <circle cx="50" cy="50" r="50" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" />
</svg>` },
      { buttonContent: "R", name: ToolNames.Rectangle, buttonContentSVG: `<svg viewbox="-10 -10 120 120">
  <rect x="0" y="0" width="100" height="100" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" />
</svg>` },
      { buttonContent: "L", name: ToolNames.Line, buttonContentSVG: `<svg viewbox="-10 -10 120 120">
  <line x1="0" y1="100" x2="100" y2="0" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" />
</svg>` },
      { buttonContent: "P", name: ToolNames.Polygon, buttonContentSVG: ` <svg viewbox="-10 -10 120 120">
  <path d="M0 100 l0 -50 l50 -50 l50 0 l0 100Z" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" />
</svg>` },
      { buttonContent: "W", name: ToolNames.Text, buttonContentSVG: `<svg viewbox="-10 -10 120 120">
  <text x="50" y="95" style="fill:rgb(0,0,0);font-size: 140; font-family: serif; text-anchor:middle">T</text>
</svg>` },
      { buttonContent: "G", name: ToolNames.Move, buttonContentSVG: `<svg viewbox="-10 -10 120 120">
 <defs>
    <marker id="arrowheade" markerWidth="3" markerHeight="4"
    refX="0" refY="2" orient="auto">
      <polygon points="0 0, 3 2, 0 4" />
    </marker>
   <marker id="arrowheads" markerWidth="3" markerHeight="4"
    refX="3" refY="2" orient="auto">
      <polygon points="3 0, 3 4, 0 2" />
    </marker>
  </defs>
   <line x1="10" y1="50" x2="90" y2="50" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" marker-start="url(#arrowheads)" marker-end="url(#arrowheade)" />
   <line x1="50" y1="10" x2="50" y2="90" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" marker-start="url(#arrowheads)" marker-end="url(#arrowheade)" />
  </svg>` },
      { buttonContent: "T", name: ToolNames.Rotate, buttonContentSVG: ` <svg viewbox="-10 -10 120 120">
 <defs>
    <marker id="arrowheade" markerWidth="3" markerHeight="4"
    refX="0" refY="2" orient="auto">
      <polygon points="0 0, 3 2, 0 4" />
    </marker>
   </defs>
   <path d="M100 50 A 45 45 0 1 1 50 10" style="fill: none; stroke:black;stroke-width:7" marker-end="url(#arrowheade)"/>
 </svg>` },
      { buttonContent: "S", name: ToolNames.Scale, buttonContentSVG: ` <svg viewbox="-10 -10 120 120">
   <defs>
    <marker id="arrowheade" markerWidth="3" markerHeight="4"
    refX="0" refY="2" orient="auto">
      <polygon points="0 0, 3 2, 0 4" />
    </marker>
   </defs>
  <rect x="0" y="50" width="50" height="50" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" />
  <rect x="0" y="0" width="100" height="100" style="fill:none;stroke-dasharray:10 10;stroke:black;stroke-width:7" />
  <line x1="50" y1="50" x2="70" y2="30" style="stroke:black;stroke-width:7" marker-end="url(#arrowheade)"/>
</svg>` },
    ];

/*
    console.log(Object.keys(ToolNames).length / 2)
    ASSERT(tools.length === Object.keys(ToolNames).length / 2, "Not all tools have a representation in the toolbar!")
*/

    return {
      tools: tools.filter(t => this.$store.state.tool.available.indexOf(t.name) !== -1)
    }

  },

  methods: {
    onSwitchTool(toolName) {
      if (this.$store.state.tool.current === toolName) {
        this.controller.switchTool(null);
      } else {
        this.controller.switchTool(toolName);
      }
    }
  }

}
</script>
