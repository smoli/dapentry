<template>
  <GrowingInput :value="expressionString"
                @change="onChange"
                @dragenter="onDragEnter"
                @dragover="onDragOver"
                @drop="onDrop"/>
</template>

<script lang="ts">
import GrowingInput from "./GrowingInput.vue";
import {Parser} from "../../runtime/interpreter/Parser";
import {deSerializeDNDInfo, DnDDataType, makeDnDHandlers} from "../dnd/DnDInfo";
export default {
  name: "ExpressionInput",
  components: { GrowingInput },
  props: ["content"],
  inject: ["controller"],

  computed: {
      expressionString() {
        return Parser.constructCodeLine([this.content.token]);
      }
  },

  methods: {
    onChange(event) {
      try {
        Parser.parseExpression(event.target.value);
      } catch (e) {
        return
      }

      this.controller.updateStatement(this.content.statementIndex, this.content.subIndexes, event.target.value);
    },

    ...makeDnDHandlers(function (event: DragEvent) {
      event.preventDefault();
      const info = deSerializeDNDInfo(event.dataTransfer.getData(DnDDataType.Register));
      this.controller.updateStatement(this.content.statementIndex, this.content.subIndexes, info.value1);
    }, DnDDataType.Register),

  }
}
</script>
