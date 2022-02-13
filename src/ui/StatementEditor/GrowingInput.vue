<template>
  <input ref="input" @blur="$emit('onblur')" v-model="myValue" @keydown="onKeyDown" :type="type" :disabled="disabled"/>
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
  props: ["value", "type", "disabled", "autofocus"],

  data() {

    return {
      myValue: this.value,
      offset: this.type === "number" ? 20 : 0
    }
  },

  watch: {
    value() {
      const inp = this.$refs["input"];
      inp.style.width = ( getTextWidth(this.myValue, getFontSize(inp)) + this.offset) + "px";
    }
  },

  mounted() {
    const inp = this.$refs["input"];
    inp.style.width = ( getTextWidth(this.myValue, getFontSize(inp)) + this.offset) + "px";
    if (this.autofocus) {
      inp.focus();
    }
  },

  methods: {
    onKeyDown(event: KeyboardEvent) {
      const inp = this.$refs["input"];
      const newChar = event.key.length === 1 ? event.key : ""
      inp.style.width = ( getTextWidth(this.myValue + newChar, getFontSize(inp)) + this.offset) + "px";
    }
  }
}
</script>
