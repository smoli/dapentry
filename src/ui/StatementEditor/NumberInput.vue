<template>
  <GrowingInput :value="content.token.value" type="number"/>
</template>

<script lang="ts">
import GrowingInput from "./GrowingInput.vue";
export default {
  name: "NumberInput",
  components: { GrowingInput },
  props: ["content"]

}
</script>
