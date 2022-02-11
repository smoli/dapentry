<template>
  <input :value="content.token.value[0].value" type="number"/>
  <input :value="content.token.value[1].value" type="number"/>
</template>

<script lang="ts">
import NumberInput from "./NumberInput.vue";
export default {
  name: "PointInput",
  components: { NumberInput },
  props: ["content"]
}
</script>
