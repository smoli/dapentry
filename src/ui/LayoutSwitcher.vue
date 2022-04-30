<template>

  <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1777 1000" height="3em" class="drawable-layout-switcher">
    <g>
      <g id="App">
        <path
            class="grObject" d="M 0 0 L 1777.7777777777778 0 L 1777.7777777777778 1000 L 0 1000 Z"
              style="fill: #828282; fill-opacity: 0.1; stroke: coral; stroke-width: 0"></path>
      </g>
      <g id="Header">
        <path @click="onToggleHeader"
            class="grObject" d="M 0 0 L 1777.7777777777778 0 L 1777.7777777777778 200 L 0 200 Z"
              style="fill: #ffd642; stroke: coral; stroke-width: 0"
              :style="{
                'fill-opacity': $store.state.ui.layout.hideHeader === true ? '0.5' :1
              }"
        ></path>
      </g>
      <g id="Footer">
        <path @click="onToggleFooter"
              class="grObject" d="M 0 800 L 1777.7777777777778 800 L 1777.7777777777778 1000 L 0 1000 Z"
              style="fill: #4a4a4a; stroke: coral; stroke-width: 0"
              :style="{
                'fill-opacity': $store.state.ui.layout.hideFooter === true ? '0.5' :1
              }"
        ></path>
      </g>
      <g id="Left">
        <path @click="onToggleLeftPanel"
              class="grObject"
              d="M 2.842170943040401e-14 200 L 266.66666666666674 200 L 266.66666666666674 800 L 2.842170943040401e-14 800 Z"
              style="fill: #b5b5b5; stroke: coral; stroke-width: 0"
              :style="{
                'fill-opacity': $store.state.ui.layout.hideLeftColumn === true ? '0.5' :1
              }"
        ></path>
      </g>
      <g id="Right">
        <path @click="onToggleRightPanel"
              class="grObject"
              d="M 1511.1111111111113 200 L 1777.7777777777778 200 L 1777.7777777777778 800 L 1511.1111111111113 800 Z"
              style="fill: #b5b5b5; stroke: coral; stroke-width: 0"
              :style="{
                'fill-opacity': $store.state.ui.layout.hideRightColumn === true ? '0.5' :1
                }"
        ></path>
      </g>
      <g id="Toolbar">
        <path @click="onToggleToolbar"
              class="grObject"
              d="M 515.5555555555555 200 L 1262.2222222222222 200 L 1262.2222222222222 380 L 515.5555555555555 380 Z"
              style="stroke: coral;stroke-width: 0; fill: #ffd642"
              :style="{
                'fill-opacity': $store.state.ui.layout.hideToolbar === true ? '0.5' :1
              }"

        ></path>
      </g>
      <g id="Hint">
        <path @click="onToggleToolHints"
              class="grObject"
              d="M 515.5555555555555 620 L 1262.2222222222222 620 L 1262.2222222222222 800 L 515.5555555555555 800 Z"
              style="fill: #b5b5b5; stroke: coral; stroke-width: 0"
              :style="{
                'fill-opacity': $store.state.ui.layout.hideToolHint === true ? '0.5' :1
              }"
        ></path>
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
export default {
  name: "LayoutSwitcher",
  inject: ["controller"],

  methods: {
    onToggleToolbar() {
      this.controller.toggleToolbar();
    },

    onToggleLeftPanel() {
      this.controller.toggleLeftPanel();
    },
    onToggleRightPanel() {
      this.controller.toggleRightPanel();
    },
    onToggleHeader() {
      this.controller.toggleHeader();
    },
    onToggleToolHints() {
      this.controller.toggleToolHints();
    },

    onToggleFooter() {
      // this.controller.toggleFooter();
    }
  }
}
</script>
