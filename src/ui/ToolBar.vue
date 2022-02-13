<template>
  <div class="drawable-toolbar">
    <div>
      <button v-for="tool in tools"
              :class="{ 'drawable-tool-active': $store.state.tool.current === tool.name }"
              @click="onSwitchTool(tool.name)"
      >
        {{ tool.buttonContent }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {ToolNames} from "../tools/ToolNames";

export default {
  name: "ToolBar",
  inject: ["controller"],

  data() {
    return {
      tools: [
        { buttonContent: "C", name: ToolNames.Circle },
        { buttonContent: "R", name: ToolNames.Rectangle },
        { buttonContent: "L", name: ToolNames.Line },
        { buttonContent: "P", name: ToolNames.Polygon },
        { buttonContent: "G", name: ToolNames.Move },
        { buttonContent: "T", name: ToolNames.Rotate },
        { buttonContent: "S", name: ToolNames.Scale },
      ].filter(t => this.$store.state.tool.available.indexOf(t.name) !== -1)
    }

  },

  methods: {
    onSwitchTool(toolName) {
        this.controller.switchTool(toolName);
    }
  }

}
</script>
