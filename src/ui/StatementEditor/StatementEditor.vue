<template>
  <!--  <samp class="drawable-statement-preview">{{ selectedLine }}</samp>-->
  <div class="drawable-statement-editor">
    <component v-for="segment of segments" :is="segment.type" :content="segment"></component>
  </div>
</template>

<script lang="ts">
import Static from "./Static.vue";
import {Parser} from "../../runtime/interpreter/Parser";
import {getTextIdForTokens} from "../core/GetTextIdForTokens";
import SimpleInput from "./SimpleInput.vue";
import StringInput from "./StringInput.vue";
import NumberInput from "./NumberInput.vue";
import PointInput from "./PointInput.vue";
import ExpressionInput from "./ExpressionInput.vue";
import AtRegisterInput from "./AtRegisterInput.vue";
import ArrayInput from "./ArrayInput.vue";
import {createSegments, createSegmentsForMakeOp} from "./createSegments";
import {getLibraryEntryNameFromMakeStatement, isMakeStatement} from "../../core/statements";


export default {
  name: "StatementEditor",
  inject: ["controller"],

  components: { AtRegisterInput, PointInput, ArrayInput, NumberInput, SimpleInput, StringInput, ExpressionInput, Static },
  computed: {
    segments: function () {
      const selection: Array<number> = this.$store.state.code.selectedLines;

      if (selection.length !== 1) {
        return { text: "NO" };
      }

      const code = this.$store.state.code.code;
      const codeLine = code[selection[0]];

      const tokens = Parser.parseLine(codeLine);
      const textID = getTextIdForTokens(tokens);

      if (isMakeStatement(tokens)) {
        const entryName = getLibraryEntryNameFromMakeStatement(tokens);
        const entry = this.controller.state.getLibraryEntry(entryName);
        return createSegmentsForMakeOp(tokens, entry, this.$i18n.tm("statements." + textID), selection[0])
      } else {
        return createSegments(tokens, this.$i18n.tm("statements." + textID), selection[0]);
      }

    }
  }
}
</script>
