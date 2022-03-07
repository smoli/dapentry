<template>
  <span
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @drop="onDrop"
    >
    <ExpressionInput :content="x"/>
    <ExpressionInput :content="y"/>
  </span>
</template>

<script lang="ts">
import NumberInput from "./NumberInput.vue";
import {deSerializeDNDInfo, DnDDataType, makeDnDHandlers} from "../dnd/DnDInfo";
import ExpressionInput from "./ExpressionInput.vue";

export default {
  name: "PointInput",
  components: { ExpressionInput, NumberInput },
  props: ["content"],
  inject: ["controller"],

  computed: {
      x() {
        return {
          token: this.content.token.value[0],
          statementIndex: this.content.statementIndex,
          subIndexes: [...this.content.subIndexes, 0]
        }
      },
      y() {
        return {
          token: this.content.token.value[1],
          statementIndex: this.content.statementIndex,
          subIndexes: [...this.content.subIndexes, 1]
        }
      }
  },
  methods: {

    ...makeDnDHandlers(function (event: DragEvent) {
      event.preventDefault();
      const info = deSerializeDNDInfo(event.dataTransfer.getData(DnDDataType.PointRegister));
      this.controller.updateStatement(this.content.statementIndex, this.content.subIndexes, info.value1);
    }, DnDDataType.PointRegister),
  }
}
</script>
