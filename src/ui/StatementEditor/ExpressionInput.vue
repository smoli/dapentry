<template>
  <GrowingInput :value="expressionString" @change="onChange" />
</template>

<script lang="ts">
import GrowingInput from "./GrowingInput.vue";
import {Parser} from "../../runtime/interpreter/Parser";
export default {
  name: "ExpressionInput",
  components: { GrowingInput },
  props: ["content"],
  inject: ["controller"],

  computed: {
      expressionString() {
        return Parser.constructCodeLine([this.content.token]);
      }
  },

  methods: {
    onChange(event) {
      this.controller.updateStatement(this.content.statementIndex, this.content.index, -1, event.target.value);
    }
  }
}
</script>
