<template>
  <samp class="drawable-tool-hint">
    <!--    span to preserve layout -->
    <span v-if="hint">
      {{ $t(hint) }}
    </span>
    <span v-else>
      HINT
    </span>
  </samp>

</template>

<script lang="ts">
import {ToolNames} from "../tools/ToolNames";

export default {
  name: "ToolHint",

  computed: {
    hint() {
      const current = this.$store.state.tool.current;
      if (current)
        return `ui.toolHint.${ToolNames[current]}`;
      return null;
    }
  }
}
</script>
