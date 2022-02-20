<template>
  <input ref="input"
         @blur="$emit('onblur')"
         :value="value"
         @keydown="onKeyDown"
         @keyup="onKeyUp"
         @mousedown="onMouseDown"
         @change="onChange"
         :type="type"
         :disabled="disabled"/>
</template>

<script lang="ts">/**
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
import {AppConfig} from "../../core/AppConfig";


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
  props: ["value", "type", "disabled", "autofocus", "min", "max", "draggable"],

  data() {

    return {
      originalValue: this.value,
      offset: this.type === "number" ? 20 : 0
    }
  },

  watch: {
    value() {
      const inp = this.$refs["input"];
      inp.style.width = ( getTextWidth(inp.value, getFontSize(inp)) + this.offset) + "px";
    }
  },

  mounted() {
    const inp = this.$refs["input"];
    inp.style.width = ( getTextWidth(inp.value, getFontSize(inp)) + this.offset) + "px";
    if (this.autofocus) {
      inp.focus();
    }
  },

  methods: {
    onKeyDown(event: KeyboardEvent) {
      const inp = this.$refs["input"];
      const newChar = event.key.length === 1 ? event.key : ""
      inp.style.width = ( getTextWidth(inp.value + newChar, getFontSize(inp)) + this.offset) + "px";
    },

    onKeyUp(event: KeyboardEvent) {
      if (event.key !== "Backspace" && event.key !== "Delete" && event.key !== "Escape" && event.key !== "Enter") {
        return;
      }
      const inp = this.$refs["input"];

      if (event.key === "Escape") {
        inp.value = this.originalValue;
        inp.style.width = ( getTextWidth(inp.value, getFontSize(inp)) + this.offset) + "px";
        inp.blur();
      }

      if (event.key === "Enter") {
        inp.blur();
      }

      inp.style.width = ( getTextWidth(inp.value, getFontSize(inp)) + this.offset) + "px";
    },

    onChange() {
        this.originalValue = this.$refs["input"].value;
    },

    onMouseDown(event: MouseEvent) {
      const inp = this.$refs["input"];
      if (event[AppConfig.Keys.NumericDragModifierName]) {
        if (isNaN(inp.value)) {
          return;
        }
        event.preventDefault();

        const oldMouseMoveHandler = window.onmousemove;
        const oldMouseUpHandler = window.onmouseup;
        inp.focus();

        let min = Number.MIN_SAFE_INTEGER;
        let max = Number.MAX_SAFE_INTEGER;
        let factor = 1;
        if (this.min !== undefined && this.max !== undefined) {
          min = this.min;
          max = this.max;
          factor = (max - min) / 400;
        }

        window.onmousemove = (event: MouseEvent) => {
          const inp = this.$refs["input"];

          let nv = Number(inp.value) + factor * event.movementX;

          if (nv < min) {
            nv = min;
          } else if (nv > max) {
            nv = max;
          }

          this.originalValue = inp.value = nv.toFixed(2);
          inp.style.width = ( getTextWidth(inp.value, getFontSize(inp)) + this.offset) + "px";
          const e = new Event("change");
          inp.dispatchEvent(e);
        }

        window.onmouseup = () => {
          window.onmousemove = oldMouseMoveHandler;
          window.onmouseup = oldMouseUpHandler;
        }

      }
    }
  }
}
</script>
