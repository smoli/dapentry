<template>
  <div class="drawable-toolbar">
    <div>
      <button v-for="extra in extra" :title="extra.tooltip"
          @click="onExecuteExtra(extra.name)"
      >
        <image v-if="extra.buttonContentSVG" v-html="extra.buttonContentSVG" />
      </button>

      <span class="drawable-toolbar-separator"></span>

      <button v-for="tool in tools" :title="tool.tooltip"
              :class="{ 'drawable-tool-active': $store.state.tool.current === tool.name }"
              @click="onSwitchTool(tool.name)">
        <image v-if="tool.buttonContentSVG" v-html="tool.buttonContentSVG" />
        <span v-else>{{tool.buttonContent }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {ToolNames} from "../tools/ToolNames";
import {Icons} from "./css/icons/icons";

export default {
  name: "ToolBar",
  inject: ["controller"],

  data() {
    const extra = [
      { buttonContent: "Ctrl-Z", name: 'UNDO', buttonContentSVG: Icons.Undo, tooltip: "Undo" }
    ];

    const tools = [
      { buttonContent: "C", name: ToolNames.Circle, buttonContentSVG: Icons.CircleTool, tooltip: "Draw a circle" },
      { buttonContent: "R", name: ToolNames.Rectangle, buttonContentSVG: Icons.RectangleTool, tooltip: "Draw a rectangle" },
      { buttonContent: "L", name: ToolNames.Line, buttonContentSVG: Icons.LineTool, tooltip: "Draw a line" },
      { buttonContent: "P", name: ToolNames.Polygon, buttonContentSVG: Icons.PolygonTool, tooltip: "Draw a polygon" },
      { buttonContent: "W", name: ToolNames.Text, buttonContentSVG: Icons.TextTool, tooltip: "Draw text" },
      { buttonContent: "G", name: ToolNames.Move, buttonContentSVG: Icons.MoveTool, tooltip: "Move" },
      { buttonContent: "T", name: ToolNames.Rotate, buttonContentSVG: Icons.RotateTool, tooltip: "Rotate" },
      { buttonContent: "S", name: ToolNames.Scale, buttonContentSVG: Icons.ScaleTool, tooltip: "Scale" },
    ];

    return {
      extra: extra,
      tools: tools.filter(t => this.$store.state.tool.available.indexOf(t.name) !== -1)
    }

  },

  methods: {
    onExecuteExtra(extraName) {
        switch (extraName) {
          case 'UNDO': this.controller.undo();
        }
    },

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
