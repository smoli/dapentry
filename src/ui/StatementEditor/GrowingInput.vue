<template>
  <input ref="input" v-model="myValue" @keydown="onKeyDown"/>
</template>

<script lang="ts">


/**
 * https://stackoverflow.com/a/21015393
 *
 *
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(text, font) {
  // re-use canvas object for better performance
  // @ts-ignore
  const canvas = getTextWidth.canvas || ( getTextWidth.canvas = document.createElement("canvas") );
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function getCssStyle(element, prop) {
  return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getFontSize(el = document.body) {
  const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
  const fontSize = getCssStyle(el, 'font-size') || '16px';
  const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

  return `${fontWeight} ${fontSize} ${fontFamily}`;
}


export default {
  name: "GrowingInput",
  props: ["value"],

  data() {
    return {
      myValue: this.value
    }
  },

  mounted() {
    const inp = this.$refs["input"];
    inp.style.width = ( getTextWidth(this.myValue + "w", getFontSize(inp))) + "px";
  },

  methods: {
    onKeyDown(event) {
      const inp = this.$refs["input"];
      inp.style.width = ( getTextWidth(this.myValue + "w", getFontSize(inp))) + "px";
    }
  }
}
</script>
