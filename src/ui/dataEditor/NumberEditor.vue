<template>
  <button>-</button>
  <GrowingInput class="drawable-data-field-name" :value="field.name" />
  <GrowingInput :value="field.value" @change="onChange"/>
  <button class="drawable-data-field-add-value">+</button>
</template>

<script lang="ts">
import GrowingInput from "../StatementEditor/GrowingInput.vue";
export default {
  name: "NumberEditor",
  components: { GrowingInput },
  props: ["field"],
  inject: ["controller"],

  methods: {
    onChange(event) {
      this.controller.setDataFieldValue(this.field.name, Number(event.target.value));
    }
  }
}
</script>
