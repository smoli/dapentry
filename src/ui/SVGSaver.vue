<template>
  <button @click="onSaveSVG">Export SVG</button>
</template>

<script lang="ts">
import {UserInfo} from "../state/modules/Authentication";
import {AppConfig} from "../core/AppConfig";

export default {
  name: "svg-saver",
  inject: ["controller"],

  methods: {
    onSaveSVG() {
      const dims = this.$store.state.drawing.dimensions;
      const userInfo:UserInfo = this.$store.state.auth.user;

      const pre = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dims.width} ${dims.height}">

            <!-- This file was created by dapentry.com, version ${AppConfig.dapentry.version}.
                 Drawing exported by ${userInfo.name}(${userInfo.email}) on ${new Date().toUTCString()}
                -->
`
      const post = `</svg>`
      const contents = this.$store.state.drawing.preview;

      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pre + contents + post));
      element.setAttribute('download', 'dapentry-drawing.svg');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }
}
</script>
