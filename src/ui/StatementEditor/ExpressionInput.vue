<template>
  <GrowingInput :value="expressionString"
                :validation-message="validationMessage"
                @change="onChange"
                @cancel="onCancel"
                @dragenter="onDragEnter"
                @dragover="onDragOver"
                @drop="onDrop"/>
</template>

<script lang="ts">
import GrowingInput from "./GrowingInput.vue";
import {Parser} from "../../runtime/interpreter/Parser";
import {deSerializeDNDInfo, DnDDataType, makeDnDHandlers} from "../dnd/DnDInfo";
import {UnknownRegisterError} from "../../runtime/interpreter/errors/UnknownRegisterError";

export default {
  name: "ExpressionInput",
  components: { GrowingInput },
  props: ["content"],
  inject: ["controller"],

  data() {
    return {
      validationMessage: null
    }
  },


  computed: {
    expressionString() {
      console.log(this.content.token);
      return Parser.constructCodeLine([this.content.token]).trim();
    }
  },

  methods: {
    onCancel() {
      this.validationMessage = null;
    },

    async onChange(event) {
      try {
        Parser.parseExpression(event.target.value);
      } catch (e) {
        this.validationMessage = "Invalid Syntax"
        return
      }
      this.validationMessage = null;

      const errors = await this.controller.updateStatement(this.content.statementIndex, this.content.subIndexes, event.target.value);

      if (errors.length) {
        this.validationMessage = errors.map(e => {
          switch (e.name) {

            case "DuplicateRegisterError":
              return `${e.registerName} already in use.`

            case "UnknownRegisterError":
              return `Register ${e.registerName} unknown`;

              case "UnknownRegisterComponentError":
                return `Register ${e.registerName}.${e.componentName} unknown`

            case "UnknownFunctionError":
              return `Function ${e.funcName} unknown`;
          }
        }).join(". ")
      }
    },

    ...makeDnDHandlers(function (event: DragEvent) {
      event.preventDefault();
      const info = deSerializeDNDInfo(event.dataTransfer.getData(DnDDataType.Register));
      this.controller.updateStatement(this.content.statementIndex, this.content.subIndexes, info.value1);
    }, DnDDataType.Register),

  }
}
</script>
