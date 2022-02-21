<template>
  <span
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @drop="onDrop"
    >
  <GrowingInput :value="x" type="number" @change="onChangeX"/>
  <GrowingInput :value="y" type="number" @change="onChangeY"/>
  </span>
</template>

<script lang="ts">
import NumberInput from "./NumberInput.vue";
import GrowingInput from "./GrowingInput.vue";
import {deSerializeDNDInfo, DnDDataType, makeDnDHandlers} from "../dnd/DnDInfo";

export default {
  name: "PointInput",
  components: { GrowingInput, NumberInput },
  props: ["content"],
  inject: ["controller"],

  computed: {
      x() {
        return this.content.token.value[0].value
      },
      y() {
        return this.content.token.value[1].value
      }
  },
  methods: {
    onChangeX(event) {
      this.controller.updateStatement(this.content.statementIndex, [...this.content.subIndexes, 0], event.target.value);
    },

    onChangeY(event) {
      this.controller.updateStatement(this.content.statementIndex, [...this.content.subIndexes, 1], event.target.value);
    },


    ...makeDnDHandlers(function (event: DragEvent) {
      event.preventDefault();
      const info = deSerializeDNDInfo(event.dataTransfer.getData(DnDDataType.PointRegister));
      this.controller.updateStatement(this.content.statementIndex, this.content.subIndexes, info.value1);
    }, DnDDataType.PointRegister),
  }
}
</script>
