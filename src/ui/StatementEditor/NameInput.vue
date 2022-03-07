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
  name: "NameInput",
  components: { GrowingInput },
  props: ["content"],
  inject: ["controller"],

  methods: {
    onChange(event) {
      // this.controller.updateStatement(this.content.statementIndex, this.content.subIndexes, event.target.value);
    }
  }
}
</script>
