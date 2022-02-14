<template>
  <div class="drawable-modal" @click="onClickedForCancel">
    <section @click="onClickedOnDialog">
      <component :is="$store.state.ui.modalComponent" :handler="$store.state.ui.modalHandler" />
    </section>
  </div>
</template>

<script lang="ts">


export default {
  name: "Modal",
  inject: ["constructor"],

  methods: {
    onClickedForCancel() {

    },
    onClickedOnDialog(event:MouseEvent) {
      // This prevents any click done in the dialog from being processed as a click outside the dialog
      event.stopImmediatePropagation();
    }
  }
}
</script>
