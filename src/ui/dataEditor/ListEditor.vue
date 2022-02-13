<template>
  <FieldEditor :field="field">
    <GrowingInput v-for="value of field.value" :value="value" />
  </FieldEditor>
</template>

<script lang="ts">
import GrowingInput from "../StatementEditor/GrowingInput.vue";
import FieldEditor from "./FieldEditor.vue";
export default {
  name: "ListEditor",
  components: { FieldEditor, GrowingInput },
  props: ["field"]
}
</script>
