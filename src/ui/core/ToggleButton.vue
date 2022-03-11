<template>
  <button class="drawable-ui-toggle-button"
          :class="{
            'drawable-ui-toggle-button-active': active,
            'drawable-ui-transparent': transparent
          }"
          @click="onClick" >
    <slot></slot>
  </button>
</template>

<script lang="ts">
export default {
  name: "ToggleButton",
  props: ["active", "transparent"],
  emits: ["change"],

  methods: {
    onClick(event) {
      event.stopPropagation();
      this.$emit("change")
    }
  }
}
</script>
