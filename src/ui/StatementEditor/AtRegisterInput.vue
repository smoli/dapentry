<template>
  <span
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @drop="onDrop"
  >

  <GrowingInput :value="content.token.value[0].value" @change="onChangeObject"/>{{binder}}<GrowingInput :value="content.token.value[1].value" @change="onChangeWhere" min="0" max="1"
                @dragenter="whereOnDragEnter"
                @dragover="whereOnDragOver"
                @drop="whereOnDrop"

  />
  </span>
</template>

<script lang="ts">
import GrowingInput from "./GrowingInput.vue";
import {deSerializeDNDInfo, DnDDataType, makeDnDHandlers, prefixed} from "../dnd/DnDInfo";
import {TokenTypes} from "../../runtime/interpreter/TokenTypes";

export default {
  name: "AtRegisterInput",
  components: { GrowingInput },
  props: ["content"],
  inject: ["controller"],

  computed: {
    binder() {
      switch (this.content.token.value[1].type) {
        case TokenTypes.EXPRESSION:
        case TokenTypes.REGISTER:
        case TokenTypes.NUMBER:
          return "at";

          case TokenTypes.NAME:
            return "'s";

      }

    }
  },

  methods: {
    onChangeObject(event) {
      this.controller.updateStatement(this.content.statementIndex, [...this.content.subIndexes, 0], event.target.value);
    },

    onChangeWhere(event) {
      this.controller.updateStatement(this.content.statementIndex, [...this.content.subIndexes, 1], event.target.value);
    },

    ...makeDnDHandlers(function (event: DragEvent) {
      event.preventDefault();
      const info = deSerializeDNDInfo(event.dataTransfer.getData(DnDDataType.PointRegister));
      this.controller.updateStatement(this.content.statementIndex, this.content.subIndexes, info.value1);
    }, DnDDataType.PointRegister),

    ...prefixed("where", makeDnDHandlers(function (event: DragEvent) {
      event.preventDefault();
      const info = deSerializeDNDInfo(event.dataTransfer.getData(DnDDataType.Register));
      this.controller.updateStatement(this.content.statementIndex, [...this.content.subIndexes, 1], info.value1);
    }, DnDDataType.Register))
  }

}
</script>
