<template>
  <div class="aspect-ratio-switcher">
    <label>{{ $t("ui.aspectRatio") }}</label>
    <select v-bind="currentAR" @change="onArChanged">
      <option :key="`${currentAR.ar}`" :value="currentAR.ar"
              selected="selected" disabled="disabled">{{ currentAR.label }}</option>

      <option v-for="ar in availableARs" :key="`${ar.ar}`" :value="ar.ar" >{{ ar.label }}</option>

    </select>
  </div>
</template>

<script>
import {AspectRatio} from "../geometry/GrCanvas";

const ratios = [
  { ar: AspectRatio.ar1_1, label: "1:1" },
  { ar: AspectRatio.ar3_2, label: "3:2" },
  { ar: AspectRatio.ar4_3, label: "4:3" },
  { ar: AspectRatio.ar16_9, label: "16:9" },
  { ar: AspectRatio.ar16_10, label: "16:10" }
]


export default {
  name: "aspectRatioSwitcher",
  inject: ["controller"],
  computed: {
    currentAR() {
      return ratios.find(r => r.ar === this.$store.state.drawing.aspectRatio);
    },

    availableARs() {
      return ratios.filter(a => a.ar !== this.$store.state.drawing.aspectRatio);
    }
  },

  methods: {
    onArChanged(event) {
      const sel = event.target;
      if (sel.selectedOptions) {
        const value = sel.selectedOptions[0].value;
        this.controller.setAspectRatio(Number(value));
      }
    }
  }


}
</script>

<style scoped>

</style>