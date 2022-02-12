<template>
  <GrowingInput :value="content.token.value" @change="onChange" />
<!--  <input :value="content.token.value" />-->
</template>

<script lang="ts">
import GrowingInput from "./GrowingInput.vue";
export default {
  name: "SimpleInput",
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
