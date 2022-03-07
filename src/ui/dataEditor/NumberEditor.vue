<template>
  <FieldEditor :field="field">
    <GrowingInput :value="field.value" @change="onChange"/>
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

  methods: {
    onChange(event) {
      try {
        Parser.parseExpression(event.target.value);
      } catch (e) {
        event.target.setCustomValidity("Invalid")
        event.target.focus;
        return;
      }
      event.target.setCustomValidity("");
      this.controller.setDataFieldValue(this.field.name, event.target.value);
    }
  }
}
</script>
