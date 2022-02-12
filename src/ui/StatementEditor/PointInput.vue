<template>
  <GrowingInput :value="content.token.value[0].value" type="number" @change="onChangeX"/>
  <GrowingInput :value="content.token.value[1].value" type="number" @change="onChangeY"/>
</template>

<script lang="ts">
import NumberInput from "./NumberInput.vue";
import GrowingInput from "./GrowingInput.vue";
export default {
  name: "PointInput",
  components: { GrowingInput, NumberInput },
  props: ["content"],
  inject: ["controller"],

  methods: {
    onChangeX(event) {
      this.controller.updateStatement(this.content.statementIndex, this.content.index, 0, event.target.value);
    },

    onChangeY(event) {
      this.controller.updateStatement(this.content.statementIndex, this.content.index, 1, event.target.value);
    }
  }
}
</script>
