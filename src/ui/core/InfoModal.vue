<template>
  <p>Welcome from the modal world in a seperate component</p>
  <button @click="onClose">Close</button>
</template>

<script lang="ts">
export default {
  name: "InfoModal",
  props: ["handler"],

  methods: {
    onClose() {
      this.handler.close();
    }
  }
}
</script>
