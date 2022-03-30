<template>
  <section class="drawable-app-header">
    <h1>{{ $t("ui.appName") }}<span>0.1&alpha;</span></h1>
    <span class="drawable-header-functions">
    <button @click="onNewDrawing" v-html="newIcon" title="Start a new Drawing"></button>
    <button @click="onSave" v-html="saveIcon" title="Save to Cloud Library"></button>
    <button @click="onPublish" v-html="exportJS" title="Publish as JavaScript"></button>
    <svg-saver/>
    </span>
    <span class="drawable-header-functions">
    <aspect-ratio-switcher/>
    <!--    <locale-switcher/>-->
    <profile-button/>
    </span>
  </section>
</template>

<script lang="ts">


import LocaleSwitcher from "./localeSwitcher.vue";
import AspectRatioSwitcher from "./aspectRatioSwitcher.vue";
import ProfileButton from "./Profile/ProfileButton.vue";
import SvgSaver from "./SVGSaver.vue";
import {AspectRatio} from "../geometry/AspectRatio";
import {Icons} from "./css/icons/icons";

export default {
  name: "drawable-header",
  components: { SvgSaver, ProfileButton, AspectRatioSwitcher, LocaleSwitcher },
  inject: ["controller"],

  data() {
    return {
      newIcon: Icons.NewDrawing,
      saveIcon: Icons.SaveDrawing,
      exportJS: Icons.ExportJS,
      ratios: [
        { ar: AspectRatio.ar1_1, label: "1:1" },
        { ar: AspectRatio.ar3_2, label: "3:2" },
        { ar: AspectRatio.ar4_3, label: "4:3" },
        { ar: AspectRatio.ar16_9, label: "16:9" },
        { ar: AspectRatio.ar16_10, label: "16:10" }
      ]
    }
  },

  methods: {
    setAspectRatio(value: AspectRatio) {
      this.controller.setAspectRatio(value);
    },

    onNewDrawing() {
      this.controller.clearAll();
    },

    onSave() {
      this.controller.saveDrawingToLibrary();
    },

    onPublish() {
      this.controller.publishDrawing();
    },
  }
}
</script>

<style scoped>

</style>