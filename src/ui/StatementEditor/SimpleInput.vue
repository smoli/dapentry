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

  methods: {
    onChange(event) {
      alert("Change" + event.target.value)
    }
  }
}
</script>
