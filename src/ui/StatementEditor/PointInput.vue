<template>
  <GrowingInput :value="content.token.value[0].value" type="number"/>
  <GrowingInput :value="content.token.value[1].value" type="number"/>
</template>

<script lang="ts">
import NumberInput from "./NumberInput.vue";
import GrowingInput from "./GrowingInput.vue";
export default {
  name: "PointInput",
  components: { GrowingInput, NumberInput },
  props: ["content"]
}
</script>
