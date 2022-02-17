<template>
  <FieldEditor :field="field">
    <GrowingInput v-for="(value, index) of field.value" :value="value" @change="onValueChanged(index, $event)"/>
  </FieldEditor>
</template>

<script lang="ts">
import GrowingInput from "../StatementEditor/GrowingInput.vue";
import FieldEditor from "./FieldEditor.vue";
export default {
  name: "ListEditor",
  components: { FieldEditor, GrowingInput },
  props: ["field"],
  inject: ["controller"],

  methods: {
    onValueChanged(index, event) {
      this.controller.setDataListFieldValue(this.field.name, index, event.target.value);
    }
  }
}
</script>
