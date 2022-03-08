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
import {Icons} from "./css/icons/icons";

export default {
  name: "ToolBar",
  inject: ["controller"],

  data() {
    const tools = [
      { buttonContent: "C", name: ToolNames.Circle, buttonContentSVG: Icons.CircleTool },
      { buttonContent: "R", name: ToolNames.Rectangle, buttonContentSVG: Icons.RectangleTool },
      { buttonContent: "L", name: ToolNames.Line, buttonContentSVG: Icons.LineTool },
      { buttonContent: "P", name: ToolNames.Polygon, buttonContentSVG: Icons.PolygonTool },
      { buttonContent: "W", name: ToolNames.Text, buttonContentSVG: Icons.TextTool },
      { buttonContent: "G", name: ToolNames.Move, buttonContentSVG: Icons.MoveTool },
      { buttonContent: "T", name: ToolNames.Rotate, buttonContentSVG: Icons.RotateTool },
      { buttonContent: "S", name: ToolNames.Scale, buttonContentSVG: Icons.ScaleTool },
    ];

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
