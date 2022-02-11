<template>
  <input :value="content.token.value" type="number"/>
</template>

<script lang="ts">
export default {
  name: "NumberInput",
  props: ["content"]

}
</script>
