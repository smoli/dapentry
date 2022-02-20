<template>
  <GrowingInput :value="content.token.value[0].value" @change="onChangeObject"/>
  <GrowingInput :value="content.token.value[1].value" @change="onChangeWhere"/>
</template>

<script lang="ts">
import GrowingInput from "./GrowingInput.vue";

export default {
  name: "AtRegisterInput",
  components: { GrowingInput },
  props: ["content"],
  inject: ["controller"],

  methods: {
    onChangeObject(event) {
      this.controller.updateStatement(this.content.statementIndex, [...this.content.subIndexes, 0], event.target.value);
    },

    onChangeWhere(event) {
      this.controller.updateStatement(this.content.statementIndex, [...this.content.subIndexes, 1], event.target.value);
    }
  }

}
</script>
