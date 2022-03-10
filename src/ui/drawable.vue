<template>
  <Modal v-if="$store.state.ui.modalComponent.length !== 0"></Modal>
  <drawable-header v-if="!$store.state.ui.layout.hideHeader"></drawable-header>
  <section class="drawable-app-main">
    <div class="drawable-left-column" v-if="!$store.state.ui.layout.hideLeftColumn">
        <DataEditor v-if="!$store.state.ui.layout.hideDataEditor"></DataEditor>
        <StepList v-if="!$store.state.ui.layout.hideStepList"></StepList>
      </div>
    <div class="drawable-main-column" v-if="!$store.state.ui.layout.hideMainColumn">
      <tool-bar v-if="!$store.state.ui.layout.hideToolbar"></tool-bar>
      <statement-editor v-if="!$store.state.ui.layout.hideStatementEditor"></statement-editor>
      <Drawing v-if="!$store.state.ui.layout.hideDrawing"></Drawing>
      <ToolHint v-if="!$store.state.ui.layout.hideToolHint"></ToolHint>
    </div>
    <div class="drawable-right-column" v-if="!$store.state.ui.layout.hideRightColumn">
      <PropertiesEditor></PropertiesEditor>
      <LibraryList v-if="!$store.state.ui.layout.hideLibrary"></LibraryList>
    </div>
  </section>
  <section class="drawable-app-footer" v-if="!$store.state.ui.layout.hideFooter">
  </section>
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
import ToolHint from "./ToolHint.vue";
import LibraryList from "./library/LibraryList.vue";


export default {
  name: "Drawable",
  components: {
    LibraryList,
    ToolHint,
    Modal,
    ToolBar,
    StatementEditor,
    DrawableHeader,
    PropertiesEditor,
    StepList,
    DataEditor,
    Drawing
  },
  inject: ["controller"],
  props: [],

  data() {
    return { message: "Welcome to drawable... the thing that does that thing with stuff and so ..." }
  },

  methods: {
    onToggleLibrary() {
      this.controller.toggleLibrary();
    }
  }
}
</script>
