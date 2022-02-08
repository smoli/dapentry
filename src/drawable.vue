<template>
  <drawable-header v-if="!hideHeader"></drawable-header>
  <section class="drawable-app-main">
    <div class="drawable-left-column" v-if="!hideLeftColumn">
      <DataEditor v-if="!hideDataEditor"></DataEditor>
      <StepList v-if="!hideStepList"></StepList>
    </div>
    <div class="drawable-main-column" v-if="!hideMainColumn">
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
import PropertiesEditor from "./propertiesEditor/PropertiesEditor";
import DrawableHeader from "./header";
import StatementEditor from "./StatementEditor/StatementEditor";


export default {
  name: "Drawable",
  components: { StatementEditor, DrawableHeader, PropertiesEditor, StepList, DataEditor, Drawing },
  inject: ["controller"],
  props: [
    "hideHeader",
    "hideFooter",
    "hideLeftColumn",
    "hideDataEditor",
    "hideStepList",
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
