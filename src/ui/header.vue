<template>
  <section class="drawable-app-header">
    <h1>{{ $t("ui.appName") }}<span>0.1&alpha;</span></h1>
    <ul>
      <li v-for="r of ratios">
        <button @click="setAspectRatio(r.ar)">{{ r.label }}</button>
      </li>
      <!--      <li><button>Custom</button></li>-->
    </ul>
    <locale-switcher />

  </section>
</template>

<script lang="ts">


import {AspectRatio} from "../geometry/GrCanvas";
import LocaleSwitcher from "../i18n/localeSwitcher.vue";

export default {
  name: "drawable-header",
  components: { LocaleSwitcher },
  inject: ["controller"],

  data() {
    return {
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
    }
  }
}
</script>

<style scoped>

</style>