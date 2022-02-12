<template>
  <button class="drawable-data-field-remove">-</button>
  <GrowingInput class="drawable-data-field-name" :value="field.name" />
  <GrowingInput v-for="value of field.value" :value="value" />
  <button class="drawable-data-field-add-value">+</button>
</template>

<script lang="ts">
import GrowingInput from "../StatementEditor/GrowingInput.vue";
export default {
  name: "ListEditor",
  components: { GrowingInput },
  props: ["field"]
}
</script>
