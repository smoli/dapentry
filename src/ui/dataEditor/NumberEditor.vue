<template>
  <FieldEditor :field="field">
    <GrowingInput :value="field.value" @change="onChange"/>
  </FieldEditor>
</template>

<script lang="ts">
import GrowingInput from "../StatementEditor/GrowingInput.vue";
import FieldEditor from "./FieldEditor.vue";
export default {
  name: "NumberEditor",
  components: { FieldEditor, GrowingInput },
  props: ["field"],
  inject: ["controller"],

  methods: {
    onChange(event) {
      this.controller.setDataFieldValue(this.field.name, event.target.value);
    }
  }
}
</script>
