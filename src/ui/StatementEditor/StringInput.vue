<template>
  <GrowingInput :value="content.token.value" @change="onChange"
                @drop="onDrop"
                @dragover="onDragOver"
                @dragenter="onDragEnter"
  />
</template>

<script lang="ts">
import GrowingInput from "./GrowingInput.vue";
import {deSerializeDNDInfo, DnDDataType, makeDnDHandlers} from "../dnd/DnDInfo";

export default {
  name: "SimpleInput",
  components: { GrowingInput },
  props: ["content"],
  inject: ["controller"],

  methods: {
    onChange(event) {
      this.controller.updateStatement(this.content.statementIndex, this.content.subIndexes, `"${event.target.value}"`);
    },

    ...makeDnDHandlers(function (event: DragEvent) {
      event.preventDefault();
      const info = deSerializeDNDInfo(event.dataTransfer.getData(DnDDataType.Register));
      this.controller.updateStatement(this.content.statementIndex, this.content.subIndexes, info.value1);
    }, DnDDataType.Register),

  }
}
</script>
