<template>
  <Modal v-if="$store.state.ui.modalComponent.length !== 0"></Modal>
  <drawable-header v-if="!$store.state.ui.layout.hideHeader"></drawable-header>
  <section class="drawable-app-main">
    <div class="drawable-left-column" ref="left" v-if="!$store.state.ui.layout.hideLeftColumn">
      <DataEditor v-if="!$store.state.ui.layout.hideDataEditor"></DataEditor>
      <StepList v-if="!$store.state.ui.layout.hideStepList"></StepList>
    </div>
    <div class="drawable-left-column-sizer">
      <button class="drawable-left-column-width-adjust" v-if="leftWidth !== normalWidth" @click="smallerLeft">&lt;
      </button>
      <button class="drawable-left-column-width-adjust" v-if="leftWidth !== wideWidth" @click="biggerLeft">&gt;
      </button>
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
    <LayoutSwitcher/>
  </section>
</template>

<script lang="ts">

import Drawing from "./drawing/Drawing.vue";
import DataEditor from "./dataEditor/DataEditor.vue";
import StepList from "./stepList/StepList.vue";
import PropertiesEditor from "./propertiesEditor/PropertiesEditor.vue";
import DrawableHeader from "./header.vue";
import StatementEditor from "./StatementEditor/StatementEditor.vue";
import ToolBar from "./ToolBar.vue";
import Modal from "./core/Modal.vue";
import ToolHint from "./ToolHint.vue";
import LibraryList from "./library/LibraryList.vue";
import {Icons} from "./css/icons/icons";
import LayoutSwitcher from "./LayoutSwitcher.vue";


const LEFT_NORMAL_WIDTH = 20;
const LEFT_WIDE_WIDTH = 40;

export default {
  name: "Drawable",
  components: {
    LayoutSwitcher,
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
    return {
      leftWidth: LEFT_NORMAL_WIDTH,
      normalWidth: LEFT_NORMAL_WIDTH,
      wideWidth: LEFT_WIDE_WIDTH
    }
  },

  mounted() {
    this.$refs.left.style.flexBasis = `${this.normalWidth}em`;
  },

  computed: {
    hideToolbar() {
      return this.$store.state.ui.layout.hideToolbar;
    }
  },

  methods: {
    onToggleLibrary() {
      this.controller.toggleLibrary();
    },

    smallerLeft() {
      if (this.leftWidth === LEFT_NORMAL_WIDTH) {
        return;
      }
      this.leftWidth = LEFT_NORMAL_WIDTH;
      this.$refs.left.style.flexBasis = `${this.leftWidth}em`;
    },

    biggerLeft() {
      if (this.leftWidth === LEFT_WIDE_WIDTH) {
        return;
      }
      this.leftWidth = LEFT_WIDE_WIDTH;
      this.$refs.left.style.flexBasis = `${this.leftWidth}em`;
    }
  }
}
</script>
