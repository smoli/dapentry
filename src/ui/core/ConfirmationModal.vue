<template>
  <div class="drawable-modal-confirm">
    <h1>Confirm</h1>
    <p>{{ text }}</p>
    <div class="drawable-modal-footer">
      <button @click="onYes">{{ yesText }}</button>
      <button @click="onNo">{{ noText }}</button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ConfirmationModal",
  props: ["handler"],

  computed: {
    text() {
      return this.handler.text;
    },

    yesText() {
      return this.handler.yesButtonText;
    },

    noText() {
      return this.handler.noButtonText;
    }
  },

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
