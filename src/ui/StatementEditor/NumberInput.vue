<template>
  <GrowingInput :value="content.token.value" type="number" @change="onChange"/>
</template>

<script lang="ts">
import GrowingInput from "./GrowingInput.vue";
export default {
  name: "NumberInput",
  components: { GrowingInput },
  props: ["content"],
  inject: ["controller"],

  methods: {
    onChange(event) {
      this.controller.updateStatement(this.content.statementIndex, this.content.index, -1, event.target.value);
    }
  }

}
</script>
