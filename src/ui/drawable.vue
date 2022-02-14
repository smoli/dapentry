<template>
  <Modal v-if="$store.state.ui.modalComponent !== null"></Modal>
  <drawable-header v-if="!hideHeader"></drawable-header>
  <section class="drawable-app-main">
    <div class="drawable-left-column" v-if="!hideLeftColumn">
      <DataEditor v-if="!hideDataEditor"></DataEditor>
      <StepList v-if="!hideStepList"></StepList>
    </div>
    <div class="drawable-main-column" v-if="!hideMainColumn">
      <tool-bar v-if="!hideToolbar"></tool-bar>
      <statement-editor v-if="!hideStatementEditor"></statement-editor>
      <Drawing v-if="!hideDrawing"></Drawing>
      <samp class="drawable-tool-hint" v-if="!hideToolHint">Create Circle1 center at ( 100, 100 ) radius 50</samp>
    </div>
    <div class="drawable-right-column" v-if="!hideRightColumn">
      <PropertiesEditor></PropertiesEditor>
    </div>
  </section>
  <section class="drawable-app-footer" v-if="!hideFooter">Footer</section>
</template>

<script lang="ts">

import Drawing from "./drawing/Drawing";
import DataEditor from "./dataEditor/DataEditor";
import StepList from "./stepList/StepList";
import PropertiesEditor from "./propertiesEditor/PropertiesEditor.vue";
import DrawableHeader from "./header.vue";
import StatementEditor from "./StatementEditor/StatementEditor";
import ToolBar from "./ToolBar.vue";
import Modal from "./core/Modal.vue";


export default {
  name: "Drawable",
  components: { Modal, ToolBar, StatementEditor, DrawableHeader, PropertiesEditor, StepList, DataEditor, Drawing },
  inject: ["controller"],
  props: [
    "hideHeader",
    "hideLeftColumn",
    "hideDataEditor",
    "hideStepList",
    "hideToolbar",
    "hideMainColumn",
    "hideStatementPreview",
    "hideStatementEditor",
    "hideDrawing",
    "hideToolHint",
    "hideRightColumn",
    "hideFooter"],

  data() {
    return { message: "Welcome to drawable... the thing that does that thing with stuff and so ..." }
  },

  methods: {}
}
</script>
