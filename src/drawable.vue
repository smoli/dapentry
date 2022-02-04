<template>
  <div @keydown="onKeyDown">
    <h1>{{ message }}</h1>
    <DataEditor></DataEditor>
    <StepList></StepList>
    <Drawing></Drawing>
    <PropertiesEditor></PropertiesEditor>
  </div>
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

  methods: {
    onKeyDown(event) {
      this.controller.handleKeyEvent(event);
    }
  }
}
</script>
