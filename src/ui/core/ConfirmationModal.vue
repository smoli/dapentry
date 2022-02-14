<template>
<h1>Confirm</h1>
  <p>Are you sure</p>
  <button @click="onYes">Yes</button>
  <button @click="onNo">No</button>
</template>

<script lang="ts">
export default {
  name: "ConfirmationModal",
  props: ["handler"],

  methods: {
    onYes() {
      this.handler.yes();
    },
    onNo() {
      this.handler.no();
    }
  }
}
</script>
