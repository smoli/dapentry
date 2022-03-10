<template>
  <svg id="r1" viewBox="-15 -15 1807.7777777777778 1030" height="4em" class="drawable-layout-switcher">
    <g>
      <g id="App">
        <path class="grObject" d="M 0 0 L 1777.7777777777778 0 L 1777.7777777777778 1000 L 0 1000 Z"
              style="fill: black; fill-opacity: 0.1; stroke: #e3e3e3; stroke-width: 50"/>
      </g>
      <g id="Header">
        <path  @click="onToggleHeader"
            class="grObject" d="M 0 0 L 1777.777777777778 0 L 1777.777777777778 123.41 L 0 123.41 Z"
              style="fill: black; fill-opacity: 0.1; stroke: #e3e3e3; stroke-width: 50"/>
      </g>
      <g id="Left">
        <path  @click="onToggleLeftPanel"
            class="grObject" d="M 0 123.41000000000003 L 404.3 123.41000000000003 L 404.3 877 L 0 877 Z"
              style="fill: black; fill-opacity: 0.1; stroke: #e3e3e3; stroke-width: 50"/>

      </g>
      <g id="Right">
        <path class="grObject"  @click="onToggleRightPanel"
              d="M 1373.4777777777776 123.41000000000003 L 1777.7777777777778 123.41000000000003 L 1777.7777777777778 877 L 1373.4777777777776 877 Z"
              style="fill: black; fill-opacity: 0.1; stroke: #e3e3e3; stroke-width: 50"/>

      </g>
      <g id="Toolbar">
        <path class="grObject" @click="onToggleToolbar"
              d="M 642.9688888888891 123.41000000000001 L 1134.808888888889 123.41000000000001 L 1134.808888888889 277.836624 L 642.9688888888891 277.836624 Z"
              style="fill: black; fill-opacity: 0.1; stroke: #e3e3e3; stroke-width: 50"/>
      </g>
      <g id="Hint">
        <path class="grObject"  @click="onToggleToolHints"
              d="M 559.5438888888889 718 L 1218.233888888889 718 L 1218.233888888889 877 L 559.5438888888889 877 Z"
              style="fill: black; fill-opacity: 0.1; stroke: #e3e3e3; stroke-width: 50"/>

      </g>

      <g id="Header">
        <path  @click="onToggleFooter"
               class="grObject" d="M 0 877 L 1777.777777777778 877 L 1777.777777777778 1000 L 0 1000 Z"
               style="fill: black; fill-opacity: 0.1; stroke: #e3e3e3; stroke-width: 50"/>
      </g>
    </g>
    <g/>
    <g style="pointer-events: none;"/>
    <g/>
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
