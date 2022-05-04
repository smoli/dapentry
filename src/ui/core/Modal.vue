<template>
  <div v-for="m of $store.state.ui.modalComponent" class="drawable-modal" @click="onClickedForCancel">
    <section class="drawable-modal-content" @click="onClickedOnDialog">
      <component :is="m.component" :handler="m.handler" />
    </section>
  </div>
</template>

<script lang="ts">


import LoginDialog from "../Login/LoginDialog";
export default {
  name: "Modal",
  components: { LoginDialog },

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
