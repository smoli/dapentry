<template>
  <span>
  <input ref="input"
         @blur="$emit('onblur')"
         :value="validatedValue === null ? value : validatedValue"
         @keydown="onKeyDown"
         @keyup="onKeyUp"
         @mousedown="onMouseDown"
         @change="onChange"
         :type="type"
         :disabled="disabled"/>
  <span v-if="validationMessage" class="drawable-input-validation-message">{{ validationMessage }}</span>
  </span>

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
  if (!getTextWidth.canvas) {
  // @ts-ignore
    const c = getTextWidth.canvas = document.createElement("canvas")

    // c.style.position = "absolute";
    // c.style.top = "100px";
    // c.style.left = "100px";
    // c.style.zIndex = "10000000";
    //
    // document.body.appendChild(c);

  }

  // @ts-ignore
  const canvas = getTextWidth.canvas;

  const context = canvas.getContext("2d");
  context.font = font;
  // context.fillText(text, 10, 50);
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
  props: ["value", "type", "disabled", "autofocus", "min", "max", "draggable", "validationMessage"],
  emits: ["cancel", "change"],

  data() {

    return {
      originalValue: this.value,
      validatedValue: null,
      offset: this.type === "number" ? 20 : 0
    }
  },

  updated() {
    const inp = this.$refs["input"];
    this.updateWidth(inp.value);
  },


  mounted() {
    const inp = this.$refs["input"];
    this.updateWidth(this.originalValue);
    if (this.autofocus) {
      inp.focus();
    }
  },

  methods: {
    updateWidth(value) {
      const inp = this.$refs["input"];
      if (!inp) {
        return;
      }
      inp.style.width = ( getTextWidth(value, getFontSize(inp)) + this.offset ) + "px";
    },

    onKeyDown(event: KeyboardEvent) {
      const inp = this.$refs["input"];
      const newChar = event.key.length === 1 ? event.key : ""
      this.updateWidth(inp.value + newChar);
    },

    onKeyUp(event: KeyboardEvent) {
      if (event.key !== "Backspace" && event.key !== "Delete" && event.key !== "Escape" && event.key !== "Enter") {
        return;
      }
      const inp = this.$refs["input"];

      if (event.key === "Escape") {
        this.validatedValue = null;
        inp.value = this.originalValue;
        this.updateWidth(inp.value);
        inp.blur();
        this.$emit("cancel");
      }

      if (event.key === "Enter" && !this.validationMessage) {
        inp.blur();
      }

      this.updateWidth(inp.value);
    },

    onChange(event) {
      this.validatedValue = this.$refs["input"].value;
      this.originalValue = this.$refs["input"].value;
      this.$emit("change", event);
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
          factor = ( max - min ) / 400;
        }

        window.document.body.classList.add("drawable-force-cursor");
        window.document.body.style.cursor = "ew-resize";

        window.onmousemove = (event: MouseEvent) => {
          const inp = this.$refs["input"];

          let nv = Number(inp.value) + factor * event.movementX;

          if (nv < min) {
            nv = min;
          } else if (nv > max) {
            nv = max;
          }

          this.originalValue = inp.value = nv.toFixed(2);
          this.updateWidth(inp.value);
          const e = new Event("change");
          inp.dispatchEvent(e);
        }

        window.onmouseup = () => {
          window.onmousemove = oldMouseMoveHandler;
          window.onmouseup = oldMouseUpHandler;
          window.document.body.classList.remove("drawable-force-cursor");
          window.document.body.style.cursor = null;
        }

      }
    }
  }
}
</script>
