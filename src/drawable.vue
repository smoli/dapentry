<template>
  <section id="drawable-app-header">Header</section>
  <section id="drawable-app-main">
    <div id="drawable-left-column">
      <DataEditor></DataEditor>
      <StepList></StepList>
    </div>
    <div id="drawable-main-column">
      <samp class="drawable-statement-preview">Create Circle1 center at ( 100, 100 ) radius 50</samp>
      <Drawing></Drawing>
      <samp class="drawable-tool-hint">Create Circle1 center at ( 100, 100 ) radius 50</samp>
    </div>
    <div id="drawable-right-column">
      <PropertiesEditor></PropertiesEditor>
    </div>
  </section>
  <section id="drawable-app-footer">Footer</section>
</template>

<script>

import Drawing from "./drawing/Drawing";
import DataEditor from "./dataEditor/DataEditor";
import StepList from "./stepList/StepList";
import PropertiesEditor from "./propertiesEditor/PropertiesEditor";

export default {
  name: "Drawable",
  components: {PropertiesEditor, StepList, DataEditor, Drawing},
  inject: ["controller"],
  data() {
    return {message: "Welcome to drawable... the thing that does that thing with stuff and so ..."}
  },

  methods: {}
}
</script>
