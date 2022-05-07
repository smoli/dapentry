<template>
  <FieldEditor :field="field">
    <GrowingInput :value="field.value"
                  @change="onChange"
                  @cancel="onCancel"

                  :validation-message="validationMessage"
    />
  </FieldEditor>
</template>

<script lang="ts">
import GrowingInput from "../StatementEditor/GrowingInput.vue";
import FieldEditor from "./FieldEditor.vue";
import {Parser} from "../../runtime/interpreter/Parser";

export default {
  name: "NumberEditor",
  components: { FieldEditor, GrowingInput },
  props: ["field"],
  inject: ["controller"],

  data() {
    return {
      validationMessage: null
    }
  },

  methods: {
    onCancel() {
      this.validationMessage = null;
    },


    async onChange(event) {
      const oldValue = this.field.value;
      this.validationMessage = null;

      let value = event.target.value;

      if (!isNaN(value)) {
        value = "" + Number(value);
      } else {
        try {
          Parser.parseExpression(value);
        } catch (e) {
          this.validationMessage = "Invalid Syntax"
          return;
        }
      }

      event.target.setCustomValidity("");
      const errors = await this.controller.setDataFieldValue(this.field.name, value);

      if (errors?.length) {
        await this.controller.setDataFieldValue(this.field.name, oldValue);
        this.validationMessage = errors.map(e => {
          switch (e.name) {

            case "DuplicateRegisterError":
              return `${e.registerName} already in use.`

            case "UnknownRegisterError":
              return `${e.registerName} unknown`;

            case "UnknownRegisterComponentError":
              return `${e.registerName}.${e.componentName} unknown`

            case "UnknownFunctionError":
              return `Function ${e.funcName} unknown`;

            default:
              return e.name;
          }
        }).join(". ")
      }
    }
  }
}
</script>
